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
    units: ['t', 'm³', 'kWh', 'L', 'kg', 'Nm³', '万kWh'],
    subTypes: [
      { id: 'water', name: '水务介质（自来水/软水/中水）' },
      { id: 'gas', name: '燃气介质（天然气/液化气/沼气）' },
      { id: 'steam', name: '蒸汽热力（集中供热管网蒸汽）' },
      { id: 'oil', name: '动力燃油（柴油/汽油/机油）' },
      { id: 'ind_gas', name: '工业气体（液氧/液氮/氩气/二氧化碳）' },
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

// 初始常规能源消耗指标 (17项：7项实物介质消耗 + 5项费用发票 + 4项绿电 + 1项管理审计)
const INITIAL_METRICS: MetricItem[] = [
  // 1. 实物介质消耗 (7项)
  { id: 'm-1', name: '用水量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '水务介质', unit: 't', value: '8900', lastMonthValue: '8650', remark: '市政自来水水表月度抄报底数', sourceLabel: '市政水表抄报' },
  { id: 'm-2', name: '天然气量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '燃气介质', unit: 'm³', value: '28400', lastMonthValue: '27200', remark: '燃气锅炉与车间烘干加热消耗', sourceLabel: '专用燃气表' },
  { id: 'm-3', name: '外购蒸汽量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '蒸汽热力', unit: 't', value: '1420', lastMonthValue: '1380', remark: '集中供热管网蒸汽抄表结算量', sourceLabel: '热网总表' },
  { id: 'm-4', name: '油消耗量（柴油/汽油）', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '动力用油', unit: 'L', value: '320', lastMonthValue: '350', remark: '应急发电机试车与厂区叉车领用', sourceLabel: '领用台账' },
  { id: 'm-5', name: '液氧工业气体', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '工业气体', unit: 't', value: '45.0', lastMonthValue: '42.0', remark: '钢板下料切割与绝缘件加工助燃消耗', sourceLabel: '地磅称重' },
  { id: 'm-ext', name: '外协委外加工电耗分摊', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '外协用电', unit: 'kWh', value: '12400', lastMonthValue: '11800', remark: '外协绝缘喷涂等结算单分摊', sourceLabel: '工单分摊' },
  { id: 'm-self', name: '自备余热自发自用电量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '光伏自用', unit: 'kWh', value: '68500', lastMonthValue: '65000', remark: '热电及余热发电机组自用抄表', sourceLabel: '逆变器采集' },

  // 2. 能源费用发票 (5项)
  { id: 'm-6', name: '市电费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '电力费用', unit: '万元', value: '142.50', lastMonthValue: '138.20', remark: '国网电力月度电费增值税发票总额', sourceLabel: '增值税发票' },
  { id: 'm-7', name: '天然气费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '燃气费用', unit: '万元', value: '8.52', lastMonthValue: '8.16', remark: '新奥燃气月度发票结算金额', sourceLabel: '燃气结算发票' },
  { id: 'm-8', name: '外购蒸汽费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '蒸汽费用', unit: '万元', value: '32.66', lastMonthValue: '31.74', remark: '园区热力公司当期发票对账单', sourceLabel: '热力对账单' },
  { id: 'm-9', name: '用水费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '水费账单', unit: '万元', value: '4.89', lastMonthValue: '4.76', remark: '自来水水务集团缴费凭单', sourceLabel: '水务发票' },
  { id: 'm-10', name: '油费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '燃油费用', unit: '万元', value: '0.24', lastMonthValue: '0.26', remark: '中石化加油卡充值及柴油发票', sourceLabel: '中石化凭单' },

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
    models: [
      { id: 'm-101', modelCode: 'TB-S20-630', modelName: 'S20-M-630/10 高效油浸式变压器', subTypeName: '油浸式电力变压器', unit: '台/万kVA', output: '48' },
      { id: 'm-102', modelCode: 'TB-SZ11-50M', modelName: 'SZ11-50000/110 有载调压变压器', subTypeName: '油浸式电力变压器', unit: '台/万kVA', output: '36' },
      { id: 'm-103', modelCode: 'TB-ODFPS-1000', modelName: 'ODFPS-1000MVA/1000kV 特高压变压器', subTypeName: '特高压交流变压器', unit: '台/万kVA', output: '44' },
    ],
  },
  {
    id: 'prod-2',
    categoryId: 'reactor',
    categoryName: '电抗器',
    unit: '台/万kVA',
    value: '45',
    lastMonthValue: '40',
    sourceType: 'manual',
    sourceLabel: '厂级ERP/自填',
    isPrimary: true,
    workshop: '特种电抗器分厂',
    remark: '特高压交流配套并联电抗器',
    models: [
      { id: 'm-201', modelCode: 'TB-BKD-66', modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器', subTypeName: '特高压并联电抗器', unit: '台/万kVA', output: '45' },
    ],
  },
  {
    id: 'prod-3',
    categoryId: 'silicon_steel_core',
    categoryName: '硅钢铁心',
    unit: '吨',
    value: '3200',
    lastMonthValue: '3100',
    sourceType: 'mes',
    sourceLabel: '车间MES直通',
    isPrimary: false,
    workshop: '铁心剪切智能车间',
    remark: '0.23mm 高磁感取向硅钢片',
    models: [
      { id: 'm-301', modelCode: 'TB-CORE-023', modelName: '0.23mm 高磁感取向硅钢铁心', output: '3200' },
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


  // 1. 产品产量状态
  const [activeProducts, setActiveProducts] = useState<ActiveProductRecord[]>(INITIAL_ACTIVE_PRODUCTS)
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

    setIsAddProductModalOpen(false)
    setSuccessToast({
      show: true,
      msg: `已成功添加产品【${categoryName} - ${fullName}】，请在列表中直接填写完工数量与车间！`,
      batch: 'ADD-PRODUCT',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
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
    const summaryText = `水 ${metrics[0].value}t · 气 ${metrics[1].value}m³ · 绿电 ${metrics[10].value}kWh · ${prodSummary} · 照片 ${parkPhotos.length}张 · 大事记 ${milestones.length}条`

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
    setSuccessToast({
      show: true,
      msg: `${selectedYear}年${selectedMonth}月工厂数据申报已成功${status === '已入库' ? '校验入库' : '暂存待复核'}！涵盖 4 大模块数据与现场照片。`,
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

      {/* 🌟 1. 顶部工厂月度申报看板 */}
      <div className="rounded-2xl border bg-card border-border p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary">
              <Factory className="size-6" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                {selectedYear} 年 {selectedMonth} 月度工厂能碳数据定时申报
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                申报开放中
              </span>
            </div>
          </div>

          {/* 快捷操作区：保留历史台账入口 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'entry' ? 'history' : 'entry')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-panel/70 hover:bg-panel/90 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
            >
              <History className="size-3.5 text-primary" />
              <span>历史台账 ({historyList.length})</span>
            </button>
          </div>
        </div>
      </div>

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
              <span className={cn(
                'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                activeModuleTab === 'production' ? 'bg-black/20 text-white' : 'bg-panel text-muted-foreground'
              )}>
                {activeProducts.length} 类
              </span>
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
              <span className={cn(
                'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                activeModuleTab === 'energy' ? 'bg-black/20 text-white' : 'bg-panel text-muted-foreground'
              )}>
                16 项
              </span>
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
              <span className={cn(
                'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                activeModuleTab === 'photos' ? 'bg-black/20 text-white' : 'bg-panel text-muted-foreground'
              )}>
                {parkPhotos.length} 张
              </span>
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
              <span className={cn(
                'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                activeModuleTab === 'events' ? 'bg-black/20 text-white' : 'bg-panel text-muted-foreground'
              )}>
                {milestones.length} 条
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveEntry('待复核')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-panel hover:bg-panel/90 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
            >
              <Save className="size-3.5 text-muted-foreground" />
              <span>暂存草稿</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveEntry('已入库')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Check className="size-4" />
              <span>确认并提交</span>
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
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-foreground">工业产品产量申报台账</h2>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-bold font-mono">
                        已申报 {equipmentRows.length} 项产品设备
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      以列表形式汇集全厂已申报产品完工产量，支持通过弹窗按下拉框标准化添加或在列表直接修改数量
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>添加产品产量</span>
                  </button>

                </div>
              </div>

              {/* 核心品类汇总 KPI 卡片行 (点击可联动筛选列表) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                    selectedCategoryFilter === 'all'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border bg-card hover:border-primary/40'
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>全品类汇总完工</span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-panel border border-border">全部</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-mono font-extrabold text-foreground">{equipmentRows.length}</span>
                    <span className="text-xs text-muted-foreground">项设备规格</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                    涵盖 {activeProducts.length} 个工业核心品类
                  </div>
                </button>

                {activeProducts.map((p) => {
                  const isSelected = selectedCategoryFilter === p.categoryName
                  const currVal = parseFloat(p.value) || 0
                  const lastVal = parseFloat(p.lastMonthValue) || 0
                  const diff = lastVal > 0 ? (((currVal - lastVal) / lastVal) * 100).toFixed(1) : '0'

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(isSelected ? 'all' : p.categoryName)}
                      className={cn(
                        'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-border bg-card hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground truncate">{p.categoryName}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">上月: {p.lastMonthValue}</span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-mono font-extrabold text-primary">{p.value}</span>
                        <span className="text-xs text-muted-foreground font-mono">{p.unit}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center justify-between mt-0.5">
                        <span>{p.models.length} 项细分型号</span>
                        {lastVal > 0 && (
                          <span className={cn('font-mono font-bold', Number(diff) >= 0 ? 'text-emerald-500' : 'text-rose-400')}>
                            {Number(diff) >= 0 ? `+${diff}% ↑` : `${diff}% ↓`}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* 44px 工业高密度数据表格 */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold select-none">
                      <th className="px-3 py-0 w-12 text-center">#</th>
                      <th className="px-3 py-0 text-center">产品大类</th>
                      <th className="px-3 py-0">产品子类型</th>
                      <th className="px-3 py-0">产品名称</th>
                      <th className="px-3 py-0">填报完工数量 <span className="text-[10px] text-primary font-normal">（可直接修改）</span></th>
                      <th className="px-3 py-0">上月基准</th>
                      <th className="px-3 py-0">数据来源</th>
                      <th className="px-3 py-0 text-right w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-border/50">
                    {filteredEquipmentRows.length > 0 ? (
                      filteredEquipmentRows.map((row, idx) => (
                        <tr key={row.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                          <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                          {equipmentCategorySpans[idx] > 0 && (
                            <td
                              rowSpan={equipmentCategorySpans[idx]}
                              className="px-3 py-2 text-center align-middle font-bold text-foreground bg-panel/30 dark:bg-[#0b1324]/40 border-r border-border/60"
                            >
                              <div className="flex items-center justify-center gap-1.5 font-bold text-foreground whitespace-nowrap">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                <span>{row.categoryName}</span>
                                {equipmentCategorySpans[idx] > 1 && (
                                  <span className="text-[10px] font-mono text-muted-foreground bg-panel px-1.5 py-0.2 rounded border border-border/60">
                                    {equipmentCategorySpans[idx]}项
                                  </span>
                                )}
                              </div>
                            </td>
                          )}
                          <td className="px-3 py-0">
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                              {row.subTypeName}
                            </span>
                          </td>
                          <td className="px-3 py-0 font-medium text-foreground">
                            <span className="truncate max-w-[320px] inline-block align-middle font-medium" title={row.modelName}>
                              {row.modelName}
                            </span>
                          </td>
                          <td className="px-3 py-1 font-mono">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={row.output}
                                onChange={(e) => {
                                  if (row.modelId) {
                                    handleModelQuantityChange(row.productId, row.modelId, e.target.value)
                                  } else {
                                    handleProductFieldChange(row.productId, 'value', e.target.value)
                                  }
                                }}
                                className="w-28 h-7 px-2.5 rounded-md bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-primary font-mono font-bold text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-2xs"
                                title="可在列表直接修改完工数量，并实时自动汇总更新"
                              />
                              <span className="text-xs font-mono text-muted-foreground select-none font-medium">{row.unit}</span>
                            </div>
                          </td>
                          <td className="px-3 py-0 font-mono text-muted-foreground text-xs">
                            {row.lastMonthValue} {row.unit}
                          </td>
                          <td className="px-3 py-0">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-bold border',
                                row.sourceType === 'auto'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : row.sourceType === 'mes'
                                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              )}
                            >
                              {row.sourceLabel}
                            </span>
                          </td>
                          <td className="px-3 py-0 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteEquipmentRow(row)}
                              className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="移除此项设备产量"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground font-medium">
                          暂无相关产品！
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
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-foreground">全厂能源消耗与费用申报台账</h2>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-bold font-mono">
                        已申报 {metrics.length} 项能耗指标
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      以列表形式汇集全厂能源实物消耗、费用发票与绿电凭证，支持通过弹窗标准化添加或在列表直接修改填报数据
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddEnergyModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>添加能源消耗</span>
                  </button>
                </div>
              </div>

              {/* 核心分类汇总 KPI 卡片行 (点击可联动筛选列表) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* 1. 全介质汇总 */}
                <button
                  type="button"
                  onClick={() => setSelectedEnergyCategoryFilter('all')}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                    selectedEnergyCategoryFilter === 'all'
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border bg-card hover:border-primary/40'
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>全介质汇总</span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-panel border border-border">全部</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-mono font-extrabold text-foreground">{metrics.length}</span>
                    <span className="text-xs text-muted-foreground">项申报指标</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                    涵盖 4 大能耗业务领域
                  </div>
                </button>

                {/* 2. 能源介质实物消耗 */}
                <button
                  type="button"
                  onClick={() => setSelectedEnergyCategoryFilter(selectedEnergyCategoryFilter === 'energy' ? 'all' : 'energy')}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                    selectedEnergyCategoryFilter === 'energy'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                      : 'border-border bg-card hover:border-amber-500/40'
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground truncate">实物介质消耗</span>
                    <span className="text-[10px] font-mono text-muted-foreground">水/气/汽/油/气</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-mono font-extrabold text-amber-500">
                      {metrics.filter((m) => m.category === 'energy').length}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">项实物</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    水8900t · 气2.8万m³
                  </div>
                </button>

                {/* 3. 能源费用发票 */}
                <button
                  type="button"
                  onClick={() => setSelectedEnergyCategoryFilter(selectedEnergyCategoryFilter === 'cost' ? 'all' : 'cost')}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                    selectedEnergyCategoryFilter === 'cost'
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                      : 'border-border bg-card hover:border-emerald-500/40'
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground truncate">能源费用发票</span>
                    <span className="text-[10px] font-mono text-muted-foreground">5项发票</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-mono font-extrabold text-emerald-500">¥{totalCostWan}</span>
                    <span className="text-xs text-muted-foreground font-mono">万元</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    发票实缴支出总额
                  </div>
                </button>

                {/* 4. 购买绿电与凭证 */}
                <button
                  type="button"
                  onClick={() => setSelectedEnergyCategoryFilter(selectedEnergyCategoryFilter === 'green' ? 'all' : 'green')}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                    selectedEnergyCategoryFilter === 'green'
                      ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                      : 'border-border bg-card hover:border-purple-500/40'
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground truncate">购买绿电与凭证</span>
                    <span className="text-[10px] font-mono text-muted-foreground">双边直供</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-mono font-extrabold text-purple-400">148.2</span>
                    <span className="text-xs text-muted-foreground font-mono">万kWh</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    绿证划转 1.8 万个
                  </div>
                </button>

                {/* 5. 管理与审计指标 */}
                <button
                  type="button"
                  onClick={() => setSelectedEnergyCategoryFilter(selectedEnergyCategoryFilter === 'economy' ? 'all' : 'economy')}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                    selectedEnergyCategoryFilter === 'economy'
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                      : 'border-border bg-card hover:border-blue-500/40'
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground truncate">管理与审计</span>
                    <span className="text-[10px] font-mono text-muted-foreground">直报产值</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-mono font-extrabold text-blue-400">
                      {metrics.find((m) => m.id === 'm-ind')?.value || '4280.0'}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">万元</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    工业增加值统计口径
                  </div>
                </button>
              </div>

              {/* 44px 工业高密度数据表格 */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold select-none">
                      <th className="px-3 py-0 w-12 text-center">#</th>
                      <th className="px-3 py-0 text-center">能源大类</th>
                      <th className="px-3 py-0">能源子类型</th>
                      <th className="px-3 py-0">能源消耗项目名称</th>
                      <th className="px-3 py-0">当月填报数量 / 金额 <span className="text-[10px] text-primary font-normal">（可直接修改）</span></th>
                      <th className="px-3 py-0">上月基准</th>
                      <th className="px-3 py-0">数据来源 / 凭证</th>
                      <th className="px-3 py-0 text-right w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-border/50">
                    {filteredEnergyMetrics.length > 0 ? (
                      filteredEnergyMetrics.map((row, idx) => {
                        const isDayMonthSupported = row.id === 'm-1' || row.id === 'm-3'
                        const mode = isDayMonthSupported ? dimModes[row.id as 'm-1' | 'm-3'] : 'month'

                        return (
                          <tr key={row.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                            <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                            {energyCategorySpans[idx] > 0 && (
                              <td
                                rowSpan={energyCategorySpans[idx]}
                                className="px-3 py-2 text-center align-middle font-bold text-foreground bg-panel/30 dark:bg-[#0b1324]/40 border-r border-border/60"
                              >
                                <div className="flex items-center justify-center gap-1.5 font-bold text-foreground whitespace-nowrap">
                                  <span
                                    className={cn(
                                      'size-2 rounded-full shrink-0',
                                      row.category === 'energy'
                                        ? 'bg-amber-400'
                                        : row.category === 'cost'
                                        ? 'bg-emerald-400'
                                        : row.category === 'green'
                                        ? 'bg-purple-400'
                                        : 'bg-blue-400'
                                    )}
                                  />
                                  <span>{row.categoryLabel}</span>
                                  {energyCategorySpans[idx] > 1 && (
                                    <span className="text-[10px] font-mono text-muted-foreground bg-panel px-1.5 py-0.2 rounded border border-border/60">
                                      {energyCategorySpans[idx]}项
                                    </span>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="px-3 py-0">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[11px] font-medium border whitespace-nowrap',
                                  row.category === 'energy'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : row.category === 'cost'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : row.category === 'green'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                )}
                              >
                                {row.subTypeName || '常规介质'}
                              </span>
                            </td>
                            <td className="px-3 py-0 font-medium text-foreground">
                              <span className="truncate max-w-[280px] inline-block align-middle font-medium" title={row.name}>
                                {row.name}
                              </span>
                            </td>
                            <td className="px-3 py-1 font-mono">
                              {row.unit === '日期' ? (
                                <input
                                  type="date"
                                  value={row.value}
                                  onChange={(e) => handleMetricChange(row.id, e.target.value)}
                                  className="w-32 h-7 px-2 rounded-md bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-2xs"
                                />
                              ) : isDayMonthSupported && mode === 'day' ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="flex items-center gap-1 px-2 h-7 rounded-md bg-primary/10 border border-primary/30 text-primary font-mono font-bold text-xs">
                                    <span>{row.value}</span>
                                    <span className="text-[10px] text-muted-foreground">{row.unit}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDailyModal(row.id as 'm-1' | 'm-3')}
                                    className="px-2 h-7 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                                    title="打开31天逐日填报"
                                  >
                                    31天录入
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDimMode(row.id as 'm-1' | 'm-3', 'month')}
                                    className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer underline px-0.5"
                                  >
                                    切月度
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    step="any"
                                    value={row.value}
                                    onChange={(e) => handleMetricChange(row.id, e.target.value)}
                                    className="w-28 h-7 px-2.5 rounded-md bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono font-bold text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-2xs"
                                    title="可在列表直接修改当月填报数值，并实时动态重算汇总"
                                  />
                                  <span className="text-xs font-mono text-muted-foreground select-none font-medium">{row.unit}</span>
                                  {isDayMonthSupported && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleDimMode(row.id as 'm-1' | 'm-3', 'day')}
                                      className="text-[10px] text-muted-foreground hover:text-primary cursor-pointer border border-border px-1 py-0.5 rounded ml-1"
                                      title="切换为31天日累计录入模式"
                                    >
                                      日累计
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-0 font-mono text-muted-foreground text-xs">
                              {row.lastMonthValue} {row.unit !== '日期' ? row.unit : ''}
                            </td>
                            <td className="px-3 py-0">
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold border bg-panel text-muted-foreground border-border/80 truncate max-w-[160px] inline-block align-middle"
                                title={row.remark}
                              >
                                {row.sourceLabel || row.remark}
                              </span>
                            </td>
                            <td className="px-3 py-0 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteEnergyMetric(row.id)}
                                className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                title="移除此项能源指标"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground font-medium">
                          暂无相关能源消耗！
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 【模块 3】：园区照片 (Park Photos Gallery) */}
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
      {/* 视图模式 2：历史台账归档视图 */}
      {/* ========================================================================= */}
      {viewMode === 'history' && (
        <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <History className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">月度工厂数据申报历史归档台账</h2>
                <p className="text-[11px] text-muted-foreground">历次填报入库批次记录、主要能耗与产量概览及审核状态</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('entry')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              <span>返回填报工作台</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="h-[44px] bg-panel/80 dark:bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold">
                  <th className="px-4 py-0">申报批次号</th>
                  <th className="px-4 py-0">申报年月</th>
                  <th className="px-4 py-0">申报人</th>
                  <th className="px-4 py-0">提交时间</th>
                  <th className="px-4 py-0">申报摘要概览</th>
                  <th className="px-4 py-0">能源发票总额</th>
                  <th className="px-4 py-0">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60">
                {historyList.map((rec) => (
                  <tr key={rec.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                    <td className="px-4 py-0 font-mono font-bold text-primary">{rec.batch}</td>
                    <td className="px-4 py-0 font-mono text-foreground font-bold">{rec.year}-{rec.month}</td>
                    <td className="px-4 py-0 text-foreground">{rec.submitter}</td>
                    <td className="px-4 py-0 font-mono text-muted-foreground">{rec.submitTime}</td>
                    <td className="px-4 py-0 text-muted-foreground/90 truncate max-w-xs" title={rec.summary}>
                      {rec.summary}
                    </td>
                    <td className="px-4 py-0 font-mono font-bold text-emerald-400">¥ {rec.totalCostWan} 万</td>
                    <td className="px-4 py-0">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold border',
                        rec.status === '已入库'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      )}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
            {/* ───────────────────────────────────────────────────────────────── */}
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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      选择产品大类与产品子类型，手动填写具体产品名称，添加至列表后在表格直接填写完工数量
                    </p>
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

                {/* 4. 计量单位选择 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-400" />
                      <span>4. 计量单位 *</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      已按产品大类智能匹配，可按实际核算口径切换
                    </span>
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
                    <p className="text-[11px] text-muted-foreground">
                      选择能源大类与子类型，手动填写能源项目名称，添加至列表后在表格直接填写完工数量
                    </p>
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
                  <p className="text-[11px] text-muted-foreground">
                    多媒体影像数据，用于零碳园区集中控制大屏轮播视窗及零碳工厂认证档案
                  </p>
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
                  <p className="text-[11px] text-muted-foreground">
                    记录园区关键大事件与现场照片，同步驱动零碳园区集控大屏大事记流动时间轴
                  </p>
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
    </div>
  )
}

// 零碳工厂自评估核心数据与配置字典
// 严格遵循特变电工工业设计规范与 13 项数字化功能、3 大披露载体权威标准

// 零碳供应链 6 大降碳措施规范选项
export const SUPPLY_CHAIN_MEASURES_OPTIONS = [
  { id: 'sc-1', title: '1. 健全管理制度', desc: '建立绿色低碳供应链管理制度与供应商低碳准入标准' },
  { id: 'sc-2', title: '2. 碳数据协同', desc: '搭建供应链碳排放数据采集与核算协同机制' },
  { id: 'sc-3', title: '3. 供应商赋能与培育', desc: '定期组织开展供应商碳减排赋能培训与现场低碳诊断' },
  { id: 'sc-4', title: '4. 资源循环利用 (EPR)', desc: '实施原材料包装循环共用及废旧物资/余料回收闭环利用' },
  { id: 'sc-5', title: '5. 信息化与数字化管理', desc: '部署供应链碳足迹与绿色物料全流程信息化追踪系统' },
  { id: 'sc-6', title: '6. 绿色低碳清洁物流', desc: '厂内及主要干线采用新能源/清洁运输车辆比例 ≥ 85%' },
]

// 能碳管理中心 13 项权威数字化功能模块检查项目
export const CONTROL_CENTER_FEATURE_OPTIONS = [
  { id: 'cc-1', title: '（1）能耗查询', desc: '各车间、重点设备电水气热实时能耗查询与工况监测' },
  { id: 'cc-2', title: '（2）能源消费量和强度计算', desc: '单位产品能耗及工业增加值能耗动态折标计算' },
  { id: 'cc-3', title: '（3）能源消费分析与用能策略推荐', desc: '峰谷电价负荷转移、空压机群控运行策略优化' },
  { id: 'cc-4', title: '（4）能效对标', desc: '国家能耗限额标准、行业标杆值及历史同期横纵向对标' },
  { id: 'cc-5', title: '（5）能流分析', desc: '全厂购入存储、转换输配、终端消耗全景能流图' },
  { id: 'cc-6', title: '（6）能效平衡与优化', desc: '变压器负荷率均衡、无功补偿与管网动态平衡' },
  { id: 'cc-7', title: '（7）用能与碳排放预算管理', desc: '按月/季度制定能耗与碳配额预算指标与超额预警' },
  { id: 'cc-8', title: '（8）碳排放核算', desc: '范围一、范围二温室气体排放实时在线折算' },
  { id: 'cc-9', title: '（9）产品碳足迹核算', desc: '变压器/特种电缆等代表产品全生命周期 LCA 在线核算' },
  { id: 'cc-10', title: '（10）供应链碳管理', desc: '供应商碳数据报送、绿色供应链准入评价与协同管理' },
  { id: 'cc-11', title: '（11）碳核查支撑', desc: '符合 ISO 14064 标准的温室气体核查源数据与凭单台账' },
  { id: 'cc-12', title: '（12）碳资产管理', desc: '全国碳市场配额盈缺预测、绿电绿证交易台账管理' },
  { id: 'cc-13', title: '（13）智能分析与辅助决策支持', desc: '零碳工厂达标路径推演与节能降碳技改 ROI 决策' },
]

// 碳排放信息披露 3 大权威载体文件
export const DISCLOSURE_DOC_OPTIONS = [
  { id: 'doc-1', title: '（1）可持续发展报告', desc: '定期公开披露企业可持续发展目标、能耗强度与减排行动成效' },
  { id: 'doc-2', title: '（2）ESG 报告', desc: '公开披露环境、社会与公司治理碳减排绩效与双碳治理机制' },
  { id: 'doc-3', title: '（3）零碳工厂建设报告', desc: '公开披露工厂源头减碳、过程脱碳及零碳工厂体系建设成果' },
]

export interface EvaluationAttachment {
  id: string
  name: string
  size: string
  uploadTime: string
  type: 'pdf' | 'xlsx' | 'docx' | 'img'
}

// 指标子项对应的标准证明材料元数据字典模板 (1-to-1 权威映射)
export const ITEM_PROOF_TEMPLATES: Record<
  string,
  { nameTemplate: string; size: string; type: 'pdf' | 'xlsx' | 'docx' }
> = {
  // 零碳供应链 6 大措施
  'sc-1': { nameTemplate: '绿色供应链管理制度.pdf', size: '4.1 MB', type: 'pdf' },
  'sc-2': { nameTemplate: '供应链碳排协同核算台账.docx', size: '1.5 MB', type: 'docx' },
  'sc-3': { nameTemplate: '供应商碳盘查培训记录.docx', size: '1.7 MB', type: 'docx' },
  'sc-4': { nameTemplate: '物料循环利用与回收协议.pdf', size: '2.8 MB', type: 'pdf' },
  'sc-5': { nameTemplate: '绿色物料全流程追踪凭证.pdf', size: '2.3 MB', type: 'pdf' },
  'sc-6': { nameTemplate: '纯电运输车辆配置方案.docx', size: '1.1 MB', type: 'docx' },

  // 能碳管理中心 13 项权威数字化功能
  'cc-1': { nameTemplate: '物联仪表能耗监测配置台账.pdf', size: '2.4 MB', type: 'pdf' },
  'cc-2': { nameTemplate: '单耗与增加值折标核验报告.pdf', size: '1.8 MB', type: 'pdf' },
  'cc-3': { nameTemplate: '错峰用电与群控运行方案.pdf', size: '2.1 MB', type: 'pdf' },
  'cc-4': { nameTemplate: '能耗限额标准对标报告.pdf', size: '1.6 MB', type: 'pdf' },
  'cc-5': { nameTemplate: '全厂全景能流拓扑图.pdf', size: '3.5 MB', type: 'pdf' },
  'cc-6': { nameTemplate: '变压器负载均衡优化报告.pdf', size: '1.9 MB', type: 'pdf' },
  'cc-7': { nameTemplate: '用能预算与碳配额台账.docx', size: '1.2 MB', type: 'docx' },
  'cc-8': { nameTemplate: '范围1/2温室气体核算报告.pdf', size: '2.8 MB', type: 'pdf' },
  'cc-9': { nameTemplate: '代表产品LCA碳足迹报告.pdf', size: '4.2 MB', type: 'pdf' },
  'cc-10': { nameTemplate: '绿色供应链准入评价报告.pdf', size: '2.0 MB', type: 'pdf' },
  'cc-11': { nameTemplate: 'ISO14064第三方核查台账.pdf', size: '3.1 MB', type: 'pdf' },
  'cc-12': { nameTemplate: '碳市场配额与绿电交易说明.docx', size: '1.5 MB', type: 'docx' },
  'cc-13': { nameTemplate: '零碳工厂达标路径与ROI报告.pdf', size: '3.8 MB', type: 'pdf' },

  // 碳排放信息披露 3 大载体文件
  'doc-1': { nameTemplate: '企业可持续发展报告.pdf', size: '8.5 MB', type: 'pdf' },
  'doc-2': { nameTemplate: '企业ESG年度披露报告.pdf', size: '6.2 MB', type: 'pdf' },
  'doc-3': { nameTemplate: '零碳工厂双碳治理成效报告.pdf', size: '4.8 MB', type: 'pdf' },
}

// 获取指标子项对应的证明材料列表（支持工厂级自定义上传，缺省时自动匹配权威标准对应材料）
export function getMetricItemAttachments(
  factory: FactoryEvaluationData,
  itemId: string
): EvaluationAttachment[] {
  // 锁定的指标项目（如 2.3 碳清除率）与系统自动采集指标（1.1, 1.2, 1.3, 2.1, 3.1）无需证明材料
  if (['2.3', '1.1', '1.2', '1.3', '2.1', '3.1'].includes(itemId)) {
    return []
  }
  if (factory.attachments && factory.attachments[itemId] && factory.attachments[itemId].length > 0) {
    return factory.attachments[itemId]
  }

  const tmpl = ITEM_PROOF_TEMPLATES[itemId]
  if (!tmpl) return []

  const fileName = tmpl.nameTemplate.replace('{factory}_', '')

  return [
    {
      id: `att-${factory.id}-${itemId}`,
      name: fileName,
      size: tmpl.size,
      uploadTime: factory.declareDate ? `${factory.declareDate} 16:00` : '2026-08-20 16:00',
      type: tmpl.type,
    },
  ]
}

export interface FactoryEvaluationData {
  id: string
  company: string
  factoryName: string
  carbonClearRate: number // 碳清除率（锁定不可修改，目前特变电工无该指标信息）
  autoCollectRate: number
  supplyChainMeasuresCount: number
  controlCenterFeaturesCount: number
  disclosureDocsCount: number
  supplyChainMeasures: string[]
  controlCenterFeatures: string[]
  disclosureFiles: string[]
  attachments: Record<string, EvaluationAttachment[]>
  metrics: {
    '1.1': { name: '单位能耗碳排放'; value: number | string; unit: string; type: 'auto' }
    '1.2': { name: '非化石能源消费占比'; value: number; unit: '%'; type: 'auto' }
    '1.3': { name: '非化石能源电力消费物理认定量占比'; value: number; unit: '%'; type: 'auto' }
    '2.1': { name: '单位工业增加值能耗'; value: string | number; unit: string; type: 'auto' }
    '2.2': { name: '节能装备应用占比'; value: number | string; unit: string; type: 'declared' }
    '2.3': { name: '碳清除率'; value: number | string; unit: string; type: 'declared' }
    '3.1': { name: '开展产品碳足迹分析占比'; value: number; unit: '%'; type: 'auto' }
    '3.2': { name: '零碳供应链管理措施符合项数'; value: string; unit: ''; type: 'declared' }
    '4.1': { name: '能碳管理中心能源数据自动采集率'; value: number; unit: '%'; type: 'declared' }
    '4.2': { name: '能碳管理中心功能符合项数'; value: string; unit: ''; type: 'declared' }
    '5.1': { name: '碳排放信息披露透明度与质量'; value: string; unit: ''; type: 'declared' }
  }
  status: '已自评已申报' | '自评待审核' | '申报中'
  evaluator: string
  declareDate: string
  notes?: string
}

export const ALL_ZERO_CARBON_FACTORIES: FactoryEvaluationData[] = [
  {
    "id": "f-sb-1",
    "company": "沈变公司",
    "factoryName": "沈变本部",
    "carbonClearRate": 0,
    "autoCollectRate": 98.6,
    "supplyChainMeasuresCount": 6,
    "controlCenterFeaturesCount": 13,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5",
      "sc-6"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12",
      "cc-13"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.395,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 92,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 28,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 8.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 93,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已符合 6/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 98.6,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已符合 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已归档 3/3 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "沈变能碳运营办",
    "declareDate": "2026-08-28",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-sb-1-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-sb-1-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-sb-1-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-1-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-sb-1-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-1-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-1-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-sb-2",
    "company": "沈变公司",
    "factoryName": "露娜公司",
    "carbonClearRate": 0,
    "autoCollectRate": 98,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 13,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12",
      "cc-13"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.375,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 25.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 7.6,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 91.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 98,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已符合 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "露娜智能制造办",
    "declareDate": "2026-08-26",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-sb-2-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-sb-2-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-sb-2-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-2-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-sb-2-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-2-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-2-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-sb-4",
    "company": "沈变公司",
    "factoryName": "和新套管公司",
    "carbonClearRate": 0,
    "autoCollectRate": 97.2,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.360,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 87.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 24,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 97.2,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "和新安环部",
    "declareDate": "2026-08-24",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-sb-4-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-sb-4-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-sb-4-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-4-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-sb-4-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-4-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-4-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-sb-5",
    "company": "沈变公司",
    "factoryName": "康嘉互感器",
    "carbonClearRate": 0,
    "autoCollectRate": 96.8,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.355,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "康嘉技术部",
    "declareDate": "2026-08-22",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-sb-5-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-sb-5-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-sb-5-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-5-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-sb-5-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-5-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-5-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-1",
    "company": "衡变公司",
    "factoryName": "衡变本部",
    "carbonClearRate": 0,
    "autoCollectRate": 98,
    "supplyChainMeasuresCount": 6,
    "controlCenterFeaturesCount": 13,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5",
      "sc-6"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12",
      "cc-13"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.380,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 26,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 92,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已符合 6/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 98,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已符合 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已归档 3/3 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "衡变双碳管理室",
    "declareDate": "2026-08-27",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-1-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-1-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-1-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-1-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-1-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-1-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-1-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-2",
    "company": "衡变公司",
    "factoryName": "南京电研",
    "carbonClearRate": 0,
    "autoCollectRate": 97.5,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 13,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12",
      "cc-13"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.370,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 25,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 7.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 91,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 97.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已符合 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "南京电研能碳办",
    "declareDate": "2026-08-25",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-2-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-2-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-2-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-2-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-2-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-2-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-2-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-3",
    "company": "衡变公司",
    "factoryName": "云集电气",
    "carbonClearRate": 0,
    "autoCollectRate": 97,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.362,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 88,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 24,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 97,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "云集电气生产部",
    "declareDate": "2026-08-24",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-3-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-3-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-3-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-3-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-3-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-3-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-3-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-4",
    "company": "衡变公司",
    "factoryName": "湖南电气",
    "carbonClearRate": 0,
    "autoCollectRate": 96.8,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.358,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 87,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "湖南电气制造部",
    "declareDate": "2026-08-23",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-4-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-4-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-4-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-4-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-4-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-4-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-4-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-5",
    "company": "衡变公司",
    "factoryName": "云集高压开关",
    "carbonClearRate": 0,
    "autoCollectRate": 96.5,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.350,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 86,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "开关制造部",
    "declareDate": "2026-08-22",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-5-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-5-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-5-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-5-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-5-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-5-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-5-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-6",
    "company": "衡变公司",
    "factoryName": "新疆自控",
    "carbonClearRate": 0,
    "autoCollectRate": 96.2,
    "supplyChainMeasuresCount": 4,
    "controlCenterFeaturesCount": 11,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.345,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 85,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 22,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 88,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.2,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "自控工程部",
    "declareDate": "2026-08-21",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-6-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-6-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-6-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-6-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-6-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-6-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-6-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-9",
    "company": "衡变公司",
    "factoryName": "特能建",
    "carbonClearRate": 0,
    "autoCollectRate": 95.5,
    "supplyChainMeasuresCount": 4,
    "controlCenterFeaturesCount": 11,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.330,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 83.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 20.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 5.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 95.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "特能建能环处",
    "declareDate": "2026-08-18",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-9-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-9-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-9-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-9-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-9-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-9-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-9-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-10",
    "company": "衡变公司",
    "factoryName": "合容电气",
    "carbonClearRate": 0,
    "autoCollectRate": 95.2,
    "supplyChainMeasuresCount": 4,
    "controlCenterFeaturesCount": 11,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.325,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 83,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 20,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 5.4,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 86,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 95.2,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "合容电气制造处",
    "declareDate": "2026-08-17",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-10-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-10-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-10-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-10-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-10-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-10-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-10-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-hb-11",
    "company": "衡变公司",
    "factoryName": "赛杰爱迪",
    "carbonClearRate": 0,
    "autoCollectRate": 95,
    "supplyChainMeasuresCount": 4,
    "controlCenterFeaturesCount": 11,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.320,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 82.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 19.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 5.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 85.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 95,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "赛杰爱迪安环部",
    "declareDate": "2026-08-16",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-hb-11-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-hb-11-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-hb-11-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-11-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-hb-11-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-11-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-11-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-xb-1",
    "company": "新变厂",
    "factoryName": "超高压公司",
    "carbonClearRate": 0,
    "autoCollectRate": 98.4,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 13,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12",
      "cc-13"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.380,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 26.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 7.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 92,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 98.4,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已符合 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "新变智能制造办",
    "declareDate": "2026-08-26",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-xb-1-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-xb-1-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-xb-1-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-1-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-xb-1-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-1-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-1-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-xb-2",
    "company": "新变厂",
    "factoryName": "天变公司",
    "carbonClearRate": 0,
    "autoCollectRate": 97.5,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.365,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 88,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 24.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 7,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 90.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 97.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "天变能环处",
    "declareDate": "2026-08-25",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-xb-2-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-xb-2-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-xb-2-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-2-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-xb-2-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-2-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-2-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-xb-3",
    "company": "新变厂",
    "factoryName": "智能电气公司",
    "carbonClearRate": 0,
    "autoCollectRate": 97,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.360,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 87,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 97,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "智能电气工程部",
    "declareDate": "2026-08-24",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-xb-3-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-xb-3-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-xb-3-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-3-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-xb-3-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-3-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-3-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-xb-4",
    "company": "新变厂",
    "factoryName": "京津冀公司",
    "carbonClearRate": 0,
    "autoCollectRate": 96.8,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.355,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "京津冀生产部",
    "declareDate": "2026-08-23",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-xb-4-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-xb-4-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-xb-4-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-4-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-xb-4-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-4-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-4-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-xb-5",
    "company": "新变厂",
    "factoryName": "珠峰硅钢",
    "carbonClearRate": 0,
    "autoCollectRate": 96.5,
    "supplyChainMeasuresCount": 4,
    "controlCenterFeaturesCount": 11,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.350,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 85.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 22.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 88.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "珠峰硅钢技术部",
    "declareDate": "2026-08-22",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-xb-5-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-xb-5-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-xb-5-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-5-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-xb-5-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-5-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-5-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-ll-1",
    "company": "鲁缆公司",
    "factoryName": "鲁缆本部",
    "carbonClearRate": 0,
    "autoCollectRate": 97,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.350,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 87,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 97,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "鲁缆设备环保处",
    "declareDate": "2026-08-24",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-ll-1-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-ll-1-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-ll-1-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-ll-1-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-ll-1-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-ll-1-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-ll-1-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-xl-1",
    "company": "新缆厂",
    "factoryName": "特变电工新疆电缆有限公司",
    "carbonClearRate": 0,
    "autoCollectRate": 96.8,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.345,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "新缆安环处",
    "declareDate": "2026-08-25",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-xl-1-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-xl-1-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-xl-1-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xl-1-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-xl-1-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xl-1-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xl-1-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  },
  {
    "id": "f-dl-1",
    "company": "德缆公司",
    "factoryName": "特变电工（德阳）电缆股份有限公司",
    "carbonClearRate": 0,
    "autoCollectRate": 96.5,
    "supplyChainMeasuresCount": 5,
    "controlCenterFeaturesCount": 12,
    "disclosureDocsCount": 3,
    "supplyChainMeasures": [
      "sc-1",
      "sc-2",
      "sc-3",
      "sc-4",
      "sc-5"
    ],
    "controlCenterFeatures": [
      "cc-1",
      "cc-2",
      "cc-3",
      "cc-4",
      "cc-5",
      "cc-6",
      "cc-7",
      "cc-8",
      "cc-9",
      "cc-10",
      "cc-11",
      "cc-12"
    ],
    "disclosureFiles": [
      "doc-1",
      "doc-2",
      "doc-3"
    ],
    "metrics": {
      "1.1": {
        "name": "单位能耗碳排放",
        "value": 0.340,
        "unit": "tCO₂/tce",
        "type": "auto"
      },
      "1.2": {
        "name": "非化石能源消费占比",
        "value": 86,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "非化石能源电力消费物理认定量占比",
        "value": 22.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "单位工业增加值能耗",
        "value": "0.048",
        "unit": "tce/万元",
        "type": "auto"
      },
      "2.2": {
        "name": "节能装备应用占比",
        "value": 92.0,
        "unit": "%",
        "type": "declared"
      },
      "2.3": {
        "name": "碳清除率",
        "value": 6,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "开展产品碳足迹分析占比",
        "value": 88.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施符合项数",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "能碳管理中心能源数据自动采集率",
        "value": 96.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能符合项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度与质量",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "德缆安环处",
    "declareDate": "2026-08-23",
    "attachments": {
                              "2.2": [
        {
          "id": "att-f-dl-1-22-1",
          "name": "重点用能装备能效核验台账.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [],
            "3.2": [
        {
          "id": "att-f-dl-1-32-1",
          "name": "绿色供应链管理制度.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-32-2",
          "name": "供应商碳盘查培训记录.docx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "docx"
        },
        {
          "id": "att-f-dl-1-32-3",
          "name": "物料循环利用与回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-dl-1-41-1",
          "name": "计量器具与自动采集清单.docx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "docx"
        },
        {
          "id": "att-f-dl-1-41-2",
          "name": "智能表计通信测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-dl-1-42-1",
          "name": "能碳管理中心验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-dl-1-51-1",
          "name": "企业可持续发展与ESG报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-51-2",
          "name": "零碳工厂推进自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  }
]

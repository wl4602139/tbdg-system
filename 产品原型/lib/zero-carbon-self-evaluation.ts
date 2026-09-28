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
  { id: 'doc-3', title: '（3）零碳工厂建设报告', desc: '公开披露工厂源头减碳、过程削碳及零碳工厂体系建设成果' },
]

export interface EvaluationAttachment {
  id: string
  name: string
  size: string
  uploadTime: string
  type: 'pdf' | 'xlsx' | 'docx' | 'img'
}

export interface FactoryEvaluationData {
  id: string
  company: string
  factoryName: string
  carbonClearRate: number // 碳清除率（置灰锁定不可修改，目前特变电工无该指标信息）
  autoCollectRate: number
  supplyChainMeasuresCount: number
  controlCenterFeaturesCount: number
  disclosureDocsCount: number
  supplyChainMeasures: string[]
  controlCenterFeatures: string[]
  disclosureFiles: string[]
  attachments: Record<string, EvaluationAttachment[]>
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
        "name": "非化石电力消费比例",
        "value": 39.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 92,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 28,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 8.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 93,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 6/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 98.6,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 5/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "沈变能碳运营办",
    "declareDate": "2026-08-28",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-sb-1-11-1",
          "name": "沈变本部_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-11-2",
          "name": "沈变本部_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-sb-1-12-1",
          "name": "沈变本部_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-1-12-2",
          "name": "沈变本部_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-sb-1-13-1",
          "name": "沈变本部_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-sb-1-21-1",
          "name": "沈变本部_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-21-2",
          "name": "沈变本部_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-sb-1-22-1",
          "name": "沈变本部_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-sb-1-23-1",
          "name": "沈变本部_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-sb-1-31-1",
          "name": "沈变本部_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-31-2",
          "name": "沈变本部_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-sb-1-32-1",
          "name": "沈变本部_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-32-2",
          "name": "沈变本部_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-1-32-3",
          "name": "沈变本部_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-1-41-1",
          "name": "沈变本部_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-1-41-2",
          "name": "沈变本部_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-1-42-1",
          "name": "沈变本部_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-1-51-1",
          "name": "沈变本部_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-1-51-2",
          "name": "沈变本部_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 37.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 25.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 7.6,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 91.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 98,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "露娜智能制造办",
    "declareDate": "2026-08-26",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-sb-2-11-1",
          "name": "露娜公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-11-2",
          "name": "露娜公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-sb-2-12-1",
          "name": "露娜公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-2-12-2",
          "name": "露娜公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-sb-2-13-1",
          "name": "露娜公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-sb-2-21-1",
          "name": "露娜公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-21-2",
          "name": "露娜公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-sb-2-22-1",
          "name": "露娜公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-sb-2-23-1",
          "name": "露娜公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-sb-2-31-1",
          "name": "露娜公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-31-2",
          "name": "露娜公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-sb-2-32-1",
          "name": "露娜公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-32-2",
          "name": "露娜公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-2-32-3",
          "name": "露娜公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-2-41-1",
          "name": "露娜公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-2-41-2",
          "name": "露娜公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-2-42-1",
          "name": "露娜公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-2-51-1",
          "name": "露娜公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-2-51-2",
          "name": "露娜公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 36,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 87.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 24,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 97.2,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "和新安环部",
    "declareDate": "2026-08-24",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-sb-4-11-1",
          "name": "和新套管公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-11-2",
          "name": "和新套管公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-sb-4-12-1",
          "name": "和新套管公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-4-12-2",
          "name": "和新套管公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-sb-4-13-1",
          "name": "和新套管公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-sb-4-21-1",
          "name": "和新套管公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-21-2",
          "name": "和新套管公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-sb-4-22-1",
          "name": "和新套管公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-sb-4-23-1",
          "name": "和新套管公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-sb-4-31-1",
          "name": "和新套管公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-31-2",
          "name": "和新套管公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-sb-4-32-1",
          "name": "和新套管公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-32-2",
          "name": "和新套管公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-4-32-3",
          "name": "和新套管公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-4-41-1",
          "name": "和新套管公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-4-41-2",
          "name": "和新套管公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-4-42-1",
          "name": "和新套管公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-4-51-1",
          "name": "和新套管公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-4-51-2",
          "name": "和新套管公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 35.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "康嘉技术部",
    "declareDate": "2026-08-22",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-sb-5-11-1",
          "name": "康嘉互感器_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-11-2",
          "name": "康嘉互感器_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-sb-5-12-1",
          "name": "康嘉互感器_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-5-12-2",
          "name": "康嘉互感器_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-sb-5-13-1",
          "name": "康嘉互感器_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-sb-5-21-1",
          "name": "康嘉互感器_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-21-2",
          "name": "康嘉互感器_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-sb-5-22-1",
          "name": "康嘉互感器_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-sb-5-23-1",
          "name": "康嘉互感器_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-sb-5-31-1",
          "name": "康嘉互感器_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-31-2",
          "name": "康嘉互感器_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-sb-5-32-1",
          "name": "康嘉互感器_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-32-2",
          "name": "康嘉互感器_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-5-32-3",
          "name": "康嘉互感器_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-sb-5-41-1",
          "name": "康嘉互感器_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-sb-5-41-2",
          "name": "康嘉互感器_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-sb-5-42-1",
          "name": "康嘉互感器_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-sb-5-51-1",
          "name": "康嘉互感器_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-sb-5-51-2",
          "name": "康嘉互感器_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 38,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 26,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 92,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 6/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 98,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 5/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "衡变双碳管理室",
    "declareDate": "2026-08-27",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-1-11-1",
          "name": "衡变本部_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-11-2",
          "name": "衡变本部_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-1-12-1",
          "name": "衡变本部_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-1-12-2",
          "name": "衡变本部_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-1-13-1",
          "name": "衡变本部_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-1-21-1",
          "name": "衡变本部_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-21-2",
          "name": "衡变本部_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-1-22-1",
          "name": "衡变本部_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-1-23-1",
          "name": "衡变本部_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-1-31-1",
          "name": "衡变本部_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-31-2",
          "name": "衡变本部_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-1-32-1",
          "name": "衡变本部_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-32-2",
          "name": "衡变本部_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-1-32-3",
          "name": "衡变本部_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-1-41-1",
          "name": "衡变本部_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-1-41-2",
          "name": "衡变本部_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-1-42-1",
          "name": "衡变本部_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-1-51-1",
          "name": "衡变本部_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-1-51-2",
          "name": "衡变本部_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 37,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 25,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 7.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 91,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 97.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "南京电研能碳办",
    "declareDate": "2026-08-25",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-2-11-1",
          "name": "南京电研_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-11-2",
          "name": "南京电研_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-2-12-1",
          "name": "南京电研_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-2-12-2",
          "name": "南京电研_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-2-13-1",
          "name": "南京电研_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-2-21-1",
          "name": "南京电研_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-21-2",
          "name": "南京电研_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-2-22-1",
          "name": "南京电研_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-2-23-1",
          "name": "南京电研_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-2-31-1",
          "name": "南京电研_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-31-2",
          "name": "南京电研_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-2-32-1",
          "name": "南京电研_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-32-2",
          "name": "南京电研_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-2-32-3",
          "name": "南京电研_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-2-41-1",
          "name": "南京电研_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-2-41-2",
          "name": "南京电研_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-2-42-1",
          "name": "南京电研_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-2-51-1",
          "name": "南京电研_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-2-51-2",
          "name": "南京电研_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 36.2,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 88,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 24,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 97,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "云集电气生产部",
    "declareDate": "2026-08-24",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-3-11-1",
          "name": "云集电气_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-11-2",
          "name": "云集电气_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-3-12-1",
          "name": "云集电气_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-3-12-2",
          "name": "云集电气_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-3-13-1",
          "name": "云集电气_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-3-21-1",
          "name": "云集电气_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-21-2",
          "name": "云集电气_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-3-22-1",
          "name": "云集电气_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-3-23-1",
          "name": "云集电气_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-3-31-1",
          "name": "云集电气_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-31-2",
          "name": "云集电气_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-3-32-1",
          "name": "云集电气_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-32-2",
          "name": "云集电气_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-3-32-3",
          "name": "云集电气_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-3-41-1",
          "name": "云集电气_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-3-41-2",
          "name": "云集电气_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-3-42-1",
          "name": "云集电气_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-3-51-1",
          "name": "云集电气_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-3-51-2",
          "name": "云集电气_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 35.8,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 87,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "湖南电气制造部",
    "declareDate": "2026-08-23",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-4-11-1",
          "name": "湖南电气_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-11-2",
          "name": "湖南电气_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-4-12-1",
          "name": "湖南电气_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-4-12-2",
          "name": "湖南电气_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-4-13-1",
          "name": "湖南电气_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-4-21-1",
          "name": "湖南电气_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-21-2",
          "name": "湖南电气_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-4-22-1",
          "name": "湖南电气_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-4-23-1",
          "name": "湖南电气_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-4-31-1",
          "name": "湖南电气_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-31-2",
          "name": "湖南电气_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-4-32-1",
          "name": "湖南电气_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-32-2",
          "name": "湖南电气_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-4-32-3",
          "name": "湖南电气_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-4-41-1",
          "name": "湖南电气_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-4-41-2",
          "name": "湖南电气_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-4-42-1",
          "name": "湖南电气_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-4-51-1",
          "name": "湖南电气_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-4-51-2",
          "name": "湖南电气_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 35,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 86,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "开关制造部",
    "declareDate": "2026-08-22",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-5-11-1",
          "name": "云集高压开关_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-11-2",
          "name": "云集高压开关_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-5-12-1",
          "name": "云集高压开关_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-5-12-2",
          "name": "云集高压开关_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-5-13-1",
          "name": "云集高压开关_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-5-21-1",
          "name": "云集高压开关_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-21-2",
          "name": "云集高压开关_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-5-22-1",
          "name": "云集高压开关_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-5-23-1",
          "name": "云集高压开关_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-5-31-1",
          "name": "云集高压开关_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-31-2",
          "name": "云集高压开关_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-5-32-1",
          "name": "云集高压开关_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-32-2",
          "name": "云集高压开关_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-5-32-3",
          "name": "云集高压开关_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-5-41-1",
          "name": "云集高压开关_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-5-41-2",
          "name": "云集高压开关_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-5-42-1",
          "name": "云集高压开关_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-5-51-1",
          "name": "云集高压开关_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-5-51-2",
          "name": "云集高压开关_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
    "controlCenterFeaturesCount": 13,
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
        "name": "非化石电力消费比例",
        "value": 34.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 85,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 22,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "二级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 88,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.2,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "自控工程部",
    "declareDate": "2026-08-21",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-6-11-1",
          "name": "新疆自控_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-11-2",
          "name": "新疆自控_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-6-12-1",
          "name": "新疆自控_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-6-12-2",
          "name": "新疆自控_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-6-13-1",
          "name": "新疆自控_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-6-21-1",
          "name": "新疆自控_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-21-2",
          "name": "新疆自控_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-6-22-1",
          "name": "新疆自控_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-6-23-1",
          "name": "新疆自控_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-6-31-1",
          "name": "新疆自控_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-31-2",
          "name": "新疆自控_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-6-32-1",
          "name": "新疆自控_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-32-2",
          "name": "新疆自控_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-6-32-3",
          "name": "新疆自控_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-6-41-1",
          "name": "新疆自控_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-6-41-2",
          "name": "新疆自控_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-6-42-1",
          "name": "新疆自控_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-6-51-1",
          "name": "新疆自控_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-6-51-2",
          "name": "新疆自控_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
    "controlCenterFeaturesCount": 13,
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
        "name": "非化石电力消费比例",
        "value": 33,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 83.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 20.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "二级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 5.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 95.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "特能建能环处",
    "declareDate": "2026-08-18",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-9-11-1",
          "name": "特能建_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-11-2",
          "name": "特能建_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-9-12-1",
          "name": "特能建_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-9-12-2",
          "name": "特能建_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-9-13-1",
          "name": "特能建_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-9-21-1",
          "name": "特能建_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-21-2",
          "name": "特能建_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-9-22-1",
          "name": "特能建_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-9-23-1",
          "name": "特能建_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-9-31-1",
          "name": "特能建_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-31-2",
          "name": "特能建_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-9-32-1",
          "name": "特能建_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-32-2",
          "name": "特能建_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-9-32-3",
          "name": "特能建_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-9-41-1",
          "name": "特能建_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-9-41-2",
          "name": "特能建_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-9-42-1",
          "name": "特能建_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-9-51-1",
          "name": "特能建_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-9-51-2",
          "name": "特能建_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
    "controlCenterFeaturesCount": 13,
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
        "name": "非化石电力消费比例",
        "value": 32.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 83,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 20,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "二级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 5.4,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 86,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 95.2,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "合容电气制造处",
    "declareDate": "2026-08-17",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-10-11-1",
          "name": "合容电气_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-11-2",
          "name": "合容电气_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-10-12-1",
          "name": "合容电气_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-10-12-2",
          "name": "合容电气_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-10-13-1",
          "name": "合容电气_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-10-21-1",
          "name": "合容电气_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-21-2",
          "name": "合容电气_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-10-22-1",
          "name": "合容电气_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-10-23-1",
          "name": "合容电气_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-10-31-1",
          "name": "合容电气_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-31-2",
          "name": "合容电气_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-10-32-1",
          "name": "合容电气_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-32-2",
          "name": "合容电气_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-10-32-3",
          "name": "合容电气_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-10-41-1",
          "name": "合容电气_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-10-41-2",
          "name": "合容电气_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-10-42-1",
          "name": "合容电气_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-10-51-1",
          "name": "合容电气_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-10-51-2",
          "name": "合容电气_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
    "controlCenterFeaturesCount": 13,
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
        "name": "非化石电力消费比例",
        "value": 32,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 82.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 19.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "二级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 5.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 85.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 95,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "赛杰爱迪安环部",
    "declareDate": "2026-08-16",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-hb-11-11-1",
          "name": "赛杰爱迪_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-11-2",
          "name": "赛杰爱迪_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-hb-11-12-1",
          "name": "赛杰爱迪_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-11-12-2",
          "name": "赛杰爱迪_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-hb-11-13-1",
          "name": "赛杰爱迪_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-hb-11-21-1",
          "name": "赛杰爱迪_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-21-2",
          "name": "赛杰爱迪_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-hb-11-22-1",
          "name": "赛杰爱迪_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-hb-11-23-1",
          "name": "赛杰爱迪_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-hb-11-31-1",
          "name": "赛杰爱迪_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-31-2",
          "name": "赛杰爱迪_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-hb-11-32-1",
          "name": "赛杰爱迪_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-32-2",
          "name": "赛杰爱迪_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-11-32-3",
          "name": "赛杰爱迪_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-hb-11-41-1",
          "name": "赛杰爱迪_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-hb-11-41-2",
          "name": "赛杰爱迪_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-hb-11-42-1",
          "name": "赛杰爱迪_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-hb-11-51-1",
          "name": "赛杰爱迪_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-hb-11-51-2",
          "name": "赛杰爱迪_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 38,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 90,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 26.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 7.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 92,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 98.4,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 13/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "新变智能制造办",
    "declareDate": "2026-08-26",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-xb-1-11-1",
          "name": "超高压公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-11-2",
          "name": "超高压公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-xb-1-12-1",
          "name": "超高压公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-1-12-2",
          "name": "超高压公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-xb-1-13-1",
          "name": "超高压公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-xb-1-21-1",
          "name": "超高压公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-21-2",
          "name": "超高压公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-xb-1-22-1",
          "name": "超高压公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-xb-1-23-1",
          "name": "超高压公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-xb-1-31-1",
          "name": "超高压公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-31-2",
          "name": "超高压公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-xb-1-32-1",
          "name": "超高压公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-32-2",
          "name": "超高压公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-1-32-3",
          "name": "超高压公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-1-41-1",
          "name": "超高压公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-1-41-2",
          "name": "超高压公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-1-42-1",
          "name": "超高压公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-1-51-1",
          "name": "超高压公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-1-51-2",
          "name": "超高压公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 36.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 88,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 24.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 7,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 90.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 97.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "天变能环处",
    "declareDate": "2026-08-25",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-xb-2-11-1",
          "name": "天变公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-11-2",
          "name": "天变公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-xb-2-12-1",
          "name": "天变公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-2-12-2",
          "name": "天变公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-xb-2-13-1",
          "name": "天变公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-xb-2-21-1",
          "name": "天变公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-21-2",
          "name": "天变公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-xb-2-22-1",
          "name": "天变公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-xb-2-23-1",
          "name": "天变公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-xb-2-31-1",
          "name": "天变公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-31-2",
          "name": "天变公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-xb-2-32-1",
          "name": "天变公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-32-2",
          "name": "天变公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-2-32-3",
          "name": "天变公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-2-41-1",
          "name": "天变公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-2-41-2",
          "name": "天变公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-2-42-1",
          "name": "天变公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-2-51-1",
          "name": "天变公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-2-51-2",
          "name": "天变公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 36,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 87,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.8,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 97,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "智能电气工程部",
    "declareDate": "2026-08-24",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-xb-3-11-1",
          "name": "智能电气公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-11-2",
          "name": "智能电气公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-xb-3-12-1",
          "name": "智能电气公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-3-12-2",
          "name": "智能电气公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-xb-3-13-1",
          "name": "智能电气公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-xb-3-21-1",
          "name": "智能电气公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-21-2",
          "name": "智能电气公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-xb-3-22-1",
          "name": "智能电气公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-xb-3-23-1",
          "name": "智能电气公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-xb-3-31-1",
          "name": "智能电气公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-31-2",
          "name": "智能电气公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-xb-3-32-1",
          "name": "智能电气公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-32-2",
          "name": "智能电气公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-3-32-3",
          "name": "智能电气公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-3-41-1",
          "name": "智能电气公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-3-41-2",
          "name": "智能电气公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-3-42-1",
          "name": "智能电气公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-3-51-1",
          "name": "智能电气公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-3-51-2",
          "name": "智能电气公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 35.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "京津冀生产部",
    "declareDate": "2026-08-23",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-xb-4-11-1",
          "name": "京津冀公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-11-2",
          "name": "京津冀公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-xb-4-12-1",
          "name": "京津冀公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-4-12-2",
          "name": "京津冀公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-xb-4-13-1",
          "name": "京津冀公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-xb-4-21-1",
          "name": "京津冀公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-21-2",
          "name": "京津冀公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-xb-4-22-1",
          "name": "京津冀公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-xb-4-23-1",
          "name": "京津冀公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-xb-4-31-1",
          "name": "京津冀公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-31-2",
          "name": "京津冀公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-xb-4-32-1",
          "name": "京津冀公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-32-2",
          "name": "京津冀公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-4-32-3",
          "name": "京津冀公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-4-41-1",
          "name": "京津冀公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-4-41-2",
          "name": "京津冀公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-4-42-1",
          "name": "京津冀公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-4-51-1",
          "name": "京津冀公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-4-51-2",
          "name": "京津冀公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
    "controlCenterFeaturesCount": 13,
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
        "name": "非化石电力消费比例",
        "value": 35,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 85.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 22.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "达到国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 88.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 4/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 11/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 3/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "珠峰硅钢技术部",
    "declareDate": "2026-08-22",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-xb-5-11-1",
          "name": "珠峰硅钢_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-11-2",
          "name": "珠峰硅钢_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-xb-5-12-1",
          "name": "珠峰硅钢_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-5-12-2",
          "name": "珠峰硅钢_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-xb-5-13-1",
          "name": "珠峰硅钢_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-xb-5-21-1",
          "name": "珠峰硅钢_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-21-2",
          "name": "珠峰硅钢_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-xb-5-22-1",
          "name": "珠峰硅钢_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-xb-5-23-1",
          "name": "珠峰硅钢_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-xb-5-31-1",
          "name": "珠峰硅钢_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-31-2",
          "name": "珠峰硅钢_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-xb-5-32-1",
          "name": "珠峰硅钢_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-32-2",
          "name": "珠峰硅钢_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-5-32-3",
          "name": "珠峰硅钢_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xb-5-41-1",
          "name": "珠峰硅钢_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-xb-5-41-2",
          "name": "珠峰硅钢_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xb-5-42-1",
          "name": "珠峰硅钢_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xb-5-51-1",
          "name": "珠峰硅钢_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xb-5-51-2",
          "name": "珠峰硅钢_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 35,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 87,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.5,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 97,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "鲁缆设备环保处",
    "declareDate": "2026-08-24",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-ll-1-11-1",
          "name": "鲁缆本部_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-11-2",
          "name": "鲁缆本部_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-ll-1-12-1",
          "name": "鲁缆本部_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-ll-1-12-2",
          "name": "鲁缆本部_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-ll-1-13-1",
          "name": "鲁缆本部_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-ll-1-21-1",
          "name": "鲁缆本部_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-21-2",
          "name": "鲁缆本部_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-ll-1-22-1",
          "name": "鲁缆本部_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-ll-1-23-1",
          "name": "鲁缆本部_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-ll-1-31-1",
          "name": "鲁缆本部_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-31-2",
          "name": "鲁缆本部_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-ll-1-32-1",
          "name": "鲁缆本部_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-32-2",
          "name": "鲁缆本部_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-ll-1-32-3",
          "name": "鲁缆本部_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-ll-1-41-1",
          "name": "鲁缆本部_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-ll-1-41-2",
          "name": "鲁缆本部_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-ll-1-42-1",
          "name": "鲁缆本部_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-ll-1-51-1",
          "name": "鲁缆本部_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-ll-1-51-2",
          "name": "鲁缆本部_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 34.5,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 86.5,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 23,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6.2,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 89,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.8,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "新缆安环处",
    "declareDate": "2026-08-25",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-xl-1-11-1",
          "name": "特变电工新疆电缆有限公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-11-2",
          "name": "特变电工新疆电缆有限公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-xl-1-12-1",
          "name": "特变电工新疆电缆有限公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-xl-1-12-2",
          "name": "特变电工新疆电缆有限公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-xl-1-13-1",
          "name": "特变电工新疆电缆有限公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-xl-1-21-1",
          "name": "特变电工新疆电缆有限公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-21-2",
          "name": "特变电工新疆电缆有限公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-xl-1-22-1",
          "name": "特变电工新疆电缆有限公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-xl-1-23-1",
          "name": "特变电工新疆电缆有限公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-xl-1-31-1",
          "name": "特变电工新疆电缆有限公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-31-2",
          "name": "特变电工新疆电缆有限公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-xl-1-32-1",
          "name": "特变电工新疆电缆有限公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-32-2",
          "name": "特变电工新疆电缆有限公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-xl-1-32-3",
          "name": "特变电工新疆电缆有限公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-xl-1-41-1",
          "name": "特变电工新疆电缆有限公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-xl-1-41-2",
          "name": "特变电工新疆电缆有限公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-xl-1-42-1",
          "name": "特变电工新疆电缆有限公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-xl-1-51-1",
          "name": "特变电工新疆电缆有限公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-xl-1-51-2",
          "name": "特变电工新疆电缆有限公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
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
        "name": "非化石电力消费比例",
        "value": 34,
        "unit": "%",
        "type": "auto"
      },
      "1.2": {
        "name": "节能与低碳改造覆盖率",
        "value": 86,
        "unit": "%",
        "type": "auto"
      },
      "1.3": {
        "name": "屋顶及建筑光伏利用率",
        "value": 22.5,
        "unit": "%",
        "type": "auto"
      },
      "2.1": {
        "name": "电机系统运行能效",
        "value": "优于国标二级",
        "unit": "",
        "type": "auto"
      },
      "2.2": {
        "name": "空压机站节能评级",
        "value": "一级能效站房",
        "unit": "",
        "type": "auto"
      },
      "2.3": {
        "name": "碳清除率 (Re)",
        "value": 6,
        "unit": "%",
        "type": "declared"
      },
      "3.1": {
        "name": "绿色电力绿证消纳占比",
        "value": 88.5,
        "unit": "%",
        "type": "auto"
      },
      "3.2": {
        "name": "零碳供应链管理措施",
        "value": "已选 5/6 项",
        "unit": "",
        "type": "declared"
      },
      "4.1": {
        "name": "数据自动采集率 (Ra)",
        "value": 96.5,
        "unit": "%",
        "type": "declared"
      },
      "4.2": {
        "name": "能碳管理中心功能项数",
        "value": "已选 12/13 项",
        "unit": "",
        "type": "declared"
      },
      "5.1": {
        "name": "碳排放信息披露透明度",
        "value": "已选 4/5 份",
        "unit": "",
        "type": "declared"
      }
    },
    "status": "已自评已申报",
    "evaluator": "德缆安环处",
    "declareDate": "2026-08-23",
    "attachments": {
      "1.1": [
        {
          "id": "att-f-dl-1-11-1",
          "name": "特变电工德阳电缆股份有限公司_2026年度绿色电力交易结算凭据及绿证划转凭单.pdf",
          "size": "2.4 MB",
          "uploadTime": "2026-08-15 14:20",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-11-2",
          "name": "特变电工德阳电缆股份有限公司_厂区屋顶分布式光伏自发自用计量电量月度确认表.xlsx",
          "size": "1.1 MB",
          "uploadTime": "2026-08-12 09:35",
          "type": "xlsx"
        }
      ],
      "1.2": [
        {
          "id": "att-f-dl-1-12-1",
          "name": "特变电工德阳电缆股份有限公司_主要生产工序与重点用能设备节能低碳技改台账.xlsx",
          "size": "1.8 MB",
          "uploadTime": "2026-07-28 16:40",
          "type": "xlsx"
        },
        {
          "id": "att-f-dl-1-12-2",
          "name": "特变电工德阳电缆股份有限公司_车间智能变频与余热利用节能工程验收合格报告.pdf",
          "size": "3.2 MB",
          "uploadTime": "2026-06-30 11:15",
          "type": "pdf"
        }
      ],
      "1.3": [
        {
          "id": "att-f-dl-1-13-1",
          "name": "特变电工德阳电缆股份有限公司_建筑屋顶光伏组件铺设竣工图及承重面积核定书.pdf",
          "size": "5.6 MB",
          "uploadTime": "2026-05-18 10:20",
          "type": "pdf"
        }
      ],
      "2.1": [
        {
          "id": "att-f-dl-1-21-1",
          "name": "特变电工德阳电缆股份有限公司_重点在役电动机系统能效现场实测报告(GB18613).pdf",
          "size": "1.9 MB",
          "uploadTime": "2026-08-05 15:30",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-21-2",
          "name": "特变电工德阳电缆股份有限公司_一级能效防爆及高效电机铭牌与能效标识查验表.xlsx",
          "size": "860 KB",
          "uploadTime": "2026-07-15 14:00",
          "type": "xlsx"
        }
      ],
      "2.2": [
        {
          "id": "att-f-dl-1-22-1",
          "name": "特变电工德阳电缆股份有限公司_空压机站房综合输功效率检测报告及一级能效评定书.pdf",
          "size": "2.1 MB",
          "uploadTime": "2026-08-01 16:50",
          "type": "pdf"
        }
      ],
      "2.3": [
        {
          "id": "att-f-dl-1-23-1",
          "name": "特变电工德阳电缆股份有限公司_关于当前暂未投运直接工程碳清除(CCUS)技术的不适用性说明.pdf",
          "size": "420 KB",
          "uploadTime": "2026-08-10 11:00",
          "type": "pdf"
        }
      ],
      "3.1": [
        {
          "id": "att-f-dl-1-31-1",
          "name": "特变电工德阳电缆股份有限公司_国家绿色电力证书认购台账与电网绿电消纳结算凭证.pdf",
          "size": "3.4 MB",
          "uploadTime": "2026-08-18 10:15",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-31-2",
          "name": "特变电工德阳电缆股份有限公司_可再生能源消纳保障机制年度责任权重达标证明函.pdf",
          "size": "1.5 MB",
          "uploadTime": "2026-07-22 09:40",
          "type": "pdf"
        }
      ],
      "3.2": [
        {
          "id": "att-f-dl-1-32-1",
          "name": "特变电工德阳电缆股份有限公司_绿色供应链管理制度与供应商低碳准入评估实施办法.pdf",
          "size": "4.1 MB",
          "uploadTime": "2026-06-15 17:00",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-32-2",
          "name": "特变电工德阳电缆股份有限公司_2026年度核心物料供应商碳盘查能力建设培训记录表.xlsx",
          "size": "1.7 MB",
          "uploadTime": "2026-07-30 14:20",
          "type": "xlsx"
        },
        {
          "id": "att-f-dl-1-32-3",
          "name": "特变电工德阳电缆股份有限公司_原材料包装循环共用与铜铝绝缘废旧物料回收协议.pdf",
          "size": "2.8 MB",
          "uploadTime": "2026-08-02 11:30",
          "type": "pdf"
        }
      ],
      "4.1": [
        {
          "id": "att-f-dl-1-41-1",
          "name": "特变电工德阳电缆股份有限公司_GB17167用能单位能源计量器具配备与自动数据采集清单.xlsx",
          "size": "2.2 MB",
          "uploadTime": "2026-08-14 16:10",
          "type": "xlsx"
        },
        {
          "id": "att-f-dl-1-41-2",
          "name": "特变电工德阳电缆股份有限公司_SCADA自动化监控系统智能电表通信联调测试报告.pdf",
          "size": "3.7 MB",
          "uploadTime": "2026-06-25 15:45",
          "type": "pdf"
        }
      ],
      "4.2": [
        {
          "id": "att-f-dl-1-42-1",
          "name": "特变电工德阳电缆股份有限公司_能碳数字化管理中心系统部署与13项功能模块验收确认书.pdf",
          "size": "4.5 MB",
          "uploadTime": "2026-08-20 17:30",
          "type": "pdf"
        }
      ],
      "5.1": [
        {
          "id": "att-f-dl-1-51-1",
          "name": "特变电工德阳电缆股份有限公司_2025-2026年度企业可持续发展与ESG公开披露报告.pdf",
          "size": "8.6 MB",
          "uploadTime": "2026-06-28 10:00",
          "type": "pdf"
        },
        {
          "id": "att-f-dl-1-51-2",
          "name": "特变电工德阳电缆股份有限公司_零碳工厂建设与碳中和达标推进专项自评估报告.pdf",
          "size": "5.2 MB",
          "uploadTime": "2026-08-10 14:10",
          "type": "pdf"
        }
      ]
    }
  }
]

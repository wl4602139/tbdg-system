/* ============================================================
 * 特变电工能碳数字化双中心 · 全平台基础数据字典 (Data Dictionary v2.0)
 * 汇集全平台底层遥测、工序工况、生产产出、财务费用、供应链物料、CBAM 报关及标准因子
 * 彻底剥离【分子】、【分母】、【静态基准】等计算角色分类，纯粹以工业数据字典标准构建
 * 同时支持反向关联 56 项指标核算分量引用契约
 * ============================================================ */

export interface AssociatedMetricRef {
  metricId: string
  metricName: string
  role: '分子' | '分母'
}

export interface PlatformDictionaryItem {
  id: number
  name: string // 数据项中文名称
  key: string // 字段英文标识 (Key)
  domain: string // 业务领域归属
  unit: string // 工程计量单位
  dataType: string // 数据类型与精度
  freq: string // 采集频率 / 时效性
  definition: string // 物理量定义与业务口径
  sourceSys: string // 数据源系统
  protocol: string // 通信规约 / 采集方式
  spatialScope: string // 空间范围 / 安装测点
  industry: '通用综合' | '变压器产业' | '电线电缆产业' // 适用制造产业
  validation: string // 防错与取值范围约束
  associatedMetrics?: AssociatedMetricRef[] // 关联核算指标
}

export const platformBasicDataItems: PlatformDictionaryItem[] = [
  {
    "id": 1,
    "name": "总用电量 (全厂有功电度)",
    "key": "total_active_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(14,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "园区或工厂变电所总进线计量柜高精度双向多功能电能表正向有功电量累计底数差值",
    "sourceSys": "SCADA系统 / EMS能源管理系统",
    "protocol": "IEC 61850 / Modbus-TCP",
    "spatialScope": "园区总降压站 / 10kV进线开关柜",
    "industry": "通用综合",
    "validation": "≥ 0; 增量单调非负递增; 表计翻转自动补正",
    "associatedMetrics": [
      {
        "metricId": "M01",
        "metricName": "全厂/园区综合能耗",
        "role": "分子"
      },
      {
        "metricId": "M02",
        "metricName": "综合绿电消纳率",
        "role": "分母"
      },
      {
        "metricId": "M03",
        "metricName": "市电网购电量比例",
        "role": "分母"
      },
      {
        "metricId": "M04",
        "metricName": "尖峰时段用电量占比",
        "role": "分母"
      },
      {
        "metricId": "M05",
        "metricName": "高峰时段用电量占比",
        "role": "分母"
      },
      {
        "metricId": "M06",
        "metricName": "平段时段用电量占比",
        "role": "分母"
      },
      {
        "metricId": "M07",
        "metricName": "低谷时段用电量占比",
        "role": "分母"
      },
      {
        "metricId": "M13",
        "metricName": "微电网清洁能源供电占比",
        "role": "分母"
      },
      {
        "metricId": "M14",
        "metricName": "指标管控综合能耗目标偏差率",
        "role": "分子"
      },
      {
        "metricId": "M14",
        "metricName": "指标管控综合能耗目标偏差率",
        "role": "分母"
      },
      {
        "metricId": "M18",
        "metricName": "工业热泵系统运行制热性能系数 COP",
        "role": "分母"
      },
      {
        "metricId": "M19",
        "metricName": "中央空调冷站系统综合能效比 COP",
        "role": "分母"
      },
      {
        "metricId": "M20",
        "metricName": "空调运行折算建筑面积单耗",
        "role": "分子"
      },
      {
        "metricId": "M24",
        "metricName": "变压器产业 · 单位产品综合能耗",
        "role": "分子"
      },
      {
        "metricId": "M25",
        "metricName": "电线电缆产业 · 单位产品综合能耗",
        "role": "分子"
      },
      {
        "metricId": "M26",
        "metricName": "万元产值综合能耗",
        "role": "分子"
      },
      {
        "metricId": "M27",
        "metricName": "万元工业增加值综合能耗",
        "role": "分子"
      },
      {
        "metricId": "M28",
        "metricName": "变压器 · 铁心剪切工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M29",
        "metricName": "变压器 · 线圈绕制工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M31",
        "metricName": "变压器 · 装配试验工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M32",
        "metricName": "电线电缆 · 铜/铝拉丝工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M33",
        "metricName": "电线电缆 · 导体绞线工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M34",
        "metricName": "电线电缆 · 挤塑绝缘工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M35",
        "metricName": "电线电缆 · 成缆与铠装工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M37",
        "metricName": "单位产品能耗行业先进标杆差距率",
        "role": "分子"
      },
      {
        "metricId": "M38",
        "metricName": "集控大屏 · 全网实时综合碳排放强度",
        "role": "分子"
      },
      {
        "metricId": "M39",
        "metricName": "集控大屏 · 光伏出力 15 分钟波动率",
        "role": "分母"
      },
      {
        "metricId": "M41",
        "metricName": "产品碳足迹 PCF 单位产品总排放量 (摇篮到大门)",
        "role": "分子"
      },
      {
        "metricId": "M45",
        "metricName": "LCA 阶段 4 · 高压出厂检验试验碳足迹",
        "role": "分子"
      },
      {
        "metricId": "M46",
        "metricName": "LCA 阶段 5 · 终身包装与防护防潮碳足迹",
        "role": "分子"
      },
      {
        "metricId": "M55",
        "metricName": "化石燃料直接燃烧温室气体排放模型 (Scope 1)",
        "role": "分子"
      }
    ]
  },
  {
    "id": 2,
    "name": "市电输入电量 (外购网电)",
    "key": "grid_purchased_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(14,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "从国家公用电网受电总有功电量，剔除分布式新能源自发自用与储能放电量",
    "sourceSys": "国网计量关口表 / SCADA系统",
    "protocol": "DL/T 645-2007 / Modbus-TCP",
    "spatialScope": "变电站产权分界进线关口计量点",
    "industry": "通用综合",
    "validation": "≥ 0; 不得高于全厂总用电量",
    "associatedMetrics": [
      {
        "metricId": "M03",
        "metricName": "市电网购电量比例",
        "role": "分子"
      }
    ]
  },
  {
    "id": 3,
    "name": "直供绿电消纳量",
    "key": "green_power_consumed_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(14,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "园区内部屋顶分布式光伏自发自用电量与物理专线直供绿电在厂界内部实际消耗量",
    "sourceSys": "EMS微电网系统 / 逆变器总输出表",
    "protocol": "Modbus-RTU / Modbus-TCP",
    "spatialScope": "分布式光伏并网并接点 / 负荷配电柜",
    "industry": "通用综合",
    "validation": "≥ 0; 碳排放计算核算因子锁定为 0.0000",
    "associatedMetrics": [
      {
        "metricId": "M02",
        "metricName": "综合绿电消纳率",
        "role": "分子"
      },
      {
        "metricId": "M11",
        "metricName": "微电网光伏自发自用率",
        "role": "分子"
      },
      {
        "metricId": "M13",
        "metricName": "微电网清洁能源供电占比",
        "role": "分子"
      },
      {
        "metricId": "M49",
        "metricName": "CBAM 申报产品隐含碳排放强度",
        "role": "分子"
      }
    ]
  },
  {
    "id": 4,
    "name": "工业水资源消耗量 (新鲜水)",
    "key": "fresh_water_volume_t",
    "domain": "能源计量与实时物联",
    "unit": "t",
    "dataType": "Float(10,2)",
    "freq": "逐时连续采样 / 逐日累计",
    "definition": "市政供水管网或自备水源井进入厂界各分厂总管的电磁流量计实测水量",
    "sourceSys": "SCADA给排水监测子系统",
    "protocol": "M-Bus / RS-485 Modbus-RTU",
    "spatialScope": "自来水进厂总水表 / 动力车间进水阀",
    "industry": "通用综合",
    "validation": "≥ 0; 瞬时流量突变报警阈值 > 200m³/h",
    "associatedMetrics": [
      {
        "metricId": "M19",
        "metricName": "中央空调冷站系统综合能效比 COP",
        "role": "分子"
      }
    ]
  },
  {
    "id": 5,
    "name": "管道天然气消耗量",
    "key": "natural_gas_volume_m3",
    "domain": "能源计量与实时物联",
    "unit": "m³",
    "dataType": "Float(10,2)",
    "freq": "逐日累计 / 月度结算对账",
    "definition": "市政燃气管网进入燃气锅炉房、食堂及相变干燥热源燃烧器的气体涡轮流量计标准体积量",
    "sourceSys": "SCADA燃气子系统 / 燃气开票台账",
    "protocol": "Modbus-RTU / 人工月度录入校验",
    "spatialScope": "燃气调压计量柜进气总管",
    "industry": "通用综合",
    "validation": "≥ 0; 标况体积 (20℃, 101.325kPa) 自动温压补偿",
    "associatedMetrics": [
      {
        "metricId": "M56",
        "metricName": "外购电力与蒸汽间接温室气体排放模型 (Scope 2)",
        "role": "分子"
      }
    ]
  },
  {
    "id": 6,
    "name": "工业外购蒸汽消耗量",
    "key": "purchased_steam_volume_t",
    "domain": "能源计量与实时物联",
    "unit": "t",
    "dataType": "Float(10,2)",
    "freq": "逐时采样 / 逐日结算",
    "definition": "外部热电厂或集中供热管网向相变真空干燥房、加热烘道输入的饱和/过热蒸汽质量流量累积值",
    "sourceSys": "SCADA动力管网监控 / 蒸汽涡街流量计",
    "protocol": "Modbus-TCP / 4~20mA模拟量转数字",
    "spatialScope": "动力分厂蒸汽减温减压总阀组",
    "industry": "通用综合",
    "validation": "≥ 0; 严格温压补偿计算蒸汽焓值",
    "associatedMetrics": [
      {
        "metricId": "M10",
        "metricName": "真空相变干燥机组蒸汽消耗强度",
        "role": "分子"
      },
      {
        "metricId": "M18",
        "metricName": "工业热泵系统运行制热性能系数 COP",
        "role": "分子"
      },
      {
        "metricId": "M30",
        "metricName": "变压器 · 相变干燥真空工序单耗",
        "role": "分子"
      },
      {
        "metricId": "M36",
        "metricName": "电线电缆 · 连续硫化连硫(VCV/CCV)工序单耗",
        "role": "分子"
      }
    ]
  },
  {
    "id": 7,
    "name": "工业柴油实物消耗量",
    "key": "diesel_fuel_consumption_kg",
    "domain": "能源计量与实时物联",
    "unit": "kg",
    "dataType": "Float(10,2)",
    "freq": "出入库批次记录 / 月度汇总",
    "definition": "厂区内部叉车、重型运输平板车、应急柴油发电机组领用的重油/轻柴油实物消耗量",
    "sourceSys": "ERP固定资产与油料仓储模块",
    "protocol": "RESTful API 电子发票与出库单导入",
    "spatialScope": "厂区油料仓库 / 加油机计量泵",
    "industry": "通用综合",
    "validation": "≥ 0; 升与千克按标准密度 0.84 kg/L 换算",
    "associatedMetrics": []
  },
  {
    "id": 8,
    "name": "工业液氮消耗量",
    "key": "liquid_nitrogen_volume_m3",
    "domain": "能源计量与实时物联",
    "unit": "m³",
    "dataType": "Float(10,2)",
    "freq": "逐日累计 / 月度汇总",
    "definition": "深冷空分制氮或外购低温绝热杜瓦罐液氮，用于变压器油箱检漏与充氮绝缘的气化气态体积量",
    "sourceSys": "SCADA深冷气体监控 / 电子磅秤",
    "protocol": "Modbus-RTU / 磅房称重数据接口",
    "spatialScope": "气体站低温液氮储罐区",
    "industry": "变压器产业",
    "validation": "≥ 0; 气液体积比标准折算 1:643",
    "associatedMetrics": []
  },
  {
    "id": 9,
    "name": "分时尖峰用电量 (Sharp)",
    "key": "tou_sharp_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(12,2)",
    "freq": "15分钟冻结时段累计 / 逐日结算",
    "definition": "在电网法定尖峰时段（通常为夏季高温 11:00-13:00、20:00-22:00）全厂实际受电电量",
    "sourceSys": "多功能分时计费电表 / EMS系统",
    "protocol": "IEC 61850 / DL/T 645",
    "spatialScope": "全厂高压进线总表计",
    "industry": "通用综合",
    "validation": "≥ 0; 严格依据所在地省级发改委最新分时费价规则",
    "associatedMetrics": [
      {
        "metricId": "M04",
        "metricName": "尖峰时段用电量占比",
        "role": "分子"
      }
    ]
  },
  {
    "id": 10,
    "name": "分时高峰用电量 (Peak)",
    "key": "tou_peak_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(12,2)",
    "freq": "15分钟冻结时段累计 / 逐日结算",
    "definition": "在电网法定高峰时段（通常为白天 08:30-11:00、14:00-19:00）全厂实际受电电量",
    "sourceSys": "多功能分时计费电表 / EMS系统",
    "protocol": "IEC 61850 / DL/T 645",
    "spatialScope": "全厂高压进线总表计",
    "industry": "通用综合",
    "validation": "≥ 0; 需纳入负荷错峰移峰重点监控",
    "associatedMetrics": [
      {
        "metricId": "M05",
        "metricName": "高峰时段用电量占比",
        "role": "分子"
      }
    ]
  },
  {
    "id": 11,
    "name": "分时平段用电量 (Flat)",
    "key": "tou_flat_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(12,2)",
    "freq": "15分钟冻结时段累计 / 逐日结算",
    "definition": "在电网法定平时段（通常为 07:00-08:30、13:00-14:00、22:00-23:00）全厂实际受电电量",
    "sourceSys": "多功能分时计费电表 / EMS系统",
    "protocol": "IEC 61850 / DL/T 645",
    "spatialScope": "全厂高压进线总表计",
    "industry": "通用综合",
    "validation": "≥ 0; 作为基准平价电量结算",
    "associatedMetrics": [
      {
        "metricId": "M06",
        "metricName": "平段时段用电量占比",
        "role": "分子"
      }
    ]
  },
  {
    "id": 12,
    "name": "分时低谷用电量 (Valley)",
    "key": "tou_valley_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(12,2)",
    "freq": "15分钟冻结时段累计 / 逐日结算",
    "definition": "在电网法定低谷时段（通常为夜间 23:00-07:00）全厂实际受电电量（储能充电与相变干燥主时段）",
    "sourceSys": "多功能分时计费电表 / EMS系统",
    "protocol": "IEC 61850 / DL/T 645",
    "spatialScope": "全厂高压进线总表计",
    "industry": "通用综合",
    "validation": "≥ 0; 储能电站优先吸纳低谷电",
    "associatedMetrics": [
      {
        "metricId": "M07",
        "metricName": "低谷时段用电量占比",
        "role": "分子"
      }
    ]
  },
  {
    "id": 13,
    "name": "分时深谷用电量 (Deep Valley)",
    "key": "tou_deep_valley_energy_kwh",
    "domain": "能源计量与实时物联",
    "unit": "kWh",
    "dataType": "Float(12,2)",
    "freq": "15分钟冻结时段累计 / 逐日结算",
    "definition": "部分省份重大节假日或春季大风新能源大发期间设立的超低费价深谷时段用电量",
    "sourceSys": "多功能分时计费电表 / EMS系统",
    "protocol": "IEC 61850 / DL/T 645",
    "spatialScope": "全厂高压进线总表计",
    "industry": "通用综合",
    "validation": "≥ 0; 费价倍率通常为平时段 0.1~0.2 倍",
    "associatedMetrics": []
  },
  {
    "id": 14,
    "name": "实时母线三相总有功功率",
    "key": "bus_active_power_kw",
    "domain": "能源计量与实时物联",
    "unit": "kW",
    "dataType": "Float(10,2)",
    "freq": "秒级实时采集 (1s~3s 刷新)",
    "definition": "总配电室母线进线柜三相有功功率矢量和 P = 根号3 * U * I * cos(phi)",
    "sourceSys": "微机综合保护装置 / SCADA",
    "protocol": "IEC 61850 MMS / Modbus-TCP",
    "spatialScope": "10kV / 35kV 高压母线段",
    "industry": "通用综合",
    "validation": "允许双向流动; 倒送电为负值",
    "associatedMetrics": [
      {
        "metricId": "M08",
        "metricName": "重点用电设备实时负荷率",
        "role": "分子"
      }
    ]
  },
  {
    "id": 15,
    "name": "实时母线三相总无功功率",
    "key": "bus_reactive_power_kvar",
    "domain": "能源计量与实时物联",
    "unit": "kvar",
    "dataType": "Float(10,2)",
    "freq": "秒级实时采集 (1s~3s 刷新)",
    "definition": "总配电室母线感性与容性无功功率交换瞬时值，用于指导无功自动补偿电容器投切",
    "sourceSys": "微机综合保护装置 / SVG静止无功发生器",
    "protocol": "Modbus-TCP",
    "spatialScope": "10kV / 35kV 高压母线段",
    "industry": "通用综合",
    "validation": "感性为正，容性为负",
    "associatedMetrics": []
  },
  {
    "id": 16,
    "name": "实时功率因数 (cosφ)",
    "key": "bus_power_factor",
    "domain": "能源计量与实时物联",
    "unit": "-",
    "dataType": "Float(4,3)",
    "freq": "秒级实时采集 (1s~3s 刷新)",
    "definition": "有功功率与视在功率的比值 cos(phi) = P / S；用于客观监测无功补偿达标状态",
    "sourceSys": "多功能数字电表 / SCADA",
    "protocol": "Modbus-RTU / Modbus-TCP",
    "spatialScope": "变压器低压出线侧 / 进线柜",
    "industry": "通用综合",
    "validation": "-1.000 ~ +1.000; 低于 0.90 自动触发电网罚款告警",
    "associatedMetrics": []
  },
  {
    "id": 17,
    "name": "母线三相电压 (A/B/C 相)",
    "key": "bus_phase_voltage_v",
    "domain": "能源计量与实时物联",
    "unit": "V",
    "dataType": "Float(8,2)",
    "freq": "秒级实时采集 (1s 刷新)",
    "definition": "配电变压器低压侧或高压母线相电压实测瞬时真有效值 (True RMS)",
    "sourceSys": "数字测控仪表 / SCADA",
    "protocol": "Modbus-TCP / OPC UA",
    "spatialScope": "低压 400V 进线柜 / 10kV 柜 PT 变比二次侧",
    "industry": "通用综合",
    "validation": "正常偏差范围 ±7% 内 (380V 基准: 353V ~ 406V)",
    "associatedMetrics": []
  },
  {
    "id": 18,
    "name": "进线三相电流 (A/B/C 相)",
    "key": "line_phase_current_a",
    "domain": "能源计量与实时物联",
    "unit": "A",
    "dataType": "Float(8,2)",
    "freq": "秒级实时采集 (1s 刷新)",
    "definition": "进线断路器三相电流互感器二次侧经 CT 倍率换算后的线电流瞬时真有效值",
    "sourceSys": "数字测控仪表 / SCADA",
    "protocol": "Modbus-TCP / OPC UA",
    "spatialScope": "各出线开关回路 CT 测点",
    "industry": "通用综合",
    "validation": "≥ 0; 超过额定电流 1.05 倍触发预警",
    "associatedMetrics": []
  },
  {
    "id": 19,
    "name": "电网频率 (Grid Frequency)",
    "key": "grid_frequency_hz",
    "domain": "能源计量与实时物联",
    "unit": "Hz",
    "dataType": "Float(5,3)",
    "freq": "秒级实时采集 (1s 刷新)",
    "definition": "厂区受电母线基波交流电压的实际频率",
    "sourceSys": "微机保护测控装置 / SCADA",
    "protocol": "IEC 61850 MMS",
    "spatialScope": "变电所主进线柜 PT 信号点",
    "industry": "通用综合",
    "validation": "49.500 ~ 50.500 Hz; 越限严密告警",
    "associatedMetrics": []
  },
  {
    "id": 20,
    "name": "总电压谐波畸变率 (THDv)",
    "key": "voltage_thd_percent",
    "domain": "能源计量与实时物联",
    "unit": "%",
    "dataType": "Float(5,2)",
    "freq": "10秒滑动平均",
    "definition": "母线电压中各次谐波总有效值与基波电压有效值的百分比",
    "sourceSys": "A级电能质量在线监测仪",
    "protocol": "Modbus-TCP / IEC 61000-4-30 标准",
    "spatialScope": "大功率中频炉 / 变频拉丝机前端母线",
    "industry": "通用综合",
    "validation": "0 ~ 100%; 国标限值 10kV 母线 THD ≤ 4.0%",
    "associatedMetrics": []
  },
  {
    "id": 21,
    "name": "屋顶光伏实时输出有功功率",
    "key": "pv_realtime_power_kw",
    "domain": "微电网与储能遥测",
    "unit": "kW",
    "dataType": "Float(10,2)",
    "freq": "5秒实时轮询",
    "definition": "全厂所有组串式及集中式光伏逆变器三相交流输出端瞬时有功功率总和",
    "sourceSys": "EMS微电网系统 / 华为/阳光光伏数采集控器",
    "protocol": "Modbus-TCP / MQTT",
    "spatialScope": "全厂各车间屋顶分布式光伏逆变房",
    "industry": "通用综合",
    "validation": "≥ 0; 上限为全厂光伏额定并网装机总容量",
    "associatedMetrics": [
      {
        "metricId": "M40",
        "metricName": "集控大屏 · 园区能效综合指数",
        "role": "分子"
      },
      {
        "metricId": "M40",
        "metricName": "集控大屏 · 园区能效综合指数",
        "role": "分母"
      }
    ]
  },
  {
    "id": 22,
    "name": "光伏电站累计发电量",
    "key": "pv_total_generation_kwh",
    "domain": "微电网与储能遥测",
    "unit": "kWh",
    "dataType": "Float(14,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "屋顶光伏电站交流侧并网电表双向正向有功电能自投产运行以来的物理累积值",
    "sourceSys": "光伏双向防孤岛计量表 / EMS",
    "protocol": "Modbus-RTU / DL/T 645",
    "spatialScope": "光伏电站 380V/10kV 并网点计量柜",
    "industry": "通用综合",
    "validation": "≥ 0; 累计增量单调递增",
    "associatedMetrics": [
      {
        "metricId": "M11",
        "metricName": "微电网光伏自发自用率",
        "role": "分母"
      },
      {
        "metricId": "M16",
        "metricName": "光伏电站节约标煤量",
        "role": "分子"
      },
      {
        "metricId": "M17",
        "metricName": "光伏电站减排二氧化碳量",
        "role": "分子"
      }
    ]
  },
  {
    "id": 23,
    "name": "光伏反送上网电量",
    "key": "pv_feed_in_grid_kwh",
    "domain": "微电网与储能遥测",
    "unit": "kWh",
    "dataType": "Float(12,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "光伏发电量超过厂区即时总用电负荷时，反向逆流送入国家公用电网的结算电量",
    "sourceSys": "电网双向关口表反向有功底数 / EMS",
    "protocol": "DL/T 645-2007",
    "spatialScope": "变电站并网受电产权分界点",
    "industry": "通用综合",
    "validation": "≥ 0; 自发自用余电上网模式专属字段",
    "associatedMetrics": []
  },
  {
    "id": 24,
    "name": "气象站水平面总日照辐射强度",
    "key": "solar_irradiance_wm2",
    "domain": "微电网与储能遥测",
    "unit": "W/m²",
    "dataType": "Float(8,2)",
    "freq": "1分钟连续采集",
    "definition": "厂区微型环境气象站热电堆总辐射表采集的水平面瞬时太阳辐照度",
    "sourceSys": "环境气象监测仪 / EMS微电网",
    "protocol": "RS-485 Modbus-RTU",
    "spatialScope": "办公楼顶层开阔无遮挡气象支架",
    "industry": "通用综合",
    "validation": "0 ~ 1500 W/m²; 夜间归零",
    "associatedMetrics": []
  },
  {
    "id": 25,
    "name": "光伏组件背板工作温度",
    "key": "pv_module_back_temp_degc",
    "domain": "微电网与储能遥测",
    "unit": "℃",
    "dataType": "Float(6,2)",
    "freq": "1分钟连续采集",
    "definition": "贴附于标杆光伏电池组件背板背面的 PT100 温度传感器实测温度，用于温度修正发电效率",
    "sourceSys": "气象采集仪 / EMS微电网",
    "protocol": "Modbus-RTU",
    "spatialScope": "特高压车间屋顶标杆光伏阵列",
    "industry": "通用综合",
    "validation": "-40.0 ~ +95.0 ℃",
    "associatedMetrics": []
  },
  {
    "id": 26,
    "name": "储能电站实时充放电功率",
    "key": "ess_realtime_power_kw",
    "domain": "微电网与储能遥测",
    "unit": "kW",
    "dataType": "Float(10,2)",
    "freq": "1秒实时遥测",
    "definition": "电化学储能双向变流器 (PCS) 交流侧实测瞬时功率；充电工况为负值，放电工况为正值",
    "sourceSys": "储能协调控制器 / PCS通信网关",
    "protocol": "Modbus-TCP / IEC 61850",
    "spatialScope": "储能升压变压器低压交流侧",
    "industry": "通用综合",
    "validation": "-额定容量 ~ +额定容量 (如 -2000kW ~ +2000kW)",
    "associatedMetrics": []
  },
  {
    "id": 27,
    "name": "储能系统荷电状态 (SOC)",
    "key": "ess_battery_soc_percent",
    "domain": "微电网与储能遥测",
    "unit": "%",
    "dataType": "Float(5,2)",
    "freq": "1秒实时遥测",
    "definition": "储能磷酸铁锂电池系统当前剩余可用可用电量与额定可用容量的百分比",
    "sourceSys": "BMS电池管理系统总控",
    "protocol": "Modbus-TCP / CAN总线转发",
    "spatialScope": "储能集装箱电池舱总控柜",
    "industry": "通用综合",
    "validation": "0.00% ~ 100.00%; 防过充过放区间通常设定 10% ~ 95%",
    "associatedMetrics": []
  },
  {
    "id": 28,
    "name": "储能系统健康状态 (SOH)",
    "key": "ess_battery_soh_percent",
    "domain": "微电网与储能遥测",
    "unit": "%",
    "dataType": "Float(5,2)",
    "freq": "逐日核算更新",
    "definition": "电池组在当前老化状态下的最大可释放容量与出厂初始标称容量的比值",
    "sourceSys": "BMS云端大数据寿命诊断算法",
    "protocol": "RESTful API / BMS数据库同步",
    "spatialScope": "储能电池簇总控",
    "industry": "通用综合",
    "validation": "0.00% ~ 100.00%; 低于 80% 提示电池模组梯次利用或退役",
    "associatedMetrics": []
  },
  {
    "id": 29,
    "name": "储能电池单体最高温度",
    "key": "ess_cell_max_temp_degc",
    "domain": "微电网与储能遥测",
    "unit": "℃",
    "dataType": "Float(5,2)",
    "freq": "1秒实时采集",
    "definition": "储能电池舱所有电池模组内部 NTC 热敏电阻采集到的最高单体电芯温度",
    "sourceSys": "BMS从控模组单元",
    "protocol": "Modbus-TCP",
    "spatialScope": "电池模组电芯间测温点",
    "industry": "通用综合",
    "validation": "-20.0 ~ +65.0 ℃; 超过 45℃ 启动强冷，超过 55℃ 紧急跳闸",
    "associatedMetrics": []
  },
  {
    "id": 30,
    "name": "储能电站累计充电量",
    "key": "ess_total_charge_kwh",
    "domain": "微电网与储能遥测",
    "unit": "kWh",
    "dataType": "Float(14,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "储能变流器 (PCS) 交流侧计量表计在充电工况下消耗的总有功电量历史累积值",
    "sourceSys": "储能双向关口电表 / EMS",
    "protocol": "Modbus-TCP",
    "spatialScope": "储能升压变压器计量点",
    "industry": "通用综合",
    "validation": "≥ 0; 单调递增",
    "associatedMetrics": [
      {
        "metricId": "M12",
        "metricName": "微电网储能充放电循环综合效率",
        "role": "分母"
      }
    ]
  },
  {
    "id": 31,
    "name": "储能电站累计放电量",
    "key": "ess_total_discharge_kwh",
    "domain": "微电网与储能遥测",
    "unit": "kWh",
    "dataType": "Float(14,2)",
    "freq": "15分钟采样 / 逐日结算",
    "definition": "储能变流器 (PCS) 交流侧计量表计在放电工况下向厂区负荷输出的总有功电量历史累积值",
    "sourceSys": "储能双向关口电表 / EMS",
    "protocol": "Modbus-TCP",
    "spatialScope": "储能升压变压器计量点",
    "industry": "通用综合",
    "validation": "≥ 0; 放电量必须 ≤ 累计充电量 × 综合效率",
    "associatedMetrics": [
      {
        "metricId": "M12",
        "metricName": "微电网储能充放电循环综合效率",
        "role": "分子"
      }
    ]
  },
  {
    "id": 32,
    "name": "变压器相变干燥罐绝对压力 (真空度)",
    "key": "vac_dryer_chamber_pressure_pa",
    "domain": "重点装备工况遥测",
    "unit": "Pa",
    "dataType": "Float(8,2)",
    "freq": "5秒实时连续采集",
    "definition": "特高压相变真空干燥罐内部电容薄膜真空规实测绝对压强，用于判定煤油气相干燥与真空排潮终点",
    "sourceSys": "干燥罐 PLC 自动化控制系统",
    "protocol": "PROFINET / OPC UA",
    "spatialScope": "特高压相变干燥罐内腔测压口",
    "industry": "变压器产业",
    "validation": "1.0 ~ 101325.0 Pa; 最终高真空阶段需达到 ≤ 15 Pa",
    "associatedMetrics": []
  },
  {
    "id": 33,
    "name": "相变干燥蒸汽瞬时流量",
    "key": "vac_dryer_steam_flow_kg_h",
    "domain": "重点装备工况遥测",
    "unit": "kg/h",
    "dataType": "Float(8,2)",
    "freq": "10秒连续采集",
    "definition": "干燥机组蒸汽加热蒸发器入口配备的涡街流量计实测蒸汽质量流量",
    "sourceSys": "PLC仪表总线 / SCADA",
    "protocol": "Modbus-RTU / 4-20mA",
    "spatialScope": "相变干燥罐蒸汽进汽调节阀组",
    "industry": "变压器产业",
    "validation": "≥ 0; 额定最大供汽流量 3500 kg/h",
    "associatedMetrics": []
  },
  {
    "id": 34,
    "name": "相变干燥罐内相变温度",
    "key": "vac_dryer_core_temp_degc",
    "domain": "重点装备工况遥测",
    "unit": "℃",
    "dataType": "Float(6,2)",
    "freq": "10秒连续采集",
    "definition": "罐内铁心与绕组绝缘件表面红外测温或预埋铠装热电偶多点平均温度",
    "sourceSys": "PLC温控模块",
    "protocol": "OPC UA",
    "spatialScope": "干燥罐罐体中部及顶部测温法兰",
    "industry": "变压器产业",
    "validation": "常温 ~ 140.0 ℃; 工艺阶段严格控制在 115℃~130℃ 恒温",
    "associatedMetrics": []
  },
  {
    "id": 35,
    "name": "变压器真空浇注罐绝对压力",
    "key": "vac_casting_tank_pressure_pa",
    "domain": "重点装备工况遥测",
    "unit": "Pa",
    "dataType": "Float(8,2)",
    "freq": "5秒实时采集",
    "definition": "干式变压器环氧树脂真空浇注缸内部皮拉尼真空计实测真空度",
    "sourceSys": "浇注设备专用PLC控制器",
    "protocol": "Modbus-TCP",
    "spatialScope": "干变车间真空浇注罐主罐体",
    "industry": "变压器产业",
    "validation": "10 ~ 100000 Pa; 终极浇注真空控制 ≤ 50 Pa",
    "associatedMetrics": []
  },
  {
    "id": 36,
    "name": "变压器试验大厅施加试验电压",
    "key": "test_lab_applied_voltage_kv",
    "domain": "重点装备工况遥测",
    "unit": "kV",
    "dataType": "Float(8,2)",
    "freq": "试验工单批次秒级波形记录",
    "definition": "特高压试验大厅工频无局放试验变压器或冲击电压发生器输出端分压器二次侧测量值",
    "sourceSys": "变压器试验站集中测控系统 (CTS)",
    "protocol": "IEC 61850 / 高速以太网私有规约",
    "spatialScope": "屏蔽试验大厅高压出线端高压分压器",
    "industry": "变压器产业",
    "validation": "0 ~ 1200 kV; 超过试验设定值 1.02 倍快速切断",
    "associatedMetrics": []
  },
  {
    "id": 37,
    "name": "变压器空载损耗测量有功值",
    "key": "test_lab_no_load_loss_kw",
    "domain": "重点装备工况遥测",
    "unit": "kW",
    "dataType": "Float(8,2)",
    "freq": "出厂试验批次稳态采集",
    "definition": "在额定频率和额定电压正弦波形下，变压器低压绕组开路时输入端高精度功率分析仪实测有功功率",
    "sourceSys": "横河/日置精密宽频电参数分析仪",
    "protocol": "IEEE-488 GPIB / TCP-IP",
    "spatialScope": "特高压出厂试验回路功率测量互感器",
    "industry": "变压器产业",
    "validation": "≥ 0; 判定产品铁心空载性能是否达标核心依据",
    "associatedMetrics": []
  },
  {
    "id": 38,
    "name": "变压器负载损耗测量有功值",
    "key": "test_lab_load_loss_kw",
    "domain": "重点装备工况遥测",
    "unit": "kW",
    "dataType": "Float(8,2)",
    "freq": "出厂试验批次稳态采集",
    "definition": "额定频率和额定电流下，短路一侧绕组而在另一侧绕组注入试验电流时测量的总有功功率（需温度折算至75℃/115℃）",
    "sourceSys": "横河/日置精密宽频电参数分析仪",
    "protocol": "IEEE-488 GPIB / TCP-IP",
    "spatialScope": "特高压出厂试验短路回路测点",
    "industry": "变压器产业",
    "validation": "≥ 0; 需校正至基准参考温度",
    "associatedMetrics": []
  },
  {
    "id": 39,
    "name": "铁心剪切线进料长度",
    "key": "core_shear_feed_length_m",
    "domain": "重点装备工况遥测",
    "unit": "m",
    "dataType": "Float(10,2)",
    "freq": "批次工单连续计米",
    "definition": "硅钢片数控横剪线/纵剪线伺服送进编码器测量的硅钢卷料进给展开实际物理米数",
    "sourceSys": "乔格/国产数控剪切线 PLC",
    "protocol": "OPC UA / Modbus-TCP",
    "spatialScope": "铁心车间 1#~4# 数控剪切机组",
    "industry": "变压器产业",
    "validation": "≥ 0; 单卷最长通常 ≤ 5000m",
    "associatedMetrics": [
      {
        "metricId": "M28",
        "metricName": "变压器 · 铁心剪切工序单耗",
        "role": "分母"
      }
    ]
  },
  {
    "id": 40,
    "name": "线缆高速大拉机主电机转速",
    "key": "cable_wire_drawing_rpm",
    "domain": "重点装备工况遥测",
    "unit": "rpm",
    "dataType": "Float(6,1)",
    "freq": "1秒实时轮询",
    "definition": "铜/铝大拉机主传动变频电机编码器反馈转速，用于关联设备负荷与拉拔出线速度",
    "sourceSys": "西门子/ABB变频器传动系统",
    "protocol": "PROFINET / Modbus-TCP",
    "spatialScope": "拉丝车间高速铜拉机主电机轴端",
    "industry": "电线电缆产业",
    "validation": "0 ~ 2500 rpm",
    "associatedMetrics": []
  },
  {
    "id": 41,
    "name": "线缆高速拉丝运行线速度",
    "key": "cable_wire_drawing_speed_m_min",
    "domain": "重点装备工况遥测",
    "unit": "m/min",
    "dataType": "Float(6,1)",
    "freq": "1秒实时轮询",
    "definition": "大拉机定速轮及引取轮表面实测金属单线出线线速度",
    "sourceSys": "机组测速传感器 / PLC",
    "protocol": "Modbus-TCP",
    "spatialScope": "拉丝机组引取轮测速轮",
    "industry": "电线电缆产业",
    "validation": "0 ~ 1800 m/min; 低速启停过渡与高速恒速阶段",
    "associatedMetrics": []
  },
  {
    "id": 42,
    "name": "线缆连续退火工作电流",
    "key": "cable_annealing_current_a",
    "domain": "重点装备工况遥测",
    "unit": "A",
    "dataType": "Float(8,2)",
    "freq": "1秒实时轮询",
    "definition": "铜大拉机联机直流电加热接触式退火轮施加在铜线上的退火加热电流",
    "sourceSys": "退火电源变流装置 / PLC",
    "protocol": "Modbus-RTU",
    "spatialScope": "退火炉水冷导电轮",
    "industry": "电线电缆产业",
    "validation": "0 ~ 3000 A; 随线速度线性自动升降",
    "associatedMetrics": []
  },
  {
    "id": 43,
    "name": "线缆框绞机绞笼转速",
    "key": "cable_stranding_cage_rpm",
    "domain": "重点装备工况遥测",
    "unit": "rpm",
    "dataType": "Float(6,1)",
    "freq": "1秒实时轮询",
    "definition": "框式绞线机绞体旋转框架的实际旋转机械转速",
    "sourceSys": "绞线机 PLC 系统",
    "protocol": "PROFINET",
    "spatialScope": "绞线车间 54盘/61盘大型框绞机",
    "industry": "电线电缆产业",
    "validation": "0 ~ 350 rpm",
    "associatedMetrics": []
  },
  {
    "id": 44,
    "name": "线缆塑料挤出机机筒加热段温度 (1~5段)",
    "key": "extruder_barrel_temp_degc",
    "domain": "重点装备工况遥测",
    "unit": "℃",
    "dataType": "Float(5,1)",
    "freq": "5秒连续采集",
    "definition": "护套/绝缘挤塑机机筒进料段、压缩段、计量段各温区加热热电偶实测温度",
    "sourceSys": "智能温控仪表组 / PLC",
    "protocol": "Modbus-RTU / OPC UA",
    "spatialScope": "挤出机机筒外部加热瓦测温孔",
    "industry": "电线电缆产业",
    "validation": "常温 ~ 280.0 ℃; 各段控制在设定值 ±2℃ 内",
    "associatedMetrics": []
  },
  {
    "id": 45,
    "name": "连续硫化 (CCV) 交联管蒸汽饱和压力",
    "key": "ccv_vulcanizing_tube_pressure_mpa",
    "domain": "重点装备工况遥测",
    "unit": "MPa",
    "dataType": "Float(6,3)",
    "freq": "5秒实时采集",
    "definition": "超高压悬链或立式交联三层共挤生产线充氮/蒸汽交联硫化管内部压力变送器实测绝对压强",
    "sourceSys": "CCV 生产线主控系统 (Maillefer / 诺基亚)",
    "protocol": "Modbus-TCP / OPC UA",
    "spatialScope": "交联管上部加热段进气口",
    "industry": "电线电缆产业",
    "validation": "0.500 ~ 2.500 MPa; 绝缘交联防微孔核心工艺参量",
    "associatedMetrics": []
  },
  {
    "id": 46,
    "name": "连硫生产线悬臂悬垂度高度",
    "key": "ccv_catenary_position_mm",
    "domain": "重点装备工况遥测",
    "unit": "mm",
    "dataType": "Float(6,1)",
    "freq": "1秒实时连续检测",
    "definition": "悬链硫化管内部 X 射线或涡流悬垂度位置传感器测量的缆芯在硫化管中的物理悬空垂直高度",
    "sourceSys": "CCV 悬垂度专用闭环控制器",
    "protocol": "PROFINET",
    "spatialScope": "悬链硫化管弧形过渡段内部",
    "industry": "电线电缆产业",
    "validation": "-200.0 ~ +200.0 mm; 严防线芯擦管刮伤",
    "associatedMetrics": []
  },
  {
    "id": 47,
    "name": "重点用电设备负荷率",
    "key": "equipment_load_rate_percent",
    "domain": "重点装备工况遥测",
    "unit": "%",
    "dataType": "Float(5,2)",
    "freq": "15分钟计算 / 逐日平均",
    "definition": "设备运行时测得的实际有功功率与铭牌标称额定工作功率的比值",
    "sourceSys": "SCADA装备监测子系统",
    "protocol": "算法自动计算存储",
    "spatialScope": "重点单台套大功率机组 (≥ 50kW)",
    "industry": "通用综合",
    "validation": "0.00% ~ 150.00%; 长期超过 105% 报警过载",
    "associatedMetrics": [
      {
        "metricId": "M09",
        "metricName": "重点设备负荷率时序环比",
        "role": "分子"
      },
      {
        "metricId": "M09",
        "metricName": "重点设备负荷率时序环比",
        "role": "分母"
      }
    ]
  },
  {
    "id": 48,
    "name": "变压器完工合格总容量",
    "key": "transformer_finished_capacity_mva",
    "domain": "生产制造与工单产出",
    "unit": "万kVA",
    "dataType": "Float(10,2)",
    "freq": "工单入库批次归集 / 月度汇总",
    "definition": "统计周期内通过全部出厂型式试验、终检验收合格入库的变压器铭牌额定容量代数和",
    "sourceSys": "MES制造执行系统 / ERP入库台账",
    "protocol": "RESTful API / 数据库中间表同步",
    "spatialScope": "单体工厂 / 变压器装配及试验车间",
    "industry": "变压器产业",
    "validation": "≥ 0; 变压器单耗核算的权威法定分母物理量",
    "associatedMetrics": [
      {
        "metricId": "M10",
        "metricName": "真空相变干燥机组蒸汽消耗强度",
        "role": "分母"
      },
      {
        "metricId": "M24",
        "metricName": "变压器产业 · 单位产品综合能耗",
        "role": "分母"
      },
      {
        "metricId": "M29",
        "metricName": "变压器 · 线圈绕制工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M30",
        "metricName": "变压器 · 相变干燥真空工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M31",
        "metricName": "变压器 · 装配试验工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M37",
        "metricName": "单位产品能耗行业先进标杆差距率",
        "role": "分母"
      },
      {
        "metricId": "M42",
        "metricName": "LCA 阶段 1 · 原材料获取碳足迹",
        "role": "分母"
      },
      {
        "metricId": "M43",
        "metricName": "LCA 阶段 2 · 上游原材料运输碳足迹",
        "role": "分母"
      },
      {
        "metricId": "M44",
        "metricName": "LCA 阶段 3 · 生产加工制造碳足迹",
        "role": "分母"
      },
      {
        "metricId": "M45",
        "metricName": "LCA 阶段 4 · 高压出厂检验试验碳足迹",
        "role": "分母"
      },
      {
        "metricId": "M46",
        "metricName": "LCA 阶段 5 · 终身包装与防护防潮碳足迹",
        "role": "分母"
      },
      {
        "metricId": "M47",
        "metricName": "原材料在产品总碳足迹中占比",
        "role": "分母"
      }
    ]
  },
  {
    "id": 49,
    "name": "变压器完工合格台数",
    "key": "transformer_finished_units",
    "domain": "生产制造与工单产出",
    "unit": "台",
    "dataType": "Integer",
    "freq": "工单入库批次归集 / 月度汇总",
    "definition": "统计周期内完成包装入库的变压器实物台数",
    "sourceSys": "MES系统工单完工确认单",
    "protocol": "MES-ERP 接口服务",
    "spatialScope": "单体变压器工厂成品库",
    "industry": "变压器产业",
    "validation": "≥ 0 的正整数",
    "associatedMetrics": []
  },
  {
    "id": 50,
    "name": "电线电缆完工合格产出长度",
    "key": "cable_finished_length_km",
    "domain": "生产制造与工单产出",
    "unit": "km",
    "dataType": "Float(10,3)",
    "freq": "盘具完工扫码 / 逐周逐月汇总",
    "definition": "成缆、护套、成品耐压火花检验全部合格并打盘完工入库的实际物理总长度",
    "sourceSys": "MES工单计米器与条码系统",
    "protocol": "条码枪扫码采集 / MES接口",
    "spatialScope": "成缆车间成品打盘区",
    "industry": "电线电缆产业",
    "validation": "≥ 0",
    "associatedMetrics": [
      {
        "metricId": "M32",
        "metricName": "电线电缆 · 铜/铝拉丝工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M33",
        "metricName": "电线电缆 · 导体绞线工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M34",
        "metricName": "电线电缆 · 挤塑绝缘工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M35",
        "metricName": "电线电缆 · 成缆与铠装工序单耗",
        "role": "分母"
      },
      {
        "metricId": "M36",
        "metricName": "电线电缆 · 连续硫化连硫(VCV/CCV)工序单耗",
        "role": "分母"
      }
    ]
  },
  {
    "id": 51,
    "name": "电线电缆截面折算长度 (综合产出)",
    "key": "cable_converted_length_km_mm2",
    "domain": "生产制造与工单产出",
    "unit": "万km·mm²",
    "dataType": "Float(12,4)",
    "freq": "工单结算归集 / 月度汇总",
    "definition": "考虑不同线径规格电缆能耗差异，各规格电缆实际产出物理长度乘以导体标称截面积后的综合折算产出",
    "sourceSys": "MES制造执行系统 / 能耗分析引擎",
    "protocol": "算法自动折算存储",
    "spatialScope": "单体电缆工厂各产线",
    "industry": "电线电缆产业",
    "validation": "≥ 0; 电线电缆行业横向对标标准分母",
    "associatedMetrics": [
      {
        "metricId": "M25",
        "metricName": "电线电缆产业 · 单位产品综合能耗",
        "role": "分母"
      },
      {
        "metricId": "M38",
        "metricName": "集控大屏 · 全网实时综合碳排放强度",
        "role": "分母"
      }
    ]
  },
  {
    "id": 52,
    "name": "工序合格产出品净重",
    "key": "process_finished_net_weight_kg",
    "domain": "生产制造与工单产出",
    "unit": "kg",
    "dataType": "Float(12,2)",
    "freq": "工序交接批次过磅",
    "definition": "特定关键工序（如剪切铁心片、拉丝单线、绞合线芯、成盘电缆）交接至下一道工序的合格毛坯净重",
    "sourceSys": "MES工序流转卡 / 工业电子台秤",
    "protocol": "RS-232 串口/Modbus-RTU 地磅接口",
    "spatialScope": "各制造车间中间工序交接暂存区",
    "industry": "通用综合",
    "validation": "≥ 0; 净重 = 毛重 - 工位器具皮重",
    "associatedMetrics": []
  },
  {
    "id": 53,
    "name": "工序工艺废料及边角料报废重量",
    "key": "process_scrap_weight_kg",
    "domain": "生产制造与工单产出",
    "unit": "kg",
    "dataType": "Float(10,2)",
    "freq": "工序完工批次清料",
    "definition": "冲剪硅钢边角料、铜屑、挤塑机洗车料及拉丝断线废料的称重清点重量",
    "sourceSys": "MES废料报废审核流程",
    "protocol": "人工扫码复核过磅",
    "spatialScope": "车间各机台废料收集箱",
    "industry": "通用综合",
    "validation": "≥ 0; 结合投料计算工序材料利用率",
    "associatedMetrics": []
  },
  {
    "id": 54,
    "name": "工单制造实际耗用工时",
    "key": "work_order_actual_man_hours_h",
    "domain": "生产制造与工单产出",
    "unit": "h",
    "dataType": "Float(8,2)",
    "freq": "工单关结时结算",
    "definition": "生产制造工单在各班组各工序投入的工时打卡刷卡记录统计总和",
    "sourceSys": "MES考勤与人机派工子系统",
    "protocol": "MES内部定时聚合任务",
    "spatialScope": "具体生产班组及产线机台",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 55,
    "name": "生产制造工单编号 (Work Order ID)",
    "key": "production_work_order_no",
    "domain": "生产制造与工单产出",
    "unit": "-",
    "dataType": "String(32)",
    "freq": "工单下达生成",
    "definition": "ERP下达到MES系统的唯一生产批次追溯工单主键标识",
    "sourceSys": "ERP生产订单模块",
    "protocol": "SAP IDoc / RESTful API",
    "spatialScope": "全厂统一编码规则",
    "industry": "通用综合",
    "validation": "非空唯一字符串; 如 WO-202609-0892",
    "associatedMetrics": []
  },
  {
    "id": 56,
    "name": "全口径工业总产值 (现价)",
    "key": "gross_industrial_output_value_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(12,2)",
    "freq": "月度财务关账核算",
    "definition": "企业在报告期内生产的以货币形式表现的工业最终产品和提供工业劳务活动的总价值量（不含增值税）",
    "sourceSys": "ERP财务总账 / 经营管理系统",
    "protocol": "财务月报接口 / 中间库同步",
    "spatialScope": "独立法人制造企业",
    "industry": "通用综合",
    "validation": "≥ 0; 万元产值综合能耗核心分母",
    "associatedMetrics": [
      {
        "metricId": "M26",
        "metricName": "万元产值综合能耗",
        "role": "分母"
      },
      {
        "metricId": "M41",
        "metricName": "产品碳足迹 PCF 单位产品总排放量 (摇篮到大门)",
        "role": "分母"
      }
    ]
  },
  {
    "id": 57,
    "name": "工业增加值 (月度/年度)",
    "key": "industrial_added_value_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(12,2)",
    "freq": "月度 / 年度统计局口径核算",
    "definition": "企业在报告期内工业生产活动最终成果的增加价值（工业总产值减去工业中间投入加上本期应交增值税）",
    "sourceSys": "ERP财务成本模块 / 统计上报系统",
    "protocol": "财务报表导入校验",
    "spatialScope": "独立核算工厂法人",
    "industry": "通用综合",
    "validation": "≥ 0; 万元工业增加值能耗标准计算分母",
    "associatedMetrics": [
      {
        "metricId": "M27",
        "metricName": "万元工业增加值综合能耗",
        "role": "分母"
      }
    ]
  },
  {
    "id": 58,
    "name": "市电外购电费结算总金额",
    "key": "electricity_tariff_total_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(12,2)",
    "freq": "月度供电局电费单对账",
    "definition": "供电局向企业开具的增值税专用发票结算总金额（包含电度电费、容量/需量基本电费、力率调整增减款）",
    "sourceSys": "国家电网电费账单 / ERP应付账款",
    "protocol": "电子发票 OCR 自动识别 / 接口对账",
    "spatialScope": "变电站户号结算点",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 59,
    "name": "分时尖峰电费结算额",
    "key": "electricity_cost_sharp_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "月度供电局电费单对账",
    "definition": "在电网尖峰时段按尖峰费率核算的电度电费实支金额",
    "sourceSys": "供电局分时计费单 / EMS能耗成本引擎",
    "protocol": "系统月度自动拆分核算",
    "spatialScope": "全厂受电户号",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": [
      {
        "metricId": "M15",
        "metricName": "储能削峰填谷套利净收益",
        "role": "分母"
      }
    ]
  },
  {
    "id": 60,
    "name": "分时低谷电费结算额",
    "key": "electricity_cost_valley_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "月度供电局电费单对账",
    "definition": "在电网夜间低谷时段按优待优惠低费率核算的电度电费金额",
    "sourceSys": "供电局分时计费单 / EMS能耗成本引擎",
    "protocol": "系统月度自动拆分核算",
    "spatialScope": "全厂受电户号",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": [
      {
        "metricId": "M15",
        "metricName": "储能削峰填谷套利净收益",
        "role": "分子"
      }
    ]
  },
  {
    "id": 61,
    "name": "直供绿电交易加价结算费",
    "key": "green_power_trading_cost_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "月度电力交易中心结算账单",
    "definition": "通过北京/广州电力交易中心开展中长期绿电市场化交易支付的绿电环境溢价总费用",
    "sourceSys": "电力交易平台结算凭证 / 财务账套",
    "protocol": "交易中心结算单导入",
    "spatialScope": "绿电交易签约账户",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 62,
    "name": "工业水费结算支出",
    "key": "water_tariff_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "月度自来水公司水费单",
    "definition": "自来水公司出具的水费结算票据金额（包含自来水费与污水处理排污附加费）",
    "sourceSys": "自来水发票 / 财务对账系统",
    "protocol": "财务月度对账录入",
    "spatialScope": "各厂区水表总户号",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 63,
    "name": "天然气采购结算总费用",
    "key": "natural_gas_tariff_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "月度燃气结算单",
    "definition": "燃气公司抄表发票账单金额（单价随季节价格联动上浮/下调）",
    "sourceSys": "燃气发票 / 财务应付凭证",
    "protocol": "财务系统自动同步",
    "spatialScope": "燃气进站计量户号",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 64,
    "name": "外购工业蒸汽结算总费用",
    "key": "steam_tariff_wan_yuan",
    "domain": "财务经营与能源费用",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "月度热电厂热力发票",
    "definition": "集中供热单位根据蒸汽累计供汽量与热价开具的结算总金额",
    "sourceSys": "热力对账发票 / ERP财务模块",
    "protocol": "财务月度结算校验",
    "spatialScope": "蒸汽管网接入点结算表",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 65,
    "name": "高纯电解无氧铜杆采购投料净重",
    "key": "pcf_copper_raw_material_net_weight_kg",
    "domain": "碳足迹与实景供应链",
    "unit": "kg",
    "dataType": "Float(12,2)",
    "freq": "工单领料批次出库",
    "definition": "电磁线绕制或线缆拉丝工单从原材料库房领用入产线的高纯电解铜杆（含铜量 ≥ 99.99%）净重",
    "sourceSys": "ERP/WMS仓储管理系统 / 条码发料单",
    "protocol": "条码枪发料扫码 / RESTful API",
    "spatialScope": "原材料铜杆线盘库",
    "industry": "通用综合",
    "validation": "≥ 0; 变压器与线缆碳足迹第一大核心原材料",
    "associatedMetrics": [
      {
        "metricId": "M42",
        "metricName": "LCA 阶段 1 · 原材料获取碳足迹",
        "role": "分子"
      },
      {
        "metricId": "M43",
        "metricName": "LCA 阶段 2 · 上游原材料运输碳足迹",
        "role": "分子"
      },
      {
        "metricId": "M48",
        "metricName": "绿电消纳对碳足迹减碳贡献率",
        "role": "分子"
      },
      {
        "metricId": "M48",
        "metricName": "绿电消纳对碳足迹减碳贡献率",
        "role": "分母"
      },
      {
        "metricId": "M49",
        "metricName": "CBAM 申报产品隐含碳排放强度",
        "role": "分母"
      },
      {
        "metricId": "M50",
        "metricName": "CBAM 理论应缴碳排放凭证配额数",
        "role": "分子"
      }
    ]
  },
  {
    "id": 66,
    "name": "取向高导磁硅钢片采购投料净重",
    "key": "pcf_silicon_steel_net_weight_kg",
    "domain": "碳足迹与实景供应链",
    "unit": "kg",
    "dataType": "Float(12,2)",
    "freq": "工单领料批次出库",
    "definition": "铁心叠积工单领用的高导磁取向冷轧硅钢卷实物净重",
    "sourceSys": "WMS原料库 / ERP工单领料单",
    "protocol": "WMS-MES 接口",
    "spatialScope": "硅钢卷料立体仓库",
    "industry": "变压器产业",
    "validation": "≥ 0; 变压器碳足迹关键原材料",
    "associatedMetrics": []
  },
  {
    "id": 67,
    "name": "变压器矿物绝缘油实充注入净重",
    "key": "pcf_insulating_oil_net_weight_kg",
    "domain": "碳足迹与实景供应链",
    "unit": "kg",
    "dataType": "Float(10,2)",
    "freq": "总装注油工单批次流量计实测",
    "definition": "油浸式变压器总装真空注油工序注入变压器油箱内部的高品质环烷基绝缘矿物油质量",
    "sourceSys": "真空注油机高精度质量流量计 / MES",
    "protocol": "Modbus-RTU / 称重传感器",
    "spatialScope": "特高压总装注油工位",
    "industry": "变压器产业",
    "validation": "≥ 0; 油重 = 注入体积 × 实际油温密度",
    "associatedMetrics": []
  },
  {
    "id": 68,
    "name": "电工级铝杆/铝排领用净重",
    "key": "pcf_aluminum_raw_material_net_weight_kg",
    "domain": "碳足迹与实景供应链",
    "unit": "kg",
    "dataType": "Float(12,2)",
    "freq": "工单领料批次出库",
    "definition": "铝绞线、钢芯铝绞线及干式变压器铝箔绕制工单领用的高导电纯铝杆净重",
    "sourceSys": "WMS原料库 / ERP工单领料单",
    "protocol": "条码枪扫码接口",
    "spatialScope": "电缆铝杆盘具库",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 69,
    "name": "交联聚乙烯 (XLPE) 绝缘颗粒投料净重",
    "key": "pcf_xlpe_granules_net_weight_kg",
    "domain": "碳足迹与实景供应链",
    "unit": "kg",
    "dataType": "Float(10,2)",
    "freq": "挤出机上料批次称重",
    "definition": "超高压挤塑机真空吸料无尘上料系统投入的交联聚乙烯绝缘料实测投料净重",
    "sourceSys": "挤出机失重式自动配料秤 / PLC",
    "protocol": "Modbus-TCP",
    "spatialScope": "洁净挤出机上料间料斗",
    "industry": "电线电缆产业",
    "validation": "≥ 0",
    "associatedMetrics": []
  },
  {
    "id": 70,
    "name": "原材料供应商统一社会信用代码 (USCI)",
    "key": "supplier_usci_code",
    "domain": "碳足迹与实景供应链",
    "unit": "-",
    "dataType": "String(18)",
    "freq": "SRM准入建档 / 采购订单关联",
    "definition": "原材料一级供应商在国家工商行政管理部门注册的法定 18 位统一社会信用代码",
    "sourceSys": "SRM供应链管理系统 / 供应商库",
    "protocol": "国家企业信用信息公示系统接口",
    "spatialScope": "供应商资质全息档案",
    "industry": "通用综合",
    "validation": "严格 18 位大写字母加数字校验",
    "associatedMetrics": []
  },
  {
    "id": 71,
    "name": "原材料上游运输起点地点 (Origin)",
    "key": "raw_material_transport_origin_addr",
    "domain": "碳足迹与实景供应链",
    "unit": "-",
    "dataType": "String(128)",
    "freq": "采购货运提单录入",
    "definition": "铜杆、硅钢片等原材料出厂装车的供应商工厂或提货仓库具体地址（省/市/区/门牌）",
    "sourceSys": "SRM物流追踪模块 / 运单发票",
    "protocol": "物流运单 OCR 结构化解析",
    "spatialScope": "全国各供应商发货地",
    "industry": "通用综合",
    "validation": "支持高德地图地理编码解析经纬度",
    "associatedMetrics": []
  },
  {
    "id": 72,
    "name": "原材料上游运输实测物理距离",
    "key": "raw_material_transport_distance_km",
    "domain": "碳足迹与实景供应链",
    "unit": "km",
    "dataType": "Float(8,1)",
    "freq": "货运运单批次测算",
    "definition": "原材料运输从发货地仓库至特变电工受载工厂库区的公路/铁路重卡实际行驶里程",
    "sourceSys": "高德/百度企业级地图距离测算 API",
    "protocol": "RESTful API 自动调用测距",
    "spatialScope": "跨省跨区域长途干线物流",
    "industry": "通用综合",
    "validation": "> 0 km; GPS北斗定位轨迹核验",
    "associatedMetrics": [
      {
        "metricId": "M44",
        "metricName": "LCA 阶段 3 · 生产加工制造碳足迹",
        "role": "分子"
      }
    ]
  },
  {
    "id": 73,
    "name": "上游原材料运输方式类型 (Mode)",
    "key": "raw_material_transport_mode",
    "domain": "碳足迹与实景供应链",
    "unit": "枚举",
    "dataType": "Enum(HIGHWAY, RAIL, WATER)",
    "freq": "运单批次登记",
    "definition": "原材料长途运输的主力载运工具类别：公路重型柴油货车、电气化铁路货运列车、内河集装箱水运",
    "sourceSys": "SRM协同物流模块",
    "protocol": "运单标准属性",
    "spatialScope": "干线物流段",
    "industry": "通用综合",
    "validation": "限定为法定运输类型枚举值",
    "associatedMetrics": []
  },
  {
    "id": 74,
    "name": "整机出厂木托盘包装木材净重",
    "key": "pcf_packaging_wood_net_weight_kg",
    "domain": "碳足迹与实景供应链",
    "unit": "kg",
    "dataType": "Float(8,2)",
    "freq": "成品包装工单结算",
    "definition": "产品包装出厂所耗用的实木免熏蒸木托盘、侧围板实测重量",
    "sourceSys": "MES包装发料单 / WMS辅料库",
    "protocol": "工单定额领料核算",
    "spatialScope": "包装车间出厂打包工位",
    "industry": "通用综合",
    "validation": "≥ 0; 关联木材固碳吸收与生产碳足迹",
    "associatedMetrics": [
      {
        "metricId": "M47",
        "metricName": "原材料在产品总碳足迹中占比",
        "role": "分子"
      }
    ]
  },
  {
    "id": 75,
    "name": "国家核证自愿减排量 (CCER) 核销量",
    "key": "ccer_offset_volume_tco2e",
    "domain": "碳足迹与实景供应链",
    "unit": "tCO2e",
    "dataType": "Float(10,2)",
    "freq": "年度/批次核销注销批注",
    "definition": "在全国温室气体自愿减排交易注册登记系统已完成注销用于抵销碳排放的官方 CCER 配额数量",
    "sourceSys": "全国自愿减排登记注册系统 / 碳管理平台",
    "protocol": "官方注销证书及划转单",
    "spatialScope": "集团碳资产运营账户",
    "industry": "通用综合",
    "validation": "≥ 0; 需具有唯一官方项目注销序列号",
    "associatedMetrics": []
  },
  {
    "id": 76,
    "name": "中国绿色电力证书 (GEC) 认购数量",
    "key": "gec_certificates_count",
    "domain": "碳足迹与实景供应链",
    "unit": "个",
    "dataType": "Integer",
    "freq": "月度交易划转",
    "definition": "国家可再生能源信息管理中心核发的绿色电力证书持有与核销量（1个绿证对应 1000 kWh 绿电电量）",
    "sourceSys": "国家绿证认购平台 / 碳足迹认证模块",
    "protocol": "API 同步绿证电子凭证",
    "spatialScope": "企业绿证持有电子账户",
    "industry": "通用综合",
    "validation": "≥ 0 的正整数",
    "associatedMetrics": []
  },
  {
    "id": 77,
    "name": "欧盟海关单一行政报关单号 (SAD)",
    "key": "cbam_customs_declaration_sad_no",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "-",
    "dataType": "String(32)",
    "freq": "出口报关批次生成",
    "definition": "出口变压器或电缆货物向欧盟各成员国海关口岸报关时的官方唯一报关单序列号",
    "sourceSys": "企业进出口关务系统 / 欧盟报关行代理系统",
    "protocol": "电子报关单 EDI 报文同步",
    "spatialScope": "欧盟进口口岸海关",
    "industry": "通用综合",
    "validation": "非空唯一字符串; 欧盟官方格式",
    "associatedMetrics": []
  },
  {
    "id": 78,
    "name": "欧盟海关 8 位商品代码 (CN Code)",
    "key": "cbam_customs_cn_code",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "-",
    "dataType": "String(8)",
    "freq": "产品报关归类确定",
    "definition": "出口货物依据欧盟组合命名法 (Combined Nomenclature) 确定的 8 位法定海关编码（如变压器 85042100）",
    "sourceSys": "关务海关税则数据库 / ERP物料主数据",
    "protocol": "税号自动校验接口",
    "spatialScope": "出口报关货物归类",
    "industry": "通用综合",
    "validation": "必须命中欧盟 CBAM 附录 I 征税商品目录范围",
    "associatedMetrics": []
  },
  {
    "id": 79,
    "name": "海关报关出口净重量 (Net Mass)",
    "key": "cbam_export_net_mass_t",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "t",
    "dataType": "Float(10,3)",
    "freq": "出口过磅批次提单",
    "definition": "经海关查验备案的货物除去所有包装后的纯工业产品物理净重",
    "sourceSys": "海关提单 (B/L) / 装箱单 (Packing List)",
    "protocol": "关务接口数据自动导入",
    "spatialScope": "出境港口海关查验区",
    "industry": "通用综合",
    "validation": "> 0; CBAM 碳税核算基础活动水平物理量",
    "associatedMetrics": [
      {
        "metricId": "M50",
        "metricName": "CBAM 理论应缴碳排放凭证配额数",
        "role": "分母"
      },
      {
        "metricId": "M51",
        "metricName": "国内已付碳成本等价抵扣额",
        "role": "分子"
      }
    ]
  },
  {
    "id": 80,
    "name": "出口货物离岸申报总货值 (FOB Value)",
    "key": "cbam_fob_export_value_eur",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "EUR",
    "dataType": "Float(12,2)",
    "freq": "出口商业发票确定",
    "definition": "出口商业发票 (Commercial Invoice) 注明的离岸价 FOB 欧元总金额",
    "sourceSys": "关务结汇系统 / ERP销售模块",
    "protocol": "外汇结算单 / 报关单对接",
    "spatialScope": "国际贸易结算账户",
    "industry": "通用综合",
    "validation": "> 0; 用于测算 CBAM 关税占货值比例",
    "associatedMetrics": [
      {
        "metricId": "M54",
        "metricName": "全介质实物消耗折标准煤核算模型",
        "role": "分母"
      }
    ]
  },
  {
    "id": 81,
    "name": "欧盟指定前驱物消耗量 (Precursors)",
    "key": "cbam_precursor_steel_aluminum_mass_t",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "t",
    "dataType": "Float(10,3)",
    "freq": "产品 LCA 拆解核算",
    "definition": "制造出口变压器所消耗的属于欧盟 CBAM 监管范围的钢铁、无锻铝等复杂前驱原材料净质量",
    "sourceSys": "产品实景 BOM 展开与碳足迹核算模型",
    "protocol": "算法自动穿透关联",
    "spatialScope": "变压器各部套装配物料清单",
    "industry": "通用综合",
    "validation": "≥ 0; 需申报前驱物生产国及直接/间接排放",
    "associatedMetrics": []
  },
  {
    "id": 82,
    "name": "国内已缴纳碳成本折算总额 (Carbon Price Paid)",
    "key": "cbam_carbon_price_paid_abroad_eur",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "EUR",
    "dataType": "Float(10,2)",
    "freq": "申报批次汇率换算",
    "definition": "产品在中国境内生产制造环节因全国碳市场履约、地方碳税或绿电交易实际已支付的碳成本，折算为欧元的金额",
    "sourceSys": "全国碳市场 CEA 交易结算单 / 财务凭证",
    "protocol": "完税凭证上传与核对",
    "spatialScope": "境内碳履约账户",
    "industry": "通用综合",
    "validation": "≥ 0; 可在欧盟应缴碳凭证总额中全额等价抵扣",
    "associatedMetrics": [
      {
        "metricId": "M52",
        "metricName": "CBAM 最终预估需缴纳碳边境调节税额",
        "role": "分子"
      },
      {
        "metricId": "M53",
        "metricName": "CBAM 关税在出口 FOB 货值中占比",
        "role": "分母"
      }
    ]
  },
  {
    "id": 83,
    "name": "欧盟碳配额 (EU ETS) 周结算均价",
    "key": "eu_ets_allowance_price_eur_tco2e",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "EUR/tCO2e",
    "dataType": "Float(6,2)",
    "freq": "每周三欧洲能源交易所 (EEX) 自动拉取",
    "definition": "欧盟委员会官方按欧洲能源交易所公开发布的上一历周拍卖结算加权平均碳价",
    "sourceSys": "欧洲能源交易所 (EEX) 官方数据接口",
    "protocol": "外部 REST API 定时爬虫/官方接口",
    "spatialScope": "全欧统一碳交易市场",
    "industry": "通用综合",
    "validation": "> 0; 当前基准区间 60.00 ~ 110.00 EUR",
    "associatedMetrics": [
      {
        "metricId": "M51",
        "metricName": "国内已付碳成本等价抵扣额",
        "role": "分母"
      },
      {
        "metricId": "M53",
        "metricName": "CBAM 关税在出口 FOB 货值中占比",
        "role": "分子"
      },
      {
        "metricId": "M54",
        "metricName": "全介质实物消耗折标准煤核算模型",
        "role": "分子"
      }
    ]
  },
  {
    "id": 84,
    "name": "中欧基准外汇汇率 (EUR/CNY)",
    "key": "eur_cny_central_parity_rate",
    "domain": "CBAM 欧盟碳关税申报",
    "unit": "-",
    "dataType": "Float(6,4)",
    "freq": "每日中国外汇交易中心发布",
    "definition": "中国人民银行授权中国外汇交易中心公布的人民币对欧元汇率中间价",
    "sourceSys": "中国外汇交易中心 (CFETS) 官方接口",
    "protocol": "金融市场汇率数据接口",
    "spatialScope": "全球外汇市场",
    "industry": "通用综合",
    "validation": "> 0; 用于国内碳成本与欧盟碳税精准汇率换算",
    "associatedMetrics": [
      {
        "metricId": "M52",
        "metricName": "CBAM 最终预估需缴纳碳边境调节税额",
        "role": "分母"
      }
    ]
  },
  {
    "id": 85,
    "name": "节能技改项目立项工程投资总额",
    "key": "energy_project_capex_wan_yuan",
    "domain": "节能项目与零碳评估",
    "unit": "万元",
    "dataType": "Float(10,2)",
    "freq": "立项批复与决算审计确定",
    "definition": "变频改造、相变干燥余热回收、空压机集中群控等节能工程的固定资产与安装施工资本性支出",
    "sourceSys": "ERP项目管理模块 (PS) / 审计决算书",
    "protocol": "项目建档录入审核",
    "spatialScope": "具体节能技改工程项目",
    "industry": "通用综合",
    "validation": "≥ 0; 用于计算项目动态投资回收期",
    "associatedMetrics": [
      {
        "metricId": "M22",
        "metricName": "零碳技改项目动态投资回收期",
        "role": "分子"
      }
    ]
  },
  {
    "id": 86,
    "name": "节能项目年化运维支出 (OPEX)",
    "key": "energy_project_opex_wan_yuan",
    "domain": "节能项目与零碳评估",
    "unit": "万元/年",
    "dataType": "Float(8,2)",
    "freq": "年度决算统计",
    "definition": "项目建成投产后，每年用于设备定期点检、药剂更换、滤芯耗材及维保人工的运营维护成本",
    "sourceSys": "财务成本账套 / 设备维保工单",
    "protocol": "年度维护费用分摊",
    "spatialScope": "各技改系统资产",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": [
      {
        "metricId": "M22",
        "metricName": "零碳技改项目动态投资回收期",
        "role": "分母"
      }
    ]
  },
  {
    "id": 87,
    "name": "IPMVP 基准期核定实测日均用能",
    "key": "ipmvp_baseline_daily_energy_kwh",
    "domain": "节能项目与零碳评估",
    "unit": "kWh/d",
    "dataType": "Float(10,2)",
    "freq": "基准期确定后静态固化",
    "definition": "国际节能量测量和验证规程 (IPMVP) 约定的改造前基准期（通常连续完整1年）系统日均耗能基准",
    "sourceSys": "历史 SCADA 计量归档数据库 / 专家核验报告",
    "protocol": "能效评估引擎归档",
    "spatialScope": "技改前被监测设备输入侧",
    "industry": "通用综合",
    "validation": "≥ 0; 不可随意篡改的权威核证基准",
    "associatedMetrics": [
      {
        "metricId": "M21",
        "metricName": "IPMVP节能工程核验证实节能量",
        "role": "分子"
      }
    ]
  },
  {
    "id": 88,
    "name": "IPMVP 报告期核定实测日均用能",
    "key": "ipmvp_reporting_daily_energy_kwh",
    "domain": "节能项目与零碳评估",
    "unit": "kWh/d",
    "dataType": "Float(10,2)",
    "freq": "报告期在线连续量测计算",
    "definition": "改造后统计报告期内，在相同或经产量、气象归一化校正后系统的实际日均耗能",
    "sourceSys": "当前 SCADA 在线电表计量底数",
    "protocol": "系统每日自动结算",
    "spatialScope": "技改后设备专用计量电表",
    "industry": "通用综合",
    "validation": "≥ 0",
    "associatedMetrics": [
      {
        "metricId": "M21",
        "metricName": "IPMVP节能工程核验证实节能量",
        "role": "分母"
      }
    ]
  },
  {
    "id": 89,
    "name": "室外制冷度日数 (CDD) / 采暖度日数 (HDD)",
    "key": "outdoor_cooling_heating_degree_days",
    "domain": "节能项目与零碳评估",
    "unit": "℃·d",
    "dataType": "Float(6,1)",
    "freq": "气象站每日核算累加",
    "definition": "日均室外气温偏离基准温度（通常 18℃ 或 26℃）的累计绝对温差积分值，用于空调冷热站节能量客观气象校正",
    "sourceSys": "园区环境气象站 / 地方气象局气温数据集",
    "protocol": "气象API定时同步",
    "spatialScope": "各工业园区地理坐标所在地",
    "industry": "通用综合",
    "validation": "≥ 0; 空调建筑能效对标核心外部变量",
    "associatedMetrics": []
  },
  {
    "id": 90,
    "name": "零碳工厂自评估指标得分项原始打分",
    "key": "zero_carbon_factory_audit_score",
    "domain": "节能项目与零碳评估",
    "unit": "分",
    "dataType": "Float(5,1)",
    "freq": "半年度自评与专家复核",
    "definition": "依据《零碳工厂评价规范》团体标准对基础设施、能源利用、减碳管理、碳抵消等 32 项细分条款的客观量化打分",
    "sourceSys": "零碳工厂自评估工作台",
    "protocol": "专家在线评审与证据链上传",
    "spatialScope": "参评单体工厂",
    "industry": "通用综合",
    "validation": "0.0 ~ 100.0 分; 附带权威佐证材料附件",
    "associatedMetrics": [
      {
        "metricId": "M23",
        "metricName": "零碳工厂自评估成熟度综合得分",
        "role": "分子"
      },
      {
        "metricId": "M23",
        "metricName": "零碳工厂自评估成熟度综合得分",
        "role": "分母"
      }
    ]
  },
  {
    "id": 91,
    "name": "表计资产编号 (Meter Tag)",
    "key": "meter_asset_serial_tag",
    "domain": "计量表计与设备档案",
    "unit": "-",
    "dataType": "String(32)",
    "freq": "表计安装入网建档",
    "definition": "全厂所有电能表、水表、燃气表、蒸汽流量计贴附的资产条码与平台唯一标识",
    "sourceSys": "ERP设备资产台账 / 物联网平台",
    "protocol": "资产建档登记",
    "spatialScope": "各计量点位物理表计",
    "industry": "通用综合",
    "validation": "全站非空唯一编码; 如 MTR-SB-10KV-01",
    "associatedMetrics": [
      {
        "metricId": "M01",
        "metricName": "全厂/园区综合能耗",
        "role": "分母"
      },
      {
        "metricId": "M20",
        "metricName": "空调运行折算建筑面积单耗",
        "role": "分母"
      }
    ]
  },
  {
    "id": 92,
    "name": "电能表电流互感器变比 (CT Ratio)",
    "key": "meter_current_transformer_ratio",
    "domain": "计量表计与设备档案",
    "unit": "-",
    "dataType": "String(16)",
    "freq": "计量装置投运校验固化",
    "definition": "高压电能计量回路电流互感器一次额定电流与二次额定电流比值（如 600/5A，变比为 120）",
    "sourceSys": "供电局定值单 / 计量检定证书",
    "protocol": "物联接入配置",
    "spatialScope": "高压配电柜开关间隔内部 CT",
    "industry": "通用综合",
    "validation": "必须匹配供电部门正式铅封定值单",
    "associatedMetrics": []
  },
  {
    "id": 93,
    "name": "电能表电压互感器变比 (PT Ratio)",
    "key": "meter_voltage_transformer_ratio",
    "domain": "计量表计与设备档案",
    "unit": "-",
    "dataType": "String(16)",
    "freq": "计量装置投运校验固化",
    "definition": "高压电能计量回路电压互感器一次额定电压与二次额定电压比值（如 10000/100V，变比为 100）",
    "sourceSys": "供电局定值单 / 计量检定证书",
    "protocol": "物联接入配置",
    "spatialScope": "高压 PT 柜母线避雷器隔离开关段",
    "industry": "通用综合",
    "validation": "低压 400V 系统为 1/1",
    "associatedMetrics": []
  },
  {
    "id": 94,
    "name": "表计综合倍率 (Multiplier)",
    "key": "meter_overall_multiplier",
    "domain": "计量表计与设备档案",
    "unit": "-",
    "dataType": "Float(10,2)",
    "freq": "参数变更校验维护",
    "definition": "电表实际计算电量时，二次脉冲或读数需乘以此系数还原为一次侧真实消耗量 K = CT * PT",
    "sourceSys": "SCADA/EMS系统表计参数字典",
    "protocol": "系统参数固化",
    "spatialScope": "各计量回路采集驱动",
    "industry": "通用综合",
    "validation": "≥ 1.00; 如 120 × 100 = 12000",
    "associatedMetrics": []
  },
  {
    "id": 95,
    "name": "重点用能设备额定工作功率",
    "key": "equipment_rated_power_kw",
    "domain": "计量表计与设备档案",
    "unit": "kW",
    "dataType": "Float(8,2)",
    "freq": "设备出厂铭牌参数固化",
    "definition": "单台用电设备在额定工作电压与额定负载下的标称连续输出机械或电气功率",
    "sourceSys": "设备资产台账 / 制造商出厂铭牌",
    "protocol": "资产台账建档",
    "spatialScope": "重点用能设备机身铭牌",
    "industry": "通用综合",
    "validation": "> 0; 如 500kW 相变干燥罐",
    "associatedMetrics": [
      {
        "metricId": "M08",
        "metricName": "重点用电设备实时负荷率",
        "role": "分母"
      }
    ]
  },
  {
    "id": 96,
    "name": "电力当量折标煤系数",
    "key": "factor_elec_equivalent_kgce_kwh",
    "domain": "标准基准与排放因子",
    "unit": "kgce/kWh",
    "dataType": "Float(6,4)",
    "freq": "国家标准发布更新 (GB/T 2589)",
    "definition": "国家标准 GB/T 2589-2020 规定的电力物理电热当量热值基准系数（860 kcal/kWh = 0.1229 kgce/kWh）",
    "sourceSys": "国家标准信息公共服务平台",
    "protocol": "系统全局配置参数",
    "spatialScope": "全国通用标准",
    "industry": "通用综合",
    "validation": "法定固定基准 0.1229; 不可任意篡改",
    "associatedMetrics": [
      {
        "metricId": "M16",
        "metricName": "光伏电站节约标煤量",
        "role": "分母"
      },
      {
        "metricId": "M55",
        "metricName": "化石燃料直接燃烧温室气体排放模型 (Scope 1)",
        "role": "分母"
      }
    ]
  },
  {
    "id": 97,
    "name": "电力等价折标煤系数 (供电煤耗动态折标)",
    "key": "factor_elec_equal_value_kgce_kwh",
    "domain": "标准基准与排放因子",
    "unit": "kgce/kWh",
    "dataType": "Float(6,4)",
    "freq": "年度国家能源局公开发布",
    "definition": "根据全国火电机组当年平均供电标煤耗动态确定的等价折标系数（通常在 0.3050 ~ 0.3150 kgce/kWh 之间）",
    "sourceSys": "国家能源局年度电力工业统计公报",
    "protocol": "年度系统参数同步",
    "spatialScope": "全国火力发电平均水平",
    "industry": "通用综合",
    "validation": "0.2800 ~ 0.3500; 用于宏观能源平衡表核算",
    "associatedMetrics": []
  },
  {
    "id": 98,
    "name": "新鲜水折标煤系数",
    "key": "factor_fresh_water_kgce_t",
    "domain": "标准基准与排放因子",
    "unit": "kgce/t",
    "dataType": "Float(6,4)",
    "freq": "国家标准固化",
    "definition": "国家标准 GB/T 2589 附录工业新鲜水制备取水提水综合能耗分摊折算系数",
    "sourceSys": "GB/T 2589-2020 附录表",
    "protocol": "系统配置固化",
    "spatialScope": "全国通用",
    "industry": "通用综合",
    "validation": "标准值 0.0857 kgce/t",
    "associatedMetrics": []
  },
  {
    "id": 99,
    "name": "管道天然气折标煤系数",
    "key": "factor_natural_gas_kgce_m3",
    "domain": "标准基准与排放因子",
    "unit": "kgce/m³",
    "dataType": "Float(6,4)",
    "freq": "国家标准固化 / 燃气检测报告",
    "definition": "标准立方米天然气以低位发热量 38931 kJ/m³ 折算的标准煤系数",
    "sourceSys": "GB/T 2589-2020",
    "protocol": "系统配置固化",
    "spatialScope": "全国通用",
    "industry": "通用综合",
    "validation": "标准值 1.2143 kgce/m³",
    "associatedMetrics": []
  },
  {
    "id": 100,
    "name": "工业蒸汽折标煤系数",
    "key": "factor_steam_kgce_kg",
    "domain": "标准基准与排放因子",
    "unit": "kgce/kg",
    "dataType": "Float(6,4)",
    "freq": "国家标准固化 / 供热管网焓值实测",
    "definition": "低压饱和蒸汽（0.8~1.0 MPa）以热焓值折算标准煤的折算系数",
    "sourceSys": "GB/T 2589-2020 / 供热合同技术协议",
    "protocol": "系统配置固化",
    "spatialScope": "园区供热总管",
    "industry": "通用综合",
    "validation": "标准值 0.0943 kgce/kg",
    "associatedMetrics": []
  },
  {
    "id": 101,
    "name": "工业柴油折标煤系数",
    "key": "factor_diesel_kgce_kg",
    "domain": "标准基准与排放因子",
    "unit": "kgce/kg",
    "dataType": "Float(6,4)",
    "freq": "国家标准固化",
    "definition": "工业柴油按平均低位发热量 42652 kJ/kg (10180 kcal/kg) 折算的标准煤系数",
    "sourceSys": "GB/T 2589-2020",
    "protocol": "系统配置固化",
    "spatialScope": "全国通用",
    "industry": "通用综合",
    "validation": "标准值 1.4571 kgce/kg",
    "associatedMetrics": []
  },
  {
    "id": 102,
    "name": "工业液氮折标煤系数",
    "key": "factor_liquid_nitrogen_kgce_m3",
    "domain": "标准基准与排放因子",
    "unit": "kgce/m³",
    "dataType": "Float(6,4)",
    "freq": "行业标准与深冷能效规范",
    "definition": "深冷空分制取高纯氮气综合电耗折算标准煤系数",
    "sourceSys": "工业气体行业能耗限额标准",
    "protocol": "系统参数字典",
    "spatialScope": "制氮站分界点",
    "industry": "通用综合",
    "validation": "标准基准值 0.6714 kgce/m³",
    "associatedMetrics": []
  },
  {
    "id": 103,
    "name": "全国公用电网平均碳排放因子",
    "key": "factor_grid_emission_national_tco2e_mwh",
    "domain": "标准基准与排放因子",
    "unit": "tCO2e/MWh",
    "dataType": "Float(6,4)",
    "freq": "生态环境部官方定期发布",
    "definition": "国家生态环境部正式发布的全国电力平均二氧化碳排放因子（用于企事业单位温室气体排放报告与核查）",
    "sourceSys": "生态环境部办公厅官方公函",
    "protocol": "国家标准库发布同步",
    "spatialScope": "中国境内所有外购电力主体",
    "industry": "通用综合",
    "validation": "最新公布权威基准 0.5703 tCO2e/MWh",
    "associatedMetrics": [
      {
        "metricId": "M17",
        "metricName": "光伏电站减排二氧化碳量",
        "role": "分母"
      },
      {
        "metricId": "M39",
        "metricName": "集控大屏 · 光伏出力 15 分钟波动率",
        "role": "分子"
      },
      {
        "metricId": "M56",
        "metricName": "外购电力与蒸汽间接温室气体排放模型 (Scope 2)",
        "role": "分母"
      }
    ]
  },
  {
    "id": 104,
    "name": "西北区域电网碳排放因子",
    "key": "factor_grid_emission_northwest_tco2e_mwh",
    "domain": "标准基准与排放因子",
    "unit": "tCO2e/MWh",
    "dataType": "Float(6,4)",
    "freq": "生态环境部发布",
    "definition": "特变电工新变、新缆等新疆制造基地所在西北区域电网平均排放因子",
    "sourceSys": "国家应对气候变化战略研究中心",
    "protocol": "系统参数字典",
    "spatialScope": "新疆、甘肃、青海、宁夏、陕西",
    "industry": "通用综合",
    "validation": "0.5920 tCO2e/MWh",
    "associatedMetrics": []
  },
  {
    "id": 105,
    "name": "高纯电解无氧铜实景碳排放因子",
    "key": "factor_pcf_copper_tco2e_t",
    "domain": "标准基准与排放因子",
    "unit": "kgCO2e/kg",
    "dataType": "Float(6,4)",
    "freq": "第三方 LCA 机构实测报告 / 数据库",
    "definition": "摇篮到大门 (Cradle-to-Gate) 电解铜精炼出厂每千克产品的生命周期温室气体排放强度",
    "sourceSys": "国际铜业协会 / 宝武、江铜第三方 EPD 声明",
    "protocol": "因子库版本维护",
    "spatialScope": "铜杆原材料供应链",
    "industry": "通用综合",
    "validation": "标准行业基准 4.2500 kgCO2e/kg",
    "associatedMetrics": []
  },
  {
    "id": 106,
    "name": "取向高导磁硅钢片实景碳排放因子",
    "key": "factor_pcf_silicon_steel_tco2e_t",
    "domain": "标准基准与排放因子",
    "unit": "kgCO2e/kg",
    "dataType": "Float(6,4)",
    "freq": "钢厂 EPD 环境产品声明更新",
    "definition": "高磁感取向冷轧电工钢卷每千克产品的全生命周期实测碳排放因子",
    "sourceSys": "宝武钢铁取向硅钢 PCR / EPD 认证报告",
    "protocol": "因子库版本维护",
    "spatialScope": "硅钢原材料供应链",
    "industry": "变压器产业",
    "validation": "标准行业基准 2.1500 kgCO2e/kg",
    "associatedMetrics": []
  },
  {
    "id": 107,
    "name": "变压器矿物绝缘油实景碳排放因子",
    "key": "factor_pcf_transformer_oil_tco2e_t",
    "domain": "标准基准与排放因子",
    "unit": "kgCO2e/kg",
    "dataType": "Float(6,4)",
    "freq": "炼化厂实景检测更新",
    "definition": "环烷基原油减压蒸馏、精制及脱水脱气深加工至变压器专用绝缘油的碳排放强度",
    "sourceSys": "中石油克拉玛依石化 EPD 报告",
    "protocol": "因子库版本维护",
    "spatialScope": "绝缘油供应链",
    "industry": "变压器产业",
    "validation": "标准基准值 1.8500 kgCO2e/kg",
    "associatedMetrics": []
  },
  {
    "id": 108,
    "name": "交联聚乙烯 (XLPE) 树脂颗粒碳足迹因子",
    "key": "factor_pcf_xlpe_tco2e_t",
    "domain": "标准基准与排放因子",
    "unit": "kgCO2e/kg",
    "dataType": "Float(6,4)",
    "freq": "化工原料厂商 LCA 报告",
    "definition": "聚乙烯聚合、接枝交联剂造粒成超净电缆级绝缘颗粒的原生材料碳排放因子",
    "sourceSys": "陶氏/北欧化工/万华化学 LCA 报告",
    "protocol": "因子库版本维护",
    "spatialScope": "电缆高分子绝缘料供应链",
    "industry": "电线电缆产业",
    "validation": "标准基准值 2.6800 kgCO2e/kg",
    "associatedMetrics": []
  }
];

/* ---------------- 兼容遗留历史导出 ---------------- */
export type DataKind = '静态数据' | '动态数据'
export type DataItem = {
  id: number
  code: string
  name: string
  kind: DataKind
  category: string
  unit: string
  dataType: string
  source: string
  scope: string
  acqMethod: string
  frequency: string
  retention: string
  benchmark?: string
  tolerance?: string
  status: 'active' | 'draft' | 'deprecated'
  version: string
  updatedAt: string
}

export const catalogItems: DataItem[] = platformBasicDataItems.map((p) => ({
  id: p.id,
  code: p.key,
  name: p.name,
  kind: (p.domain.includes('标准') || p.domain.includes('档案')) ? '静态数据' : '动态数据',
  category: p.domain,
  unit: p.unit,
  dataType: p.dataType,
  source: p.sourceSys,
  scope: p.spatialScope,
  acqMethod: p.protocol,
  frequency: p.freq,
  retention: '永久存储 (冷热分层归档)',
  benchmark: p.validation,
  tolerance: '±0.2%',
  status: 'active',
  version: 'v2.0',
  updatedAt: '2026-03-31',
}))

export function catalogStats(items: PlatformDictionaryItem[] = platformBasicDataItems) {
  const total = items.length
  const autoAcq = items.filter((i) =>
    i.sourceSys.includes('SCADA') ||
    i.sourceSys.includes('EMS') ||
    i.sourceSys.includes('MES') ||
    i.sourceSys.includes('关口表')
  ).length
  const transformer = items.filter((i) => i.industry === '变压器产业').length
  const cable = items.filter((i) => i.industry === '电线电缆产业').length
  const general = items.filter((i) => i.industry === '通用综合').length
  const linked = items.filter((i) => (i.associatedMetrics && i.associatedMetrics.length > 0)).length

  return { total, autoAcq, transformer, cable, general, linked }
}

export const dataCatalogNote =
  '本数据字典汇总特变电工零碳园区与产品碳足迹双中心全量底层基础数据（遥测点位、表计读数、工况参数、工单产出、财务费用、供应链物料、CBAM报关、计量档案、标准基准）。彻底剥离分子、分母、静态等计算分类，用于平台统一数据治理与开发核对。'

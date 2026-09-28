/**
 * 特变电工能碳数字化双中心 - 生产工序管理数据字典与映射拓扑
 * 
 * 权威依据：《需求文档/评审资料/组织树关键工序梳理.xlsx》
 * 架构核心：以【生产工序】为主导实体（Master Entity），关联全集团各家制造企业/工厂、产品型号/产线以及能源介质类型。
 */

import { ERP_SUBCATEGORIES } from './product-model-mapping'

export interface ProcessFactoryMapping {
  id: string
  companyName: string
  factoryName: string
  parkName: string
  productModel: string
  unit: string
  dataOrigin: string
  remark?: string
}

export interface ProcessMasterItem {
  id: string
  code: string                                       // 工序唯一编码 (如 PROC-TR-DRY-01)
  name: string                                       // 工序名称 (如 变压器-高压-干燥)
  category: 'transformer' | 'core' | 'cable' | 'other' // 专业分类
  categoryLabel: string                              // 分类标签 (变压器制造 / 铁心制造 / 线缆制造)
  description?: string                               // 工序说明与技术特征
  energyTypes: string[]                              // 使用能源类型 (['电力', '蒸汽'] 或 ['电力'])
  unit: string                                       // 主要计量单位
  factoryCount: number                               // 涉及工厂数量
  linkedFactories: string[]                          // 涉及工厂名称列表
  productModelCount: number                          // 涉及产品型号数量
  linkedProductModels: string[]                      // 涉及产品型号列表
  factories: ProcessFactoryMapping[]                 // 该工序在各工厂的具体映射详情列表
  status: 'enabled' | 'disabled'                     // 启用状态
  updatedAt: string                                  // 维护时间
  operator: string                                   // 维护人
}

/** 11 大标准生产工序全息主数据集 */
export const INITIAL_PROCESS_MASTER_ITEMS: ProcessMasterItem[] = [
  {
    "id": "proc_proc_tr_dry_01",
    "code": "PROC-TR-DRY-01",
    "name": "变压器-高压-干燥",
    "category": "transformer",
    "categoryLabel": "变压器制造",
    "description": "干燥烘房真空注油工序，需消耗电能与高温蒸汽",
    "energyTypes": [
      "电力",
      "蒸汽"
    ],
    "unit": "kVA",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "沈变公司",
        "factoryName": "沈变本部",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流变压器-1000KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_1"
      },
      {
        "companyName": "沈变公司",
        "factoryName": "沈变本部",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_2"
      },
      {
        "companyName": "沈变公司",
        "factoryName": "沈变本部",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_3"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "衡变本部",
        "parkName": "特变电工南方输变电产业园",
        "productModel": "交流变压器-1000KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_4"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "衡变本部",
        "parkName": "特变电工南方输变电产业园",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_5"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "衡变本部",
        "parkName": "特变电工南方输变电产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_6"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_7"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_8"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_9"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_10"
      },
      {
        "companyName": "新变厂",
        "factoryName": "超高压公司",
        "parkName": "西北输变电科技产业园",
        "productModel": "交流变压器-1000KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_11"
      },
      {
        "companyName": "新变厂",
        "factoryName": "超高压公司",
        "parkName": "西北输变电科技产业园",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_12"
      },
      {
        "companyName": "新变厂",
        "factoryName": "超高压公司",
        "parkName": "西北输变电科技产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_13"
      },
      {
        "companyName": "新变厂",
        "factoryName": "天变公司 (天变智能科技)",
        "parkName": "华北输变电科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_14"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_15"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_16"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_17"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_01_fac_18"
      }
    ],
    "factoryCount": 8,
    "linkedFactories": [
      "京津冀科技",
      "天变公司 (天变智能科技)",
      "智能电气",
      "沈变本部",
      "湖南电气",
      "特能建",
      "衡变本部",
      "超高压公司"
    ],
    "productModelCount": 6,
    "linkedProductModels": [
            "交流变压器-1000KV",
            "交流变压器-750KV",
            "交流变压器-500KV",
            "交流变压器-220KV",
            "交流变压器-110KV",
            "直流变压器-±800kv"
      ]
  },
  {
    "id": "proc_proc_tr_test_01",
    "code": "PROC-TR-TEST-01",
    "name": "变压器-试验",
    "category": "transformer",
    "categoryLabel": "变压器制造",
    "description": "出厂试验及温升型式试验工序，纯电力驱动测试",
    "energyTypes": [
      "电力"
    ],
    "unit": "kVA",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "沈变公司",
        "factoryName": "沈变本部",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流变压器-1000KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_1"
      },
      {
        "companyName": "沈变公司",
        "factoryName": "沈变本部",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_2"
      },
      {
        "companyName": "沈变公司",
        "factoryName": "沈变本部",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_3"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "衡变本部",
        "parkName": "特变电工南方输变电产业园",
        "productModel": "交流变压器-1000KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_4"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "衡变本部",
        "parkName": "特变电工南方输变电产业园",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_5"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "衡变本部",
        "parkName": "特变电工南方输变电产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_6"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_7"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_8"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_9"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "油浸配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_10"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_11"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_12"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-220KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_13"
      },
      {
        "companyName": "新变厂",
        "factoryName": "超高压公司",
        "parkName": "西北输变电科技产业园",
        "productModel": "交流变压器-1000KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_14"
      },
      {
        "companyName": "新变厂",
        "factoryName": "超高压公司",
        "parkName": "西北输变电科技产业园",
        "productModel": "交流变压器-500KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_15"
      },
      {
        "companyName": "新变厂",
        "factoryName": "超高压公司",
        "parkName": "西北输变电科技产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_16"
      },
      {
        "companyName": "新变厂",
        "factoryName": "天变公司 (天变智慧能源)",
        "parkName": "华北输变电科技产业园",
        "productModel": "干式配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_17"
      },
      {
        "companyName": "新变厂",
        "factoryName": "天变公司 (天变沈阳基地)",
        "parkName": "华北输变电科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_18"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_19"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "干式配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_20"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_21"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_22"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "油浸配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_23"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "交流变压器-110KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_24"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_25"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_26"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "油浸配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_test_01_fac_27"
      }
    ],
    "factoryCount": 9,
    "linkedFactories": [
      "京津冀科技",
      "天变公司 (天变智慧能源)",
      "天变公司 (天变沈阳基地)",
      "智能电气",
      "沈变本部",
      "湖南电气",
      "特能建",
      "衡变本部",
      "超高压公司"
    ],
    "productModelCount": 6,
    "linkedProductModels": [
            "交流变压器-1000KV",
            "交流变压器-500KV",
            "交流变压器-220KV",
            "交流变压器-110KV",
            "干式配变-硅钢叠铁心",
            "油浸配变-硅钢叠铁心"
      ]
  },
  {
    "id": "proc_proc_tr_dry_02",
    "code": "PROC-TR-DRY-02",
    "name": "变压器-中低压-油变-干燥",
    "category": "transformer",
    "categoryLabel": "变压器制造",
    "description": "中低压油浸式变压器线圈及铁心干燥工序",
    "energyTypes": [
      "电力",
      "蒸汽"
    ],
    "unit": "kVA",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_1"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_2"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "油浸配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_3"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-220KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_4"
      },
      {
        "companyName": "新变厂",
        "factoryName": "天变公司 (天变衡阳基地)",
        "parkName": "华北输变电科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_5"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_6"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_7"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "油浸配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_8"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_9"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_10"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "油浸配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_dry_02_fac_11"
      }
    ],
    "factoryCount": 5,
    "linkedFactories": [
      "京津冀科技",
      "天变公司 (天变衡阳基地)",
      "智能电气",
      "湖南电气",
      "特能建"
    ],
    "productModelCount": 2,
    "linkedProductModels": [
            "油浸配变-硅钢叠铁心",
            "交流变压器-35KV及以下"
      ]
  },
  {
    "id": "proc_proc_tr_cure_01",
    "code": "PROC-TR-CURE-01",
    "name": "变压器-中低压-干变-固化",
    "category": "transformer",
    "categoryLabel": "变压器制造",
    "description": "干式变压器树脂浇注与高温固化烘箱工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "kVA",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_1"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "湖南电气",
        "parkName": "特变电工云集5G科技产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_2"
      },
      {
        "companyName": "衡变公司",
        "factoryName": "特能建",
        "parkName": "特变电工湖南能源建设园区",
        "productModel": "交流变压器-220KV",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_3"
      },
      {
        "companyName": "新变厂",
        "factoryName": "天变公司 (天变天津基地)",
        "parkName": "华北输变电科技产业园",
        "productModel": "干式配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_4"
      },
      {
        "companyName": "新变厂",
        "factoryName": "天变公司 (天变衡阳基地)",
        "parkName": "华北输变电科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_5"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "干式配变-硅钢叠铁心",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_6"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_7"
      },
      {
        "companyName": "新变厂",
        "factoryName": "智能电气",
        "parkName": "新疆智能电气产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_8"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "美式箱变",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_9"
      },
      {
        "companyName": "新变厂",
        "factoryName": "京津冀科技",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "交流变压器-35KV及以下",
        "unit": "kVA",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_tr_cure_01_fac_10"
      }
    ],
    "factoryCount": 6,
    "linkedFactories": [
      "京津冀科技",
      "天变公司 (天变天津基地)",
      "天变公司 (天变衡阳基地)",
      "智能电气",
      "湖南电气",
      "特能建"
    ],
    "productModelCount": 4,
    "linkedProductModels": [
            "干式配变-硅钢叠铁心",
            "干式配变-非晶合金",
            "美式箱变",
            "欧式箱变"
      ]
  },
  {
    "id": "proc_proc_cr_anl_01",
    "code": "PROC-CR-ANL-01",
    "name": "非晶合金铁心-退火",
    "category": "core",
    "categoryLabel": "铁心制造",
    "description": "非晶合金带材纵剪卷绕后保护气氛退火炉去应力工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "t",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "新变厂",
        "factoryName": "珠峰硅钢",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "干式配变-非晶合金",
        "unit": "t",
        "dataOrigin": "珠峰硅钢2车间产量",
        "remark": "计算产量单耗，产量来自订单汇总。\n3#、5#车间分开统计",
        "id": "proc_proc_cr_anl_01_fac_1"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "珠峰硅钢"
    ],
    "productModelCount": 1,
    "linkedProductModels": [
            "干式配变-非晶合金"
      ]
  },
  {
    "id": "proc_proc_cr_slt_01",
    "code": "PROC-CR-SLT-01",
    "name": "硅钢铁心-纵剪（3#、5#）",
    "category": "core",
    "categoryLabel": "铁心制造",
    "description": "取向硅钢片高精度数控纵剪分条工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "t",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "新变厂",
        "factoryName": "珠峰硅钢",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "硅钢叠铁心",
        "unit": "t",
        "dataOrigin": "珠峰硅钢3#、5#产量",
        "remark": "",
        "id": "proc_proc_cr_slt_01_fac_1"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "珠峰硅钢"
    ],
    "productModelCount": 3,
    "linkedProductModels": [
            "交流变压器-1000KV",
            "交流变压器-500KV",
            "干式配变-硅钢叠铁心"
      ]
  },
  {
    "id": "proc_proc_cr_stk_01",
    "code": "PROC-CR-STK-01",
    "name": "硅钢铁心-中型叠装（3#、5#）",
    "category": "core",
    "categoryLabel": "铁心制造",
    "description": "中型变压器硅钢片自动叠片与绑扎工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "t",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "新变厂",
        "factoryName": "珠峰硅钢",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "硅钢叠铁心",
        "unit": "t",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cr_stk_01_fac_1"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "珠峰硅钢"
    ],
    "productModelCount": 2,
    "linkedProductModels": [
            "干式配变-硅钢叠铁心",
            "交流变压器-110KV"
      ]
  },
  {
    "id": "proc_proc_cr_stk_02",
    "code": "PROC-CR-STK-02",
    "name": "硅钢铁心-大型叠装（3#、5#）",
    "category": "core",
    "categoryLabel": "铁心制造",
    "description": "大型/特大型变压器铁心人工与机械人精益叠装工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "t",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "新变厂",
        "factoryName": "珠峰硅钢",
        "parkName": "特变电工京津冀智能科技产业园",
        "productModel": "硅钢叠铁心",
        "unit": "t",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cr_stk_02_fac_1"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "珠峰硅钢"
    ],
    "productModelCount": 3,
    "linkedProductModels": [
            "交流变压器-1000KV",
            "交流变压器-500KV",
            "直流变压器-±800kv"
      ]
  },
  {
    "id": "proc_proc_cb_drw_01",
    "code": "PROC-CB-DRW-01",
    "name": "拉丝",
    "category": "cable",
    "categoryLabel": "线缆制造",
    "description": "铜杆/铝杆大拉、中拉、多头小拉高速连续拉拔工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "km*mm2, t",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "高压交联电力电缆 (110kV)",
        "unit": "km*mm2",
        "dataOrigin": "1、产品产量由订单汇总",
        "remark": "计算产量单耗，产量来自订单汇总",
        "id": "proc_proc_cb_drw_01_fac_1"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "钢芯铝绞线 (JL/G1A)",
        "unit": "t",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_2"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "聚氯乙烯绝缘电线 (BV/BVR)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_3"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "低压交联电力电缆 (0.6/1kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_4"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_5"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "光伏专用电缆 (PV1-F/H1Z2Z2)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_6"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "控制屏蔽电缆 (KVV/KVVP)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_7"
      },
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (昭和)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "电缆终端与接头附件",
        "unit": "套",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_8"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "钢芯铝绞线 (JL/G1A)",
        "unit": "t",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "计算产量单耗，产量来自订单汇总",
        "id": "proc_proc_cb_drw_01_fac_9"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "聚氯乙烯绝缘电线 (BV/BVR)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_10"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "低压交联电力电缆 (0.6/1kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_11"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_12"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "光伏专用电缆 (PV1-F/H1Z2Z2)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_13"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "控制屏蔽电缆 (KVV/KVVP)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_14"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "矿用阻燃橡套软电缆 (MY/MYPT)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_15"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆电缆)",
        "parkName": "特变电工新疆电缆产业园",
        "productModel": "聚氯乙烯绝缘电线 (BV/BVR)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_16"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆电缆)",
        "parkName": "特变电工新疆电缆产业园",
        "productModel": "低压交联电力电缆 (0.6/1kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_17"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆电缆)",
        "parkName": "特变电工新疆电缆产业园",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_18"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆电缆)",
        "parkName": "特变电工新疆电缆产业园",
        "productModel": "光伏专用电缆 (PV1-F/H1Z2Z2)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_19"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆电缆)",
        "parkName": "特变电工新疆电缆产业园",
        "productModel": "控制屏蔽电缆 (KVV/KVVP)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_20"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "钢芯铝绞线 (JL/G1A)",
        "unit": "t",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "计算产量单耗，产量来自订单汇总",
        "id": "proc_proc_cb_drw_01_fac_21"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "聚氯乙烯绝缘电线 (BV/BVR)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_22"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "低压交联电力电缆 (0.6/1kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_23"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_24"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "光伏专用电缆 (PV1-F/H1Z2Z2)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_25"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "控制屏蔽电缆 (KVV/KVVP)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_26"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "矿用阻燃橡套软电缆 (MY/MYPT)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_drw_01_fac_27"
      }
    ],
    "factoryCount": 5,
    "linkedFactories": [
      "德缆公司",
      "新缆厂 (新疆电缆)",
      "新缆厂 (新疆线缆厂)",
      "鲁缆公司 (昭和)",
      "鲁缆公司 (鲁缆本部)"
    ],
    "productModelCount": 6,
    "linkedProductModels": [
            "超高压交联电力电缆 (220kV)",
            "高压交联电力电缆 (110kV)",
            "中压交联电力电缆 (8.7/15kV)",
            "低压交联电力电缆 (0.6/1kV)",
            "钢芯铝绞线 (JL/G1A)",
            "控制屏蔽电缆 (KVV/KVVP)"
      ]
  },
  {
    "id": "proc_proc_cb_cv_01",
    "code": "PROC-CB-CV-01",
    "name": "高压交联（干法）",
    "category": "cable",
    "categoryLabel": "线缆制造",
    "description": "高压/超高压交联聚乙烯立塔（VCV）干法化学交联生产线",
    "energyTypes": [
      "电力"
    ],
    "unit": "km*mm2",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "高压交联电力电缆 (110kV)",
        "unit": "km*mm2",
        "dataOrigin": "1、产品产量由订单汇总",
        "remark": "计算产量单耗，产量来自订单汇总",
        "id": "proc_proc_cb_cv_01_fac_1"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "鲁缆公司 (鲁缆本部)"
    ],
    "productModelCount": 3,
    "linkedProductModels": [
            "特高压电力电缆 (500kV)",
            "超高压交联电力电缆 (220kV)",
            "高压交联电力电缆 (110kV)"
      ]
  },
  {
    "id": "proc_proc_cb_cv_02",
    "code": "PROC-CB-CV-02",
    "name": "中压交联（干法）",
    "category": "cable",
    "categoryLabel": "线缆制造",
    "description": "中压悬臂（CCV）三层共挤干法化学交联生产线",
    "energyTypes": [
      "电力"
    ],
    "unit": "km*mm2",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "鲁缆公司",
        "factoryName": "鲁缆公司 (鲁缆本部)",
        "parkName": "特变电工华东输变电科技产业园",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_cv_02_fac_1"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆线缆厂)",
        "parkName": "特变电工输变电产业园",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_cv_02_fac_2"
      },
      {
        "companyName": "新缆厂",
        "factoryName": "新缆厂 (新疆电缆)",
        "parkName": "特变电工新疆电缆产业园",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_cv_02_fac_3"
      },
      {
        "companyName": "德缆公司",
        "factoryName": "德缆公司",
        "parkName": "特变电工(德阳)电缆园区",
        "productModel": "中压交联电力电缆 (8.7/15kV)",
        "unit": "km*mm2",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_proc_cb_cv_02_fac_4"
      }
    ],
    "factoryCount": 4,
    "linkedFactories": [
      "德缆公司",
      "新缆厂 (新疆电缆)",
      "新缆厂 (新疆线缆厂)",
      "鲁缆公司 (鲁缆本部)"
    ],
        "productModelCount": 3,
    "linkedProductModels": [
            "中压交联电力电缆 (8.7/15kV)",
            "中压铠装电力电缆 (26/35kV)",
            "低压交联电力电缆 (0.6/1kV)"
      ]
  },
  {
    "id": "proc_proc_tg_dry_01",
    "code": "PROC-TG-DRY-01",
    "name": "套管-干燥",
    "category": "transformer",
    "categoryLabel": "变压器制造",
    "description": "40.5kV~1100kV交流油纸电容套管与特高压直流穿墙套管真空干燥注油工序",
    "energyTypes": [
      "电力"
    ],
    "unit": "支",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "沈变公司",
        "factoryName": "和新套管",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "交流套管-72.5至252kV",
        "unit": "支",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_tg_dry_fac_1"
      },
      {
        "companyName": "沈变公司",
        "factoryName": "和新套管",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "直流套管-±500至±1100kV",
        "unit": "支",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_tg_dry_fac_2"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "和新套管"
    ],
    "productModelCount": 2,
    "linkedProductModels": [
      "直流套管-±500至±1100kV",
      "交流套管-72.5至252kV"
    ]
  },
  {
    "id": "proc_proc_hg_dry_01",
    "code": "PROC-HG-DRY-01",
    "name": "互感器-干燥",
    "category": "transformer",
    "categoryLabel": "变压器制造",
    "description": "高压互感器器身真空干燥与注油工序，需消耗电能与高温蒸汽",
    "energyTypes": [
      "电力",
      "蒸汽"
    ],
    "unit": "台",
    "status": "enabled",
    "updatedAt": "2026-09-22 17:40",
    "operator": "系统管理员",
    "factories": [
      {
        "companyName": "沈变公司",
        "factoryName": "康嘉互感器",
        "parkName": "特变电工东北输变电产业园",
        "productModel": "高压电流互感器",
        "unit": "台",
        "dataOrigin": "产品产量由订单汇总",
        "remark": "",
        "id": "proc_hg_dry_fac_1"
      }
    ],
    "factoryCount": 1,
    "linkedFactories": [
      "康嘉互感器"
    ],
    "productModelCount": 1,
    "linkedProductModels": [
      "高压电流互感器"
    ]
  }
];

/** 专业分类字典 */
export const PROCESS_CATEGORIES = [
  { key: 'all', label: '全部工序分类' },
  { key: 'transformer', label: '变压器制造' },
  { key: 'core', label: '铁心制造' },
  { key: 'cable', label: '线缆制造' },
] as const;

/** 能源类型选项 */
export const PROCESS_ENERGY_OPTIONS = [
  { key: 'all', label: '全部能源类型' },
  { key: 'elec', label: '⚡ 电力驱动' },
  { key: 'elec_steam', label: '⚡ 电力 + 🔥 蒸汽' },
] as const;

/** 6 大经营单位列表 */
export const PROCESS_COMPANIES = [
  '沈变公司',
  '衡变公司',
  '新变厂',
  '鲁缆公司',
  '新缆厂',
  '德缆公司',
] as const;

/** 关键生产工厂列表 */
export const PROCESS_FACTORIES = [
  '沈变本部',
  '和新套管',
  '康嘉互感器',
  '衡变本部',
  '湖南电气',
  '特能建',
  '超高压公司',
  '天变公司',
  '智能电气',
  '京津冀科技',
  '珠峰硅钢',
  '鲁缆公司',
  '新缆厂',
  '德缆公司',
] as const;

/** 标准产品种类名称列表 (供下拉过滤) */
export const PROCESS_PRODUCT_MODELS = ERP_SUBCATEGORIES.map((s) => s.name);

/** 全量制造工厂元数据实体 */
export interface MasterFactoryItem {
  id: string
  factoryName: string
  companyName: string
  parkName: string
  industry: 'transformer' | 'core' | 'cable'
}

/** 制造工厂全量主数据字典（供管理员全局勾选关联） */
export const ALL_MASTER_FACTORIES: MasterFactoryItem[] = [
  { id: 'fac_sb_main', factoryName: '沈变本部', companyName: '沈变公司', parkName: '特变电工东北输变电产业园', industry: 'transformer' },
  { id: 'fac_sb_hx', factoryName: '和新套管', companyName: '沈变公司', parkName: '特变电工东北输变电产业园', industry: 'transformer' },
  { id: 'fac_sb_kj', factoryName: '康嘉互感器', companyName: '沈变公司', parkName: '特变电工东北输变电产业园', industry: 'transformer' },
  { id: 'fac_sb_tng', factoryName: '特能建', companyName: '沈变公司', parkName: '特变电工沈阳产业园', industry: 'transformer' },
  { id: 'fac_sb_elec', factoryName: '智能电气', companyName: '沈变公司', parkName: '特变电工沈阳产业园', industry: 'transformer' },
  { id: 'fac_sb_tb_sy', factoryName: '天变公司 (天变沈阳基地)', companyName: '沈变公司', parkName: '特变电工沈阳产业园', industry: 'transformer' },
  { id: 'fac_hb_main', factoryName: '衡变本部', companyName: '衡变公司', parkName: '特变电工南方输变电产业园', industry: 'transformer' },
  { id: 'fac_hb_hndq', factoryName: '湖南电气', companyName: '衡变公司', parkName: '特变电工南方输变电产业园', industry: 'transformer' },
  { id: 'fac_hb_uhv', factoryName: '超高压公司', companyName: '衡变公司', parkName: '特变电工南方输变电产业园', industry: 'transformer' },
  { id: 'fac_hb_jjj', factoryName: '京津冀科技', companyName: '衡变公司', parkName: '天津新技术产业园', industry: 'transformer' },
  { id: 'fac_hb_tb_tj', factoryName: '天变公司 (天变天津基地)', companyName: '衡变公司', parkName: '天津智能电气产业园', industry: 'transformer' },
  { id: 'fac_hb_tb_zh', factoryName: '天变公司 (天变智慧能源)', companyName: '衡变公司', parkName: '天津智能电气产业园', industry: 'transformer' },
  { id: 'fac_hb_tb_zn', factoryName: '天变公司 (天变智能科技)', companyName: '衡变公司', parkName: '天津智能电气产业园', industry: 'transformer' },
  { id: 'fac_hb_tb_hy', factoryName: '天变公司 (天变衡阳基地)', companyName: '衡变公司', parkName: '特变电工南方输变电产业园', industry: 'transformer' },
  { id: 'fac_ll_main', factoryName: '鲁缆公司 (鲁缆本部)', companyName: '鲁缆公司', parkName: '鲁能泰山电缆产业园', industry: 'cable' },
  { id: 'fac_ll_zh', factoryName: '鲁缆公司 (昭和)', companyName: '鲁缆公司', parkName: '特变电工山东产业园', industry: 'cable' },
  { id: 'fac_xl_wire', factoryName: '新缆厂 (新疆线缆厂)', companyName: '新缆厂', parkName: '特变电工新疆线缆产业园', industry: 'cable' },
  { id: 'fac_xl_cable', factoryName: '新缆厂 (新疆电缆)', companyName: '新缆厂', parkName: '特变电工新疆线缆产业园', industry: 'cable' },
  { id: 'fac_dl_main', factoryName: '德缆公司', companyName: '德缆公司', parkName: '特变电工(德阳)电缆园区', industry: 'cable' },
];

/** 全量产品中类元数据实体 */
export interface MasterProductItem {
  id: string
  modelName: string            // 产品中类名称 (如 交流变压器-1000KV)
  code: string                 // 10位产品中类编码 (如 1001010701)
  category: string             // 所属产量大类 / 产品大类 (如 变压器、高压组合电器 GIS、高压电力电缆 等)
  unit: string                 // 计量单位 (万kVA, 间隔, 支, 台, km, 吨, 万m)
}

/** 全量标准产品中类主数据字典（基于系统设置 ERP_SUBCATEGORIES 标准生成，供工序关联勾选） */
export const ALL_MASTER_PRODUCTS: MasterProductItem[] = ERP_SUBCATEGORIES.map((s) => ({
  id: `sub_${s.code}`,
  modelName: s.name,
  code: s.code,
  category: s.majorCategoryName,
  unit: s.unit,
}));

/** 全量产量大类（产品大类）列表（去重供弹窗与筛选使用） */
export const PROCESS_MAJOR_CATEGORIES: string[] = Array.from(
  new Set(ALL_MASTER_PRODUCTS.map((p) => p.category).filter(Boolean)),
);

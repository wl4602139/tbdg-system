#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · 全量 37 个功能页面深度规格拼装与编译总控程序 (assemble_full_specs.py)
功能：
1. 聚合 38 篇开发手册清单 (MANUAL_DOCS)；
2. 聚合 3 卷 PRD 需求规格清单 (PRD_DOCS)；
3. 拼装全量 37 个功能页面的【模块、参数、数据来源、计算方式、DTO、FE/BE/QA】深度规格 (PAGE_MODULE_SPECS)；
4. 拼装 37 节点 1对1 映射的系统功能导航树 (SYSTEM_FUNCTIONAL_TREE)；
5. 聚合数据字典与在线评审矩阵；
6. 自动向暗黑端与浅色端工程输出统一的 `lib/docs-data.ts`。
"""

import os
import sys
import json
from pathlib import Path

# 保证 UTF-8 输出
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(r"D:\Project\TJ-nengtan")
OUTPUT_DARK = ROOT_DIR / "产品原型" / "lib" / "docs-data.ts"
OUTPUT_LIGHT = ROOT_DIR / "产品原型-旧" / "产品原型" / "lib" / "docs-data.ts"

sys.path.append(str(ROOT_DIR / "scripts"))
from build_docs_manifest import load_manuals, load_prd_docs, load_data_dictionary, load_review_matrix
from specs_zero_carbon import ZERO_CARBON_SPECS
from specs_zero_carbon_part2 import ZERO_CARBON_SPECS_PART2
from specs_carbon_footprint import CARBON_FOOTPRINT_SPECS

print(f"Loaded ZERO_CARBON_SPECS: {len(ZERO_CARBON_SPECS)} items")
print(f"Loaded ZERO_CARBON_SPECS_PART2: {len(ZERO_CARBON_SPECS_PART2)} items")
print(f"Loaded CARBON_FOOTPRINT_SPECS: {len(CARBON_FOOTPRINT_SPECS)} items")

ALL_SPECS_RAW = ZERO_CARBON_SPECS + ZERO_CARBON_SPECS_PART2 + CARBON_FOOTPRINT_SPECS
print(f"Total raw specs: {len(ALL_SPECS_RAW)} items")

# 标准化转换与填充字段，保证向后兼容性
FINAL_MODULE_SPECS = []
for spec in ALL_SPECS_RAW:
    s = dict(spec)
    # 填充向后兼容的 role guide 字符串
    if "roleGuide" in s:
        rg = s["roleGuide"]
        if "frontendSpecs" not in s or not s["frontendSpecs"]:
            s["frontendSpecs"] = rg.get("fe", "")
        if "backendSpecs" not in s or not s["backendSpecs"]:
            s["backendSpecs"] = rg.get("be", "")
        if "qaTestSpecs" not in s or not s["qaTestSpecs"]:
            s["qaTestSpecs"] = rg.get("qa", "")
    else:
        s.setdefault("frontendSpecs", "")
        s.setdefault("backendSpecs", "")
        s.setdefault("qaTestSpecs", "")

    s.setdefault("parameters", [])
    s.setdefault("calcFormulas", [])
    s.setdefault("dataSources", [])
    FINAL_MODULE_SPECS.append(s)

# 全量 37 节点系统功能导航树 (1对1 精确对应 37 个页面规格)
SYSTEM_FUNCTIONAL_TREE = [
    {
        "centerKey": "zero-carbon",
        "centerName": "零碳园区集控中心",
        "groups": [
            {
                "title": "集控中心大屏",
                "icon": "LayoutDashboard",
                "children": [
                    {
                        "title": "全景环幕大屏",
                        "href": "/zero-carbon/screen",
                        "specId": "spec-screen-panoramic"
                    },
                    {
                        "title": "综合集控大屏 (16:9)",
                        "href": "/screen/control-center",
                        "specId": "spec-screen-control-center"
                    }
                ]
            },
            {
                "title": "集中监管",
                "icon": "MonitorCog",
                "children": [
                    {
                        "title": "指标管控",
                        "href": "/zero-carbon/monitor/indicator",
                        "specId": "spec-monitor-indicator"
                    },
                    {
                        "title": "用能在线监测",
                        "href": "/zero-carbon/monitor/online/usage",
                        "specId": "spec-monitor-usage"
                    },
                    {
                        "title": "工业微电网监测",
                        "href": "/zero-carbon/monitor/online/microgrid",
                        "specId": "spec-monitor-microgrid"
                    },
                    {
                        "title": "能源碳排放监测",
                        "href": "/zero-carbon/monitor/carbon-emission",
                        "specId": "spec-monitor-carbon-emission"
                    }
                ]
            },
            {
                "title": "能耗能效分析",
                "icon": "Gauge",
                "children": [
                    {
                        "title": "用能结构分析",
                        "href": "/zero-carbon/energy/structure",
                        "specId": "spec-energy-structure"
                    },
                    {
                        "title": "能源成本分析",
                        "href": "/zero-carbon/energy/cost",
                        "specId": "spec-energy-cost"
                    },
                    {
                        "title": "单位产品能耗",
                        "href": "/zero-carbon/energy/unit-product",
                        "specId": "spec-energy-unit-product"
                    },
                    {
                        "title": "单位产值能耗",
                        "href": "/zero-carbon/energy/unit-output",
                        "specId": "spec-energy-unit-output"
                    },
                    {
                        "title": "对标管理",
                        "href": "/zero-carbon/energy/benchmark",
                        "specId": "spec-energy-benchmark"
                    }
                ]
            },
            {
                "title": "零碳项目评估",
                "icon": "ClipboardCheck",
                "children": [
                    {
                        "title": "项目档案管理",
                        "href": "/zero-carbon/project/archive",
                        "specId": "spec-project-archive"
                    },
                    {
                        "title": "实时监控",
                        "href": "/zero-carbon/project/monitoring",
                        "specId": "spec-project-monitoring"
                    },
                    {
                        "title": "项目运行评估",
                        "href": "/zero-carbon/project/benefit",
                        "specId": "spec-project-benefit"
                    },
                    {
                        "title": "零碳工厂自评估",
                        "href": "/zero-carbon/project/self",
                        "specId": "spec-project-self"
                    }
                ]
            },
            {
                "title": "统计报表",
                "icon": "FileBarChart",
                "children": [
                    {
                        "title": "用能报表",
                        "href": "/zero-carbon/reports/usage",
                        "specId": "spec-reports-usage"
                    },
                    {
                        "title": "成本报表",
                        "href": "/zero-carbon/reports/cost",
                        "specId": "spec-reports-cost"
                    },
                    {
                        "title": "单耗报表",
                        "href": "/zero-carbon/reports/unit",
                        "specId": "spec-reports-unit"
                    }
                ]
            },
            {
                "title": "基础管理",
                "icon": "Settings2",
                "children": [
                    {
                        "title": "数据录入",
                        "href": "/zero-carbon/config/entry",
                        "specId": "spec-config-entry"
                    },
                    {
                        "title": "组件规范库",
                        "href": "/design-system",
                        "specId": "spec-design-system"
                    }
                ]
            }
        ]
    },
    {
        "centerKey": "carbon-footprint",
        "centerName": "产品碳足迹集采中心",
        "groups": [
            {
                "title": "对外示范窗口",
                "icon": "LayoutDashboard",
                "children": [
                    {
                        "title": "集团驾驶舱",
                        "href": "/carbon-footprint/cockpit",
                        "specId": "spec-footprint-dashboard"
                    }
                ]
            },
            {
                "title": "多维分析",
                "icon": "BarChart3",
                "children": [
                    {
                        "title": "横向对比",
                        "href": "/carbon-footprint/analysis/compare",
                        "specId": "spec-footprint-compare-horizontal"
                    },
                    {
                        "title": "纵向对比与总览",
                        "href": "/carbon-footprint/analysis/ranking",
                        "specId": "spec-footprint-compare-vertical"
                    }
                ]
            },
            {
                "title": "实景数据库",
                "icon": "Database",
                "children": [
                    {
                        "title": "实景数据库",
                        "href": "/carbon-footprint/database/realscene",
                        "specId": "spec-footprint-realscene"
                    },
                    {
                        "title": "碳足迹核算",
                        "href": "/carbon-footprint/database/accounting",
                        "specId": "spec-footprint-calc"
                    },
                    {
                        "title": "碳足迹报告",
                        "href": "/carbon-footprint/database/report",
                        "specId": "spec-footprint-report"
                    }
                ]
            },
            {
                "title": "CBAM管理",
                "icon": "ShieldCheck",
                "children": [
                    {
                        "title": "合规管理",
                        "href": "/carbon-footprint/cbam/compliance",
                        "specId": "spec-footprint-cbam-compliance"
                    },
                    {
                        "title": "申报模拟",
                        "href": "/carbon-footprint/cbam/declaration",
                        "specId": "spec-footprint-cbam-declare"
                    },
                    {
                        "title": "知识库",
                        "href": "/carbon-footprint/cbam/knowledge",
                        "specId": "spec-footprint-cbam-kb"
                    }
                ]
            },
            {
                "title": "第三方认证管理",
                "icon": "BadgeCheck",
                "children": [
                    {
                        "title": "认证资料维护",
                        "href": "/carbon-footprint/certification/material",
                        "specId": "spec-footprint-cert-material"
                    },
                    {
                        "title": "认证申请",
                        "href": "/carbon-footprint/certification/apply",
                        "specId": "spec-footprint-cert-apply"
                    },
                    {
                        "title": "认证结果管理",
                        "href": "/carbon-footprint/certification/result",
                        "specId": "spec-footprint-cert-result"
                    }
                ]
            },
            {
                "title": "因子库管理",
                "icon": "Boxes",
                "children": [
                    {
                        "title": "原材料碳排因子",
                        "href": "/carbon-footprint/factor/material",
                        "specId": "spec-footprint-factor-material"
                    },
                    {
                        "title": "电力碳排因子",
                        "href": "/carbon-footprint/factor/power",
                        "specId": "spec-footprint-factor-grid"
                    },
                    {
                        "title": "能源活动碳排因子",
                        "href": "/carbon-footprint/factor/energy",
                        "specId": "spec-footprint-factor-fuel"
                    },
                    {
                        "title": "折标煤系数库",
                        "href": "/carbon-footprint/factor/coal",
                        "specId": "spec-footprint-factor-coal"
                    }
                ]
            }
        ]
    }
]

print("Assembling docs manifest...")
manual_docs = load_manuals()
prd_docs = load_prd_docs()
data_dict = load_data_dictionary()
review_matrix = load_review_matrix()

print(f"Loaded manuals: {len(manual_docs)}")
print(f"Loaded PRD docs: {len(prd_docs)}")
print(f"Loaded final page module specs: {len(FINAL_MODULE_SPECS)}")

# 组装 TypeScript 文件
ts_content = f"""/* eslint-disable */
// @ts-nocheck
/**
 * 特变电工能碳数字化双中心 · Web 开发文档与技术评审中心统一数据仓库
 * 自动生成于构建期，提供 38 篇开发手册、PRD 规格、全量 37 页面高深度技术规格(模块/参数/数据来源/计算模型/DTO/FE/BE/QA)、数据字典与在线评审工作台数据。
 */

export interface DocHeading {{
  level: number;
  title: string;
  id: string;
}}

export interface ManualDoc {{
  id: string;
  no: number;
  filename: string;
  title: string;
  category: string;
  readTime: string;
  wordCount: number;
  summary: string;
  headings: DocHeading[];
  content: string;
}}

export interface PrdDoc {{
  id: string;
  vol: string;
  filename: string;
  title: string;
  readTime: string;
  wordCount: number;
  summary: string;
  headings: DocHeading[];
  content: string;
}}

export interface DataSourceItem {{
  medium: string;
  sourceType: string;
  protocol: string;
  device: string;
  tagExample: string;
  frequency: string;
  securityLevel?: string;
}}

export interface ParameterItem {{
  paramCode: string;
  paramName: string;
  category: string; // '入参过滤' | '核心指标' | '业务明细' | '衍生计算'
  dataType: string;
  unit: string;
  required: boolean;
  source: string;
  rangeOrEnum: string;
  description: string;
}}

export interface CalcFormulaVariable {{
  name: string;
  desc: string;
  unit: string;
}}

export interface CalcFormulaItem {{
  formulaName: string;
  mathExpression: string;
  variables: CalcFormulaVariable[];
  logicDescription: string;
  boundaryRule?: string;
}}

export interface RoleGuide {{
  fe: string;
  be: string;
  qa: string;
}}

export interface PageModuleSpec {{
  id: string;
  center: string;
  navGroup: string;
  pageName: string;
  route: string;
  component: string;
  overview: string;
  subModules: {{ name: string; desc: string }}[];
  parameters?: ParameterItem[];
  dataSources: DataSourceItem[];
  calcFormulas?: CalcFormulaItem[];
  calculationLogic: string;
  dtoSchema: string;
  roleGuide?: RoleGuide;
  frontendSpecs: string;
  backendSpecs: string;
  qaTestSpecs: string;
}}

export interface CheckItem {{
  id: string;
  item: string;
  mandatory: boolean;
}}

export interface RoleReviewSpec {{
  role: string;
  icon: string;
  checkItems: CheckItem[];
}}

export interface DwdTableField {{
  name: string;
  type: string;
  nullable: boolean;
  comment: string;
}}

export interface DwdTable {{
  tableName: string;
  tableComment: string;
  storageEngine: string;
  fields: DwdTableField[];
}}

export interface ScadaTagItem {{
  tag: string;
  name: string;
  medium: string;
  unit: string;
  range: string;
  freq: string;
  level: string;
}}

export interface ErpMappingItem {{
  targetField: string;
  sourceSystem: string;
  sourceTable: string;
  sourceField: string;
  rule: string;
}}

export interface SecurityLevelItem {{
  level: string;
  scope: string;
  storage: string;
  transmission: string;
}}

export interface NavLeafNode {{
  title: string;
  href: string;
  specId: string;
}}

export interface NavGroupNode {{
  title: string;
  icon: string;
  children: NavLeafNode[];
}}

export interface CenterNavTree {{
  centerKey: 'zero-carbon' | 'carbon-footprint';
  centerName: string;
  groups: NavGroupNode[];
}}

/* 1. 38 篇开发手册清单 */
export const MANUAL_DOCS: ManualDoc[] = {json.dumps(manual_docs, ensure_ascii=False, indent=2)};

/* 2. 3 卷 PRD 需求规格说明书清单 */
export const PRD_DOCS: PrdDoc[] = {json.dumps(prd_docs, ensure_ascii=False, indent=2)};

/* 3. 全量 37 页面高深度技术规格清单 (含模块/参数/数据源/计算模型/DTO/角色落地) */
export const PAGE_MODULE_SPECS: PageModuleSpec[] = {json.dumps(FINAL_MODULE_SPECS, ensure_ascii=False, indent=2)};

/* 4. 8 大角色在线评审检查矩阵 */
export const ROLE_REVIEW_SPECS: RoleReviewSpec[] = {json.dumps(review_matrix, ensure_ascii=False, indent=2)};
export const REVIEW_MATRIX: RoleReviewSpec[] = ROLE_REVIEW_SPECS;

/* 5. 核心数仓与数据字典 */
export const DWD_TABLES: DwdTable[] = {json.dumps(data_dict["dwdTables"], ensure_ascii=False, indent=2)};

export const SCADA_TAG_ITEMS: ScadaTagItem[] = {json.dumps(data_dict["scadaTags"], ensure_ascii=False, indent=2)};

export const ERP_MAPPING_ITEMS: ErpMappingItem[] = {json.dumps(data_dict["erpMesMappings"], ensure_ascii=False, indent=2)};

export const SECURITY_LEVEL_ITEMS: SecurityLevelItem[] = {json.dumps(data_dict["securityLevels"], ensure_ascii=False, indent=2)};

export const DATA_DICTIONARY = {{
  dwdTables: DWD_TABLES,
  scadaTags: SCADA_TAG_ITEMS,
  erpMesMappings: ERP_MAPPING_ITEMS,
  securityLevels: SECURITY_LEVEL_ITEMS,
}};

/* 6. 系统全功能页面导航拓扑树 (37 节点 1对1 映射深度规格) */
export const SYSTEM_FUNCTIONAL_TREE: CenterNavTree[] = {json.dumps(SYSTEM_FUNCTIONAL_TREE, ensure_ascii=False, indent=2)};
"""

print(f"Writing to Dark Theme output: {OUTPUT_DARK}")
OUTPUT_DARK.write_text(ts_content, encoding='utf-8')
print(f"Dark Theme output size: {len(ts_content)} bytes")

print(f"Writing to Light Theme output: {OUTPUT_LIGHT}")
OUTPUT_LIGHT.write_text(ts_content, encoding='utf-8')
print(f"Light Theme output size: {len(ts_content)} bytes")

print("Successfully generated lib/docs-data.ts for both workspaces!")

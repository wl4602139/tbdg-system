#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · 全量 37 页面模块、参数、数据来源与计算方式生成引擎
覆盖 37 个页面：
- 模块：页面定位与详细子模块划分
- 参数：输入参数、核心指标参数、明细字段（代码、中文名、分类、类型、单位、必填、来源、取值范围、说明）
- 数据来源：真实 SCADA 测点 Tag、通讯规约、现场设备、采集频次、商密分级
- 计算方式：结构化数学公式 (LaTeX 表达式)、变量释义、核算逻辑与边界防伪容错
- 接口契约：TypeScript DTO Schema
- FE/BE/QA 专业落地要点与测试用例
"""

import os
import json
import re
from pathlib import Path

ROOT_DIR = Path(r"D:\Project\TJ-nengtan")
MANUALS_DIR = ROOT_DIR / "开发手册"
PRD_DIR = ROOT_DIR / "PRD"
OUTPUT_DARK = ROOT_DIR / "产品原型" / "lib" / "docs-data.ts"
OUTPUT_LIGHT = ROOT_DIR / "产品原型-旧" / "产品原型" / "lib" / "docs-data.ts"

from build_docs_manifest import load_manuals, load_prd_docs, load_data_dictionary, load_review_matrix

def get_system_functional_tree():
    return [
        {
            "centerKey": "zero-carbon",
            "centerName": "零碳园区集控中心",
            "groups": [
                {
                    "title": "集控中心大屏",
                    "icon": "LayoutDashboard",
                    "children": [
                        {"title": "全景环幕大屏", "href": "/zero-carbon/screen", "specId": "spec-screen-panoramic"},
                        {"title": "综合集控大屏 (16:9)", "href": "/screen/control-center", "specId": "spec-screen-control-center"}
                    ]
                },
                {
                    "title": "集中监管",
                    "icon": "MonitorCog",
                    "children": [
                        {"title": "指标管控", "href": "/zero-carbon/monitor/indicator", "specId": "spec-monitor-indicator"},
                        {"title": "用能在线监测", "href": "/zero-carbon/monitor/online/usage", "specId": "spec-monitor-usage"},
                        {"title": "工业微电网监测", "href": "/zero-carbon/monitor/online/microgrid", "specId": "spec-monitor-microgrid"},
                        {"title": "能源碳排放监测", "href": "/zero-carbon/monitor/carbon-emission", "specId": "spec-monitor-carbon-emission"}
                    ]
                },
                {
                    "title": "能耗能效分析",
                    "icon": "Gauge",
                    "children": [
                        {"title": "用能结构分析", "href": "/zero-carbon/energy/structure", "specId": "spec-energy-structure"},
                        {"title": "能源成本分析", "href": "/zero-carbon/energy/cost", "specId": "spec-energy-cost"},
                        {"title": "单位产品能耗", "href": "/zero-carbon/energy/unit-product", "specId": "spec-energy-unit-product"},
                        {"title": "单位产值能耗", "href": "/zero-carbon/energy/unit-output", "specId": "spec-energy-unit-output"},
                        {"title": "对标管理", "href": "/zero-carbon/energy/benchmark", "specId": "spec-energy-benchmark"}
                    ]
                },
                {
                    "title": "零碳项目评估",
                    "icon": "ClipboardCheck",
                    "children": [
                        {"title": "项目档案管理", "href": "/zero-carbon/project/archive", "specId": "spec-project-archive"},
                        {"title": "实时监控", "href": "/zero-carbon/project/monitoring", "specId": "spec-project-monitoring"},
                        {"title": "项目运行评估", "href": "/zero-carbon/project/benefit", "specId": "spec-project-benefit"},
                        {"title": "零碳工厂自评估", "href": "/zero-carbon/project/self", "specId": "spec-project-self"}
                    ]
                },
                {
                    "title": "统计报表",
                    "icon": "FileBarChart",
                    "children": [
                        {"title": "用能报表", "href": "/zero-carbon/reports/usage", "specId": "spec-reports-usage"},
                        {"title": "成本报表", "href": "/zero-carbon/reports/cost", "specId": "spec-reports-cost"},
                        {"title": "单耗报表", "href": "/zero-carbon/reports/unit", "specId": "spec-reports-unit"}
                    ]
                },
                {
                    "title": "基础管理",
                    "icon": "Settings2",
                    "children": [
                        {"title": "数据录入", "href": "/zero-carbon/config/entry", "specId": "spec-config-entry"},
                        {"title": "组件规范库", "href": "/design-system", "specId": "spec-design-system"},
                        {"title": "开发与评审中心", "href": "/docs", "specId": "spec-docs-portal"}
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
                        {"title": "集团驾驶舱", "href": "/carbon-footprint/cockpit", "specId": "spec-footprint-cockpit"}
                    ]
                },
                {
                    "title": "多维分析",
                    "icon": "BarChart3",
                    "children": [
                        {"title": "横向对比", "href": "/carbon-footprint/analysis/compare", "specId": "spec-footprint-analysis-compare"},
                        {"title": "纵向对比与总览", "href": "/carbon-footprint/analysis/ranking", "specId": "spec-footprint-analysis-ranking"}
                    ]
                },
                {
                    "title": "实景数据库",
                    "icon": "Database",
                    "children": [
                        {"title": "实景数据库", "href": "/carbon-footprint/database/realscene", "specId": "spec-footprint-database-realscene"},
                        {"title": "碳足迹核算", "href": "/carbon-footprint/database/accounting", "specId": "spec-footprint-database-accounting"},
                        {"title": "碳足迹报告", "href": "/carbon-footprint/database/report", "specId": "spec-footprint-database-report"}
                    ]
                },
                {
                    "title": "CBAM管理",
                    "icon": "ShieldCheck",
                    "children": [
                        {"title": "合规管理", "href": "/carbon-footprint/cbam/compliance", "specId": "spec-footprint-cbam-compliance"},
                        {"title": "申报模拟", "href": "/carbon-footprint/cbam/declaration", "specId": "spec-footprint-cbam-declaration"},
                        {"title": "知识库", "href": "/carbon-footprint/cbam/knowledge", "specId": "spec-footprint-cbam-knowledge"}
                    ]
                },
                {
                    "title": "第三方认证管理",
                    "icon": "BadgeCheck",
                    "children": [
                        {"title": "认证资料维护", "href": "/carbon-footprint/certification/material", "specId": "spec-footprint-cert-material"},
                        {"title": "认证申请", "href": "/carbon-footprint/certification/apply", "specId": "spec-footprint-cert-apply"},
                        {"title": "认证结果管理", "href": "/carbon-footprint/certification/result", "specId": "spec-footprint-cert-result"}
                    ]
                },
                {
                    "title": "因子库管理",
                    "icon": "Boxes",
                    "children": [
                        {"title": "原材料碳排因子", "href": "/carbon-footprint/factor/material", "specId": "spec-footprint-factor-material"},
                        {"title": "电力碳排因子", "href": "/carbon-footprint/factor/power", "specId": "spec-footprint-factor-power"},
                        {"title": "能源活动碳排因子", "href": "/carbon-footprint/factor/energy", "specId": "spec-footprint-factor-energy"},
                        {"title": "折标煤系数库", "href": "/carbon-footprint/factor/coal", "specId": "spec-footprint-factor-coal"}
                    ]
                }
            ]
        }
    ]


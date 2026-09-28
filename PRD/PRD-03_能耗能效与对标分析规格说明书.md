# 【PRD-03】能耗能效与对标分析规格说明书

> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-03`  
> **标准 NAV-ID**：`NAV-ZC-ENG-STR`、`NAV-ZC-ENG-CST`、`NAV-ZC-ENG-BEN`、`NAV-ZC-ENG-PROD`、`NAV-ZC-ENG-VAL`  
> **基线版本**：Release v1.2.0 (生产基线版)  

---

## 一、 用能结构与能源成本分析

1. **多能互补桑基图**：直观展示市电、绿电、天然气、外购蒸汽、柴油从购入到转换、分配至各车间与工序的流向；
2. **分时用电成本优化 (TOU)**：以尖（#FF6536）、峰（#FFBA00）、平（#2C7CFF）、谷（#10C4CE）标准四色呈现负荷分布，自动识别高价时段不合理负荷并输出移峰填谷优化建议。

---

## 二、 单位产品能耗与产值单耗核算模型

$$E_{unit\_product} = \frac{\sum E_{process\_total}}{Q_{qualified}}$$

$$E_{unit\_output} = \frac{\sum E_{total\_tce}}{OutputValue_{million\_yuan}}$$

- **量纲隔离原则**：变压器以 $\text{tce/kVA}$ 或 $\text{kWh/kVA}$ 核算；线缆以 $\text{tce/km}$ 或 $\text{kWh/km}$ 核算；万元产值以 $\text{tce/万元}$ 核算，两类产品单耗绝不混编在同一统计列中。
- **自身时序对标**：仅与自身历史同期（同比）或上一周期（环比）对比，或与国家行业先进值/准入值基准线对比，严禁捏造跨厂横向主观评语。\n
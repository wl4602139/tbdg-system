# 【PRD-08】CBAM 欧盟碳关税与合规申报规格说明书

> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-08`  
> **标准 NAV-ID**：`NAV-CF-CBM-DEC`、`NAV-CF-CBM-SIM`、`NAV-CF-CBM-KB`  
> **基线版本**：Release v1.2.0 (生产基线版)  

---

## 一、 CN 海关税号映射与前驱物核算

系统内嵌欧盟 CBAM 法规（EU 2023/956）要求：
- 覆盖税号：8504.21~8504.34（变压器）、8544.49~8544.60（高压线缆）及 72/73 钢铁零部件；
- 穿透拆解：前驱物硅钢片、电解铜的直接排放 (Scope 1) 与外购电力间接排放 (Scope 2)。

---

## 二、 关税测算模型与央行汇率联动

$$\text{Tax}_{CBAM} = \max\left(0, (SEE_{total} - BM_{EU}) \times Q_{export} - \text{CarbonPricePaid}_{CN}\right) \times \text{Price}_{ETS}$$

- 欧盟 ETS 碳价周均结算价自动通过中国人民银行官方欧元中间价汇率折算为人民币。

---

## 三、 CBAM XML 导出与数据出境安全合规

1. **XML 模板**：符合欧盟委员会 Communication Template v2.1 标准 XSD 结构；
2. **数据出境合规**：经脱敏处理（剔除操作人员工号、电话），通过国家网信办认定的【标准合同 (SCC) 路径】合法出境，操作链保留 SHA-256 签名归档 10 年。\n
# 【PRD-11】量化非功能需求与接口契约说明书

> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-11`  
> **基线版本**：Release v1.2.0 (生产基线版)  

---

## 一、 量化非功能性需求基准 (NFR Targets)

1. **数据规模与吞吐**：支撑 50,000 点位并发接入，采样周期 1s/5s，峰值写入 TPS $\ge 10,000$ 点/秒；
2. **界面渲染性能**：LCP < 1.8s、INP < 100ms、CLS < 0.05、FCP < 0.8s；
3. **复杂计算时限**：单 SKU LCA 计算 < 5s；双语报告导出 < 15s；CBAM 关税计算 < 3s；
4. **报表流式导出**：100,000 行复杂带样式 Excel 导出时限 $\le 30\text{ s}$；
5. **系统可用性保证**：平台整体可用性 $	ext{SLO} \ge 99.9\%$；RTO $\le 30\text{ min}$，RPO $\le 5\text{ min}$；
6. **因子库匹配度**：原材料 BOM 自动匹配权威因子命中率 $\ge 95\%$。

---

## 二、 核心 OpenAPI 3.0.3 接口契约规范

```yaml
openapi: 3.0.3
info:
  title: 特变电工双中心核心集成 API
  version: 1.2.0
paths:
  /api/v1/lca/reports/calculate:
    post:
      summary: 执行单型号产品生命周期 LCA 五阶段滚算
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [sku_id, bom_id, factor_version]
              properties:
                sku_id: { type: string, example: "SKU-TB-500KV-01" }
                bom_id: { type: string, example: "BOM-2026-09-001" }
                factor_version: { type: string, example: "v2026.1" }
      responses:
        '200':
          description: 计算成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  total_co2e: { type: number, example: 45280.50 }
                  stages:
                    type: object
                    properties:
                      raw_material: { type: number }
                      transport: { type: number }
                      manufacturing: { type: number }
                      testing: { type: number }
                      packaging: { type: number }
                  hash_signature: { type: string, example: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
```\n
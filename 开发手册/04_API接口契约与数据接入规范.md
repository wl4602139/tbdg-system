# 🔌 API 接口契约与数据接入规范

## 1. 边缘数据上送协议与安全签名 (Edge Gateway Ingestion)

### 1.1 请求 Header 鉴权规范
各分厂网关上送数据时必须在 HTTP Header 中携带 HMAC-SHA256 签名：
* `X-Plant-AppKey`：分厂唯一接入 AppKey（如 `PLANT_SHENBIAN_01`）
* `X-Timestamp`：当前 Unix 毫秒时间戳（有效时间窗 $\pm 5$ 分钟）
* `X-Nonce`：16位随机字符串（防重放攻击）
* `X-Signature`：`HMAC_SHA256(AppSecret, Method + URI + Timestamp + Nonce + BodyHash)`

### 1.2 边缘测点批量上送接口
* **Endpoint**: `POST /api/v1/telemetry/ingest`
* **Content-Type**: `application/json`

```json
{
  "plantCode": "SB-001",
  "gatewayId": "GW-DRY-01",
  "batchTimestamp": 1787572800000,
  "metrics": [
    {
      "meterCode": "MTR-POWER-001",
      "processCode": "TRANS_HIGH_DRY",
      "energyType": "POWER",
      "values": {
        "activePowerKw": 450.2,
        "reactivePowerKvar": 68.5,
        "voltageV": 380.1,
        "currentA": 684.2,
        "powerFactor": 0.98,
        "totalActiveKwh": 128490.5
      }
    },
    {
      "meterCode": "MTR-STEAM-002",
      "processCode": "TRANS_HIGH_DRY",
      "energyType": "STEAM",
      "values": {
        "instantFlowTh": 12.8,
        "accumulatedFlowT": 3480.2,
        "pressureMpa": 0.85
      }
    }
  ]
}
```

---

## 2. 前端查询核心 API 契约 (OpenAPI 3.0)

### 2.1 集中监管 - 65 项指标卡片与同环比查询
* **Endpoint**: `GET /api/v1/zero-carbon/indicators/list`
* **Query Params**:
  * `orgUnitId` (long): 工厂/单位 ID
  * `period` (string): 周期标签（如 `2026-08`）
  * `category` (string, optional): 指标大类筛选
* **Response**:
```json
{
  "code": "SUCCESS",
  "message": "查询成功",
  "data": {
    "summary": {
      "totalIndicators": 65,
      "excellentCount": 42,
      "normalCount": 18,
      "alertCount": 5
    },
    "indicators": [
      {
        "indicatorId": 12,
        "indicatorCode": "UNIT_PRODUCT_ENERGY_MODEL",
        "indicatorName": "单位产品能耗（型号）",
        "category": "单位产品能耗",
        "unit": "tce/万kVA",
        "currentValue": 1.45,
        "benchmarkValue": 1.30,
        "standardValue": 1.20,
        "yoyDelta": 0.15,
        "yoyRate": 11.54,
        "momDelta": -0.02,
        "momRate": -1.36,
        "status": "ALERT",
        "formula": "综合能源消费量(tce) / 产品产量(万kVA)",
        "dataSource": "订单关键工序计量+非关键工序分摊",
        "aiReasoning": "该型号产品本月在干燥工序耗用蒸汽异常偏高 18%，建议排查 2 号干燥罐温控阀门密封性。"
      }
    ]
  }
}
```

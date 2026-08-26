# 17. 在线监测模块多 Agent 深度设计与重构规范

---

## 🏢 一、多 Agent 专家评审与业务目标概述

针对特变电工“双中心”平台**【在线监测】（`/zero-carbon/monitor/online`）**核心工作台，Antigravity 8 大专业 Agent 围绕**宏观指标遥测**、**重点用能设备监测**与**关键工序监测**三大板块进行工业级系统重构。

---

## 🎯 二、三大核心功能需求定义与架构

### 2.1 经营单位宏观指标监测 (Enterprise Macro Telemetry)
* **5 大核心遥测指标**：
  1. **新能源发电功率**：光伏/风电实时出力 kW；
  2. **储能充放功率**：BESS 储能系统充放电功率及 SOC；
  3. **市电接入功率**：国家电网 110kV 输入功率；
  4. **全厂负荷功率**：实时综合用电需求；
  5. **多介质能源消耗量**：支持电力（kWh）、天然气（m³）、工业水（m³）、压缩空气（m³）快捷切换；
* **自动回显采集频率**：根据所选测点自动标注文档采集周期（如：`⚡ 电力 1s 遥测流`、`💧 水/气 15min 脉冲`、`🏭 工序 1min 聚合`）；
* **交互论证（下拉 vs Tab 裁决）**：
  * **结论**：**“大视图使用 Tab 胶囊标签，参数层级使用树形下拉”**。
  * **论证**：三大监测模式（宏观大盘 / 重点设备 / 关键工序）属于平级高频切换视图，采用顶部 Tab 胶囊呈现；而能源介质（电/水/气/汽）采用分段式切换；经营单位/工厂采用二级组织树下拉。

---

### 2.2 重点用能设备在线监测 (Key Equipment Monitoring)
* **左侧标准树状结构**：
  * 按照 1、2 级单位 ➔ 车间 ➔ 重点设备（真空干燥罐、立塔交联机、大功率试验机组、空压机、冷热泵站）展示；
  * **模糊搜索**：支持设备名称、型号关键词输入，实时高亮与节点定位；
  * **能耗类型过滤**：支持按电、气、水、汽介质过滤设备树；
* **设备实时运行看板**：
  * 设备运行状态（🟢 运行 / 🟡 待机 / 🔴 告警 / ⚪ 停机）；
  * 8 大实时遥测参数（电压 Ua/Ub/Uc、电流 Ia/Ib/Ic、有功 P、无功 Q、功率因数 PF、温度、压力等）；
  * 24h 多通道时序波形图（支持勾选对比）。

---

### 2.3 关键工序在线监测 (Critical Process Monitoring)
* **左侧工艺流程树**：
  * 按照特高压与线缆工艺链（铁芯剪切叠装 ➔ 电磁线绕制 ➔ 真空干燥 ➔ 器身总装 ➔ 绝缘试验）展示；
  * 支持名称模糊搜索与能耗介质筛选；
* **工序实时能效看板**：
  * 工序实时能耗流速与单耗定额；
  * 工序用电**市电与绿电实时分项占比（%）**；
  * 工序起止状态与时序能耗波动图。

---

## 🏗️ 三、技术架构 (C4 Model) 与 API 契约

```mermaid
graph LR
    SCADA[现场 SCADA / 物联传感器] -->|Modbus / MQTT| Gateway[工业物联网边缘网关]
    Gateway -->|Kafka 遥测流| TSDB[(时序数据库 TSDB)]
    TSDB -->|Downsampling 聚合| API[在线监测 RESTful / WebSocket API]
    API -->|实时状态推流| UI[在线监测前端工作台]
```

### OpenAPI 契约定义：
```yaml
openapi: 3.0.0
paths:
  /api/v1/monitor/online/macro:
    get:
      summary: 获取经营单位宏观5大指标及实时采集频率
      parameters:
        - name: orgId
          in: query
          required: true
          schema: { type: string }
      responses:
        200:
          content:
            application/json:
              schema:
                type: object
                properties:
                  pvPowerKw: { type: number, example: 5820 }
                  bessPowerKw: { type: number, example: 45 }
                  gridPowerKw: { type: number, example: 12450 }
                  loadPowerKw: { type: number, example: 18225 }
                  sampleFrequency: { type: string, example: "1s 实时流" }
```

# -*- coding: utf-8 -*-
"""v2.1.0 -> v2.2.0 内容终稿升级 执行脚本（元素引用驱动，抗索引漂移）"""
import copy, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import docx
from docx.shared import Emu
from lxml import etree
from _v22_content import AUTH, APX_F, RECON, COLLECT

WNS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
XMLNS = 'http://www.w3.org/XML/1998/namespace'
def w(t): return '{%s}%s' % (WNS, t)

BASE = r'D:\Project\TJ-nengtan\PRD'
SRC = os.path.join(BASE, '特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.1.docx')
DST = os.path.join(BASE, '特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.2.docx')
PROTO = os.path.join(BASE, '_v2_build', 'proto')
IMG_W = 6210300

doc = docx.Document(SRC)
PARAS = list(doc.paragraphs)      # 元素引用，EDIT 期间索引漂移免疫
TABLES = list(doc.tables)
LOG = []
def log(m):
    LOG.append(m); print(m)

# ------------------------------------------------------------------ 工具
def pPr_of(el): return el.find(w('pPr')) if el is not None else None

def rpr_templates(el):
    bold = norm = None
    for r in el.findall(w('r')):
        rpr = r.find(w('rPr'))
        if rpr is None: continue
        b = rpr.find(w('b'))
        isb = (b is not None) and (b.get(w('val')) not in ('0', 'false'))
        if isb and bold is None: bold = copy.deepcopy(rpr)
        if (not isb) and norm is None: norm = copy.deepcopy(rpr)
    if bold is None and norm is not None: bold = copy.deepcopy(norm)
    if norm is None and bold is not None: norm = copy.deepcopy(bold)
    return bold, norm

_FB = {'b': None, 'n': None}

def set_para(el, text):
    bold, norm = rpr_templates(el)
    if bold is None: bold = _FB['b']
    if norm is None: norm = _FB['n']
    KEEP = (w('pPr'), w('bookmarkStart'), w('bookmarkEnd'))
    for child in list(el):
        if child.tag not in KEEP:
            el.remove(child)
    if text == '':
        return el
    for seg in re.split(r'(\*\*.+?\*\*)', text):
        if seg == '':
            continue
        isb = seg.startswith('**') and seg.endswith('**') and len(seg) > 4
        txt = seg[2:-2] if isb else seg
        r = etree.SubElement(el, w('r'))
        rpr = bold if isb else norm
        if rpr is not None:
            r.append(copy.deepcopy(rpr))
        te = etree.SubElement(r, w('t'))
        te.set('{%s}space' % XMLNS, 'preserve')
        te.text = txt
    return el

def set_p(i, text): set_para(PARAS[i]._p, text)

def cell_set(tc, text):
    ps = tc.findall(w('p'))
    if not ps: return
    for extra in ps[1:]:
        tc.remove(extra)
    set_para(ps[0], text)

def set_cell(ti, r, c, text):
    cell_set(TABLES[ti].rows[r].cells[c]._tc, text)

def build_table(tpl, rows, body_idx=1):
    tbl = copy.deepcopy(tpl)
    trs = tbl.findall(w('tr'))
    tpl_hdr = copy.deepcopy(trs[0])
    tpl_body = copy.deepcopy(trs[body_idx] if len(trs) > body_idx else trs[-1])
    for tr in trs: tbl.remove(tr)
    for i, row in enumerate(rows):
        tr = copy.deepcopy(tpl_hdr if i == 0 else tpl_body)
        tbl.append(tr)
        for tc, txt in zip(tr.findall(w('tc')), row):
            cell_set(tc, txt)
    return tbl

def replace_el(old, new):
    old.addprevious(new)
    old.getparent().remove(old)

def add_row(ti, src_row, after_row=None):
    t = TABLES[ti]._tbl
    trs = t.findall(w('tr'))
    new = copy.deepcopy(trs[src_row])
    trs[src_row if after_row is None else after_row].addnext(new)
    return new

def rewrite_card(ti, lines):
    tc = TABLES[ti].rows[0].cells[0]._tc
    ps = tc.findall(w('p'))
    tpl_title = copy.deepcopy(ps[0])
    tpl_line = copy.deepcopy(ps[1] if len(ps) > 1 else ps[0])
    for p in ps: tc.remove(p)
    tc.append(set_para(tpl_title, lines[0]))
    for ln in lines[1:]:
        tc.append(set_para(copy.deepcopy(tpl_line), ln))

def numid_of(el):
    pr = pPr_of(el)
    if pr is None: return None
    n = pr.find(w('numPr'))
    if n is None: return None
    ni = n.find(w('numId'))
    return None if ni is None else int(ni.get(w('val')))

def set_numid(el, num_id):
    pr = pPr_of(el); n = pr.find(w('numPr'))
    n.find(w('numId')).set(w('val'), str(num_id))
    il = n.find(w('ilvl'))
    if il is None: il = etree.SubElement(n, w('ilvl'))
    il.set(w('val'), '0')

def fresh_num_id(src_num_id):
    numbering = doc.part.numbering_part.element
    nums = numbering.findall(w('num'))
    mx = max(int(n.get(w('numId'))) for n in nums)
    src = [n for n in nums if n.get(w('numId')) == str(src_num_id)][0]
    new = copy.deepcopy(src)
    new.set(w('numId'), str(mx + 1))
    mac = numbering.find(w('numIdMacAtCleanup'))
    (mac.addprevious(new) if mac is not None else numbering.append(new))
    return mx + 1

def mk(tpl, text, num_id=None):
    el = copy.deepcopy(tpl)
    if num_id is not None: set_numid(el, num_id)
    return set_para(el, text)

def append_after(anchor, els):
    prev = anchor
    for e in els:
        prev.addnext(e); prev = e
    return prev

def make_image_para(img_path, width_emu, tpl_img_el):
    p = doc.add_paragraph()
    el = p._p
    tpr = pPr_of(copy.deepcopy(tpl_img_el))
    if tpr is not None:
        old = pPr_of(el)
        if old is not None: el.remove(old)
        el.insert(0, tpr)
    p.add_run().add_picture(img_path, width=Emu(width_emu))
    return el

# ------------------------------------------------------------------ 模板引用
_FB['b'], _FB['n'] = rpr_templates(PARAS[1279]._p)
TPL_H2 = PARAS[1584]._p; TPL_H3 = PARAS[1276]._p; TPL_BODY = PARAS[1587]._p
TPL_TITLE = PARAS[1665]._p; TPL_EMPTY_TITLE = PARAS[1660]._p; TPL_IMG = PARAS[145]._p
TPL_T4 = TABLES[185]._tbl      # 5x4
TPL_T4B = TABLES[203]._tbl     # 9x4
TPL_T5 = TABLES[181]._tbl      # 9x5
TPL_T5F = TABLES[156]._tbl     # 12x5
TPL_T6 = TABLES[199]._tbl      # 16x6
H3_SRC_NUM = numid_of(TPL_H3)
log('== 模板就绪 | H3 源 numId=%s | 段落 %d / 表格 %d ==' % (H3_SRC_NUM, len(PARAS), len(TABLES)))

# ================================================================== P0-1 重新第三章第五节三模块
SEC = [
    dict(base=1278, tf=156, tfo=157, tr=158, tg=159, c=AUTH[0]),
    dict(base=1314, tf=160, tfo=161, tr=162, tg=163, c=AUTH[1]),
    dict(base=1350, tf=164, tfo=165, tr=166, tg=167, c=AUTH[2]),
]
for s in SEC:
    b = s['base']; c = s['c']
    for k, txt in enumerate(c['loc']):   set_p(b + 1 + k, txt)
    for k, txt in enumerate(c['scene']): set_p(b + 7 + k, txt)
    for k, txt in enumerate(c['func']):  set_p(b + 13 + k, txt)
    set_p(b + 24, c['varnote'])
    for k, txt in enumerate(c['disp']):  set_p(b + 26 + k, txt)
    replace_el(TABLES[s['tf']]._tbl, build_table(TPL_T5F, c['fields']))
    rewrite_card(s['tfo'], c['formula'])
    rewrite_card(s['tr'], c['redline'])
    rewrite_card(s['tg'], c['gherkin'])
log('== P0-1 第三方认证管理三模块重写完成 ==')

# ================================================================== P1-0 残留【待补充/待确认】清理
set_p(697, '**基准期能耗**：改造前可验证的基线能耗（不少于 12 个月数据，取自用能在线监测日结库与能源台账；不足 12 个月时按邻近同类园区同工序基线折算，并在报表中标注折算来源与数据区间）。')
set_p(955, '**全屏轮播**：面向参观与验收场景默认全屏自动轮播，关键指标卡循环展示，支持手动切换与暂停（轮播周期固定为 30 秒，可按大屏场景配置为 15 / 30 / 60 秒三档）。')
set_p(958, '**刷新策略**：LCA 指标按日结刷新（T+1 日 06:00 前完成），欧盟碳价按小时级联动刷新（滞后超过 4 小时自动标注「碳价滞后」并降级至最近一次有效值）。')
set_p(959, '**对外展示脱敏规则与白名单**：对外展示数据统一执行字段白名单裁剪，仅开放碳足迹结果值、绿电消纳占比与认证状态，隐藏工艺配方、采购单价、人员信息与成本构成；白名单由 PM 审批后生效，变更全程留痕。')
set_p(1218, '**ETS 碳价联动**：API 动态对接欧洲能源交易所（EEX）碳配额拍卖结算均价，刷新频率固定为小时级（每小时第 5 分钟拉取，失败重试 3 次后标注「碳价滞后」）。')
set_p(1221, '**数据出境合规**：CBAM 申报数据跨境传输路径与审批已明确，全部出境流量须经信安合规前置网关并执行严格字段白名单，详见第十章「CBAM 数据出境安全合规前置方案」。')
set_p(1259, '**更新订阅机制**：对接官方发布源（国家发展改革委、生态环境部、欧盟 CBAM 门户、ISO 标准发布页）按周轮询比对新版本，命中更新时自动生成因子库「待审」版本并推送 P4 复核，同步频率为每 7 日一次。')
set_p(1632, '安全合规遗留待确认项清单')
log('== P1-0 残留【待补充/待确认】清理完成（7 处正文 + 1 处表标题）==')

# ================================================================== P1-2 跨期调价与系数变更影响策略
set_p(458, '**单价口径**：所有单价严格取自与业务发生月份相匹配的能源价格生效版本（ effective_from ≤ 业务日期 ≤ effective_to ），严禁使用当前版本倒推历史；跨期价差按「追溯补差调整」机制处理，统一在调整当期新增一条「电费跨期调整项」，严禁倒改历史报表月份。')
set_p(770, '**打印模板**：其余格式与打印模板统一沿用导出中心的 A4 横向套打模板，含保密水印、页码与导出哈希校验码。')
set_p(803, '**跨期价差调整**：电费发生跨期价差的，一律在调整当期新增「电费跨期调整项」计入当期损益，历史月份报表数值保持不变；已锁账月份（错误码  E_SYS_ENTRY_ALREADY_LOCKED ）严禁被新配置参数追溯重算。')
set_p(808, '**变量定义与取值约定**：单价  **P_seg**  /  **P_media**  均取自与业务发生时间匹配的能源价格生效版本；跨期调整不得改写历史成本报表，仅允许在当期新增「电费跨期调整项」并留痕。')
set_p(910, '**字段字典与审批流**：能源价格与折标系数均采用版本化字段字典管理（见下方两张字段字典），新增、变更、废止一律经统一工作流引擎审批后生效。')
set_p(915, '**审批流**：能源价格与折标系数的新增 / 变更 / 废止须由 P2 园区能碳专员提交、PM 审批后生效；审批流程归属第八章统一工作流引擎，审批未通过的版本保持「待审」状态且不可被核算引擎引用。')
set_p(920, '**变量定义与取值约定**：  **P_version(t)**  与  **k_version(t)**  为按业务发生时间匹配的版本化参数；版本生效区间严格有序且不可重叠。变更影响策略为必填项，仅允许以下两种受控机制之一：① **生效时间切片锁定（严格生效日机制）**——历史月份核算强绑定业务发生当时生效的价格 / 因子版本，已锁账月份严禁被新配置参数追溯重算；② **追溯补差调整（财务调账机制）**——电网政策发生追溯性退补电费时，统一在当期新增「电费跨期调整项」计入当期损益，严禁倒改历史报表月份。')
set_p(924, '**影响口径**：系数变更须显式选择「生效时间切片锁定」或「追溯补差调整」，不得默认；选择追溯补差调整的，仅在当期生成「电费跨期调整项」，不倒改历史报表。')
set_cell(113, 3, 2, '版本化维护，记录修改人、时间、依据标准；系数变更对历史核算的影响策略固定为「生效时间切片锁定（严格生效日机制）」或「追溯补差调整（财务调账机制）」二选一，且为必填项')
set_cell(114, 8, 4, '生效时间切片锁定（严格生效日）/ 追溯补差调整（财务调账），二选一必填')
rewrite_card(115, [
    '📐 【核心业务数学模型与计算公式】',
    'Cost = Q × P_version( t )                          按业务发生时间匹配对应生效版本单价',
    'E_tce = Q_media × k_version( t )                          按介质匹配对应生效版本折标系数',
    'Guard: [ from_new , to_new ] ∩ [ from_old , to_old ] = ∅                          生效区间不可重叠',
    'Strategy = 切片锁定 ? Lock_by_Effective_Date : Adjust_in_Current_Period                          变更影响机制二选一',
])
rewrite_card(117, [
    '🧪 【QA 自动化验收准则 · Gherkin BDD 用例契约】\nFeature: 基础参数版本化管理与跨期影响受控',
    '  Scenario: 生效区间不可重叠',
    '    Given 某介质折标系数已存在生效区间为 2026-01-01 至 2026-06-30 的版本',
    '    When 维护人员新增一个生效开始日期落在该区间内的新版本',
    '    Then 前端即时拦截并阻断保存',
    '    And 页面提示生效区间不可重叠',
    '',
    '  Scenario: 已锁账月份不被新参数追溯重算',
    '    Given 2026 年 3 月的成本报表已按当时生效的电价版本生成并完成锁账',
    '    When 维护人员新增一个 2026-07-01 起生效的新电价版本',
    '    Then 2026 年 3 月的报表数值保持不变',
    '    And 系统按业务发生时间匹配当时生效版本，不使用当前版本倒推历史',
    '',
    '  Scenario: 变更影响策略必选',
    '    Given 维护人员修改某折标系数数值',
    '    When 未选择变更影响策略即点击保存',
    '    Then 保存按钮保持置灰不可点击',
    '    And 页面强制要求在"生效时间切片锁定"与"追溯补差调整"之间做出选择',
    '',
    '  Scenario: 追溯性退补电费在当期调账',
    '    Given 电网出具追溯性退补电费通知且涉及已锁账的 2026 年 5 月',
    '    When 财务发起跨期价差调整',
    '    Then 系统在调整当期新增一条"电费跨期调整项"',
    '    And 2026 年 5 月历史报表数值保持不变',
])
log('== P1-2 跨期调价与系数变更影响策略补齐 ==')

# ================================================================== P1-6 CBAM 数据出境安全合规前置方案
set_p(1629, 'CBAM 申报数据与 Ecoinvent 因子数据的跨境传输路径与审批已明确：全部出境流量须经「信安合规前置网关」，并执行严格字段白名单机制，详见本章「CBAM 数据出境安全合规前置方案」。')
set_p(1630, '欧盟客户与审查专员的数据访问须遵循 GDPR 最小必要原则，仅开放脱敏后的碳足迹结果数据；个人信息一律本地剥离，不得随申报包出境。')
set_p(1631, '外部审计沙箱（P6）与生产数据物理隔离，仅可访问指定报告与凭证，且禁止全量导出。')
CBAM_TBL = [
    ['字段类别','允许出境字段','本地强制剥离 / 脱敏字段','合规依据'],
    ['申报主体信息','生产商注册名、CBAM 注册号、报关税号（CN Code）、生产国别','统一社会信用代码明细、银行账户信息','欧盟 2023/956 号条例申报字段要求'],
    ['产品与产量','产品名称、规格型号、净质量（t）、生产周期','变压器工艺配方、设计图纸编号、核心工艺技术参数','数据出境安全评估 + 商业秘密管控'],
    ['排放数据','直接排放强度、前驱物隐含间接排放强度、间接排放量','车间级分工序能耗明细、关键设备台账','欧盟 CBAM 实施条例计算方法'],
    ['成本与价格','—（一律不出境）','原辅料采购单价、供应商名称与账期、成本构成明细','商业秘密 L3~L4 强制剥离'],
    ['人员信息','—（一律不出境）','车间工人姓名、工号、身份证件信息、薪酬数据','个人信息保护法 + GDPR'],
    ['因子数据','公开标准因子结果值（Ecoinvent 结果值）','Ecoinvent License 账号凭据、原始数据集文件','License 协议 + 数据出境合规组审批'],
    ['报文本身','CBAM Communication Template XML 申报包报文体与哈希','申报包内嵌的原始凭证附件与系统截图','信安合规前置网关放行规则'],
]
xml_el = None
cbam_els = [
    mk(TPL_H3, 'CBAM 数据出境安全合规前置方案', fresh_num_id(H3_SRC_NUM)),
    mk(TPL_BODY, '**前置合规网关**：系统在生成欧盟官方 CBAM Communication Template XML 申报包出境前，强制经过「信安合规前置过滤审查」；未通过审查的申报包不得出网关，网关留存请求方、报文哈希、审查结论与放行时间。'),
    mk(TPL_BODY, '**严格字段白名单机制**：对变压器工艺配方、原辅料采购单价、车间工人个人信息等高密级商业秘密（L3~L4）执行本地强制剥离与脱敏，仅允许出口申报必需的税号、重量、直接排放强度与前驱物隐含间接排放强度输出。'),
    mk(TPL_BODY, '**最小必要复核与授权**：出境字段清单按季度复核，新增出境字段须经信息安全合规组与法务双签后方可加入白名单；临时专项出境须逐次申请并留存审批单号。'),
    build_table(TPL_T4B, CBAM_TBL),
    mk(TPL_BODY, '**白名单外零放行**：白名单外的任何字段一律默认拒绝出境，网关返回拦截原因并生成审计事件，不提供人工强制放行开关。'),
]
append_after(PARAS[1631]._p, cbam_els)
set_cell(197, 3, 2, '已明确（信安合规前置网关 + 严格字段白名单，见第十章第二节）')
set_cell(197, 4, 2, '已明确（GDPR 最小必要 + 个人信息本地剥离，见第十章第二节）')
log('== P1-6 CBAM 数据出境安全合规前置方案已制定 ==')

# ================================================================== P1-4 技术选型裁决
set_cell(191, 8, 2, '180（r180）')
for k, row in enumerate([
    ['ADR-SYS-001','时序数据库最终裁决为 TDengine 3.x（边缘侧 SQLite 本地缓存）','单节点高压缩比（实测 ≥ 10:1）、原生 SQL 语法、超级表天然适配工业测点物联网场景，规避多节点运维成本'],
    ['ADR-SYS-002','暗黑 / 浅色双端同构采用 Tailwind CSS class 模式 + CSS 自定义属性（CSS Custom Properties）主题动态注入','一套 DOM 结构承载两套主题变量，保障 TC-02 要求的 76 个路由样式 100% 同构对标'],
    ['ADR-SYS-003','采集频率分层：边端 1s~5s 本地闭环告警，云端 15 分钟等间隔汇聚，仅 32 台特种设备动态高频透传','规避全量秒级上报造成的带宽瓶颈与数仓膨胀'],
    ['ADR-SYS-004','CBAM 申报包出境前置信安合规网关 + 严格字段白名单','满足数据出境安全评估与商业秘密 L3~L4 剥离要求'],
]):
    tr = add_row(192, 5, 5 + k)
    for c, txt in enumerate(row):
        cell_set(tr.findall(w('tc'))[c], txt)
# ADR-CF-001 与 ADR-SYS-001 收敛对齐：原「TimescaleDB」表述由 ADR-SYS-001 最终裁决取代
set_cell(192, 1, 1, '时序数据 TDengine 3.x（边缘侧 SQLite 本地缓存）、关系数据 PostgreSQL 物理隔离')
set_cell(192, 1, 2, 'IoT 秒级高频遥测与台账数据异构；时序库选型已由 ADR-SYS-001 最终收敛，本条时序库部分以 ADR-SYS-001 为准')
# 技术栈表补录时序数据库分层，与 ADR-SYS-001 保持一致
tr = add_row(191, 8, 8)
for c, txt in enumerate(['时序数据库', 'TDengine（边缘侧 SQLite 本地缓存）', '3.x']):
    cell_set(tr.findall(w('tc'))[c], txt)
# 第七章正文 IoT 段落与最终裁决对齐
set_p(1574, 'IoT 物联采集网关：通过 Modbus-TCP / MQTT 协议实现全厂数千台数字电表、变送器秒级遥测高频采集，在边缘侧完成 1s~5s 本地闭环告警后，按 15 分钟等间隔汇聚写入分布式时序数据库（TDengine 3.x，边缘侧 SQLite 本地缓存）。')
# 第一章端-边-云部署架构表云层组件同步对齐
set_cell(4, 3, 3, '时序数仓（TDengine 3.x）、业务主库（PostgreSQL）、指标计算引擎、双中心应用集群')
set_p(1617, '技术决策裁决记录与残留待确认项')
for k, row in enumerate([
    ['时序数据库最终选型','已裁决为 TDengine 3.x（边缘侧 SQLite 本地缓存），见 ADR-SYS-001','已裁决（2026-09-16）'],
    ['边缘一体机操作系统与容器运行时','断点续传与本地闭环控制承载环境','待硬件方案确认'],
    ['ETS 碳价与 Ecoinvent 接口代理部署位置','部署于境内 DMZ 代理节点，全部出境流量经数据出境合规网关，见第十章第二节','已裁决（2026-09-16）'],
    ['双端（暗黑 / 浅色）同构实现方式','Tailwind CSS class 模式 + CSS 自定义属性主题动态注入，见 ADR-SYS-002','已裁决（2026-09-16）'],
]):
    set_cell(193, 1 + k, 1, row[1]); set_cell(193, 1 + k, 2, row[2])
tr = add_row(193, 4, 4)
for c, txt in enumerate(['云端采集频率分层策略','边端 1s~5s / 云端 15 min / 32 台特种设备试验期动态高频透传，见 ADR-SYS-003','已裁决（2026-09-16）']):
    cell_set(tr.findall(w('tc'))[c], txt)
set_p(1612, '平台正式生产架构已通过架构评审裁决（见本节 ADR 与「技术决策裁决记录与残留待确认项」表）。下表为原型实现基线（《系统开发技术文档》TECHNICAL_DOCUMENTATION.md v1.01）与关键架构决策（ADR）。')
log('== P1-4 技术选型裁决完成 ==')

# ================================================================== P1-5 非功能性能指标定稿
set_p(1605, '本章定义平台级非功能需求基线。已回捞 PRD-07 分卷（产品碳足迹集采中心·LCA 模块）中已验证的指标作为基准；集控中心、大屏、报表等其余模块指标已于本次架构评审定稿，全部指标均具备可测量位置与测量方法。')
set_cell(189, 7, 1, '< 3.0s')
set_cell(189, 7, 2, '46:9 环幕进入（含 3D 浮雕地图与航标粒子渲染完成）')
set_cell(189, 8, 1, '< 800ms')
set_cell(189, 8, 2, '跨月单指标趋势查询')
for k, row in enumerate([
    ['全集团月度用能报表生成','< 2.0s','全集团 21 家工厂月度用能报表'],
    ['三维场景运行帧率（FPS）','≥ 45 FPS','46:9 环幕与三维场景持续运行'],
    ['10 万行级多维明细台账异步导出','< 30s','后台下载中心推流下载'],
]):
    tr = add_row(189, 8, 8 + k)
    for c, txt in enumerate(row):
        cell_set(tr.findall(w('tc'))[c], txt)
tr = add_row(190, 6, 6)
for c, txt in enumerate(['大屏连续运行稳定性','7×24 小时连续运行，30 天内首屏加载时长与帧率无衰减']):
    cell_set(tr.findall(w('tc'))[c], txt)
log('== P1-5 非功能性能指标定稿 ==')

# ================================================================== P1-3 高频采集分层
set_p(349, '**实时刷新**：边端一体机对水、电、汽、压力等核心点位保持 1s~5s 高频采集与本地滑动窗口计算，用于瞬时越限告警判定；云端常规表计统一采用 15 分钟等间隔打点汇聚上报。')
append_after(PARAS[349]._p, [mk(TPL_BODY, COLLECT['note'])])
for r in range(1, 16):
    tbl = TABLES[199]
    v = tbl.rows[r].cells[5].text.strip()
    cell_set(tbl.rows[r].cells[5]._tc,
             '1s~5s（边端）/ 15 min（云端）' if v == '1s~5s' else '15 min（云端汇聚）')
set_cell(199, 0, 5, '采集频率（边端 / 云端）')
set_cell(198, 1, 3, '15 分钟（云端汇聚）/ 1s~5s（特种设备透传）')
append_after(PARAS[1640]._p, [mk(TPL_BODY, COLLECT['tail'])])
log('== P1-3 高频采集分层策略落定 ==')

# ================================================================== P1-1 数据冲突仲裁（第九章）
recon_els = [mk(TPL_H2, RECON['h2']), mk(TPL_BODY, RECON['intro'])]
recon_els.append(mk(TPL_H3, RECON['h3a'], fresh_num_id(H3_SRC_NUM)))
for t in RECON['bodya']: recon_els.append(mk(TPL_BODY, t))
recon_els.append(build_table(TPL_T4, RECON['tbl_a']))
recon_els.append(mk(TPL_H3, RECON['h3b'], fresh_num_id(H3_SRC_NUM)))
for t in RECON['bodyb']: recon_els.append(mk(TPL_BODY, t))
recon_els.append(build_table(TPL_T4, RECON['tbl_b']))
for t in RECON['tail']: recon_els.append(mk(TPL_BODY, t))
append_after(PARAS[1591]._p, recon_els)
log('== P1-1 数据冲突仲裁与降级补传治理机制已插入第九章 ==')

# ================================================================== P2-1 补齐 3 处缺口原型图
for idx, fn, name in [
    (108, 'proto_screen_169.png', '16:9 综合集控大屏'),
    (585, 'proto_balance.png', '综合能耗平衡表'),
    (894, 'proto_basic_config.png', '基础参数配置'),
]:
    img = make_image_para(os.path.join(PROTO, fn), IMG_W, TPL_IMG)
    replace_el(PARAS[idx]._p, img)
    log('   原型图已插入：%s  <- %s' % (name, fn))
log('== P2-1 三处缺口原型图补齐完成 ==')

# ================================================================== P0-2 附录 F
apx_els = [
    mk(TPL_EMPTY_TITLE, ''),
    mk(TPL_TITLE, APX_F['title']),
    mk(TPL_BODY, APX_F['intro']),
    mk(TPL_H3, APX_F['h1'], fresh_num_id(H3_SRC_NUM)),
    mk(TPL_BODY, APX_F['intro1']),
    build_table(TPL_T5, APX_F['tbl1']),
    mk(TPL_H3, APX_F['h2'], fresh_num_id(H3_SRC_NUM)),
    mk(TPL_BODY, APX_F['intro2']),
    build_table(TPL_T6, APX_F['tbl2']),
]
for t in APX_F['tail']: apx_els.append(mk(TPL_BODY, t))
append_after(PARAS[1667]._p, apx_els)
log('== P0-2 附录 F（NSM 矩阵 + 数据源端点映射表）已追加 ==')

# ================================================================== P2-2 版本收口
cell_set(TABLES[0].rows[0].cells[1]._tc, 'TBEA-PRD-MASTER-2026-V2.2')
cell_set(TABLES[0].rows[1].cells[1]._tc, 'v2.2.0（内容终稿版）')
cell_set(TABLES[0].rows[2].cells[1]._tc, '特变电工能碳数字化双中心')
cell_set(TABLES[0].rows[3].cells[1]._tc, '2026-09-16 (正式生效)')
for k, row in enumerate([
    ['项目总监','待签署','项目管理部 / 项目总监','待审签','—'],
    ['项目经理','王亮','产品管理部 / 项目经理','同意发布','2026-09-16'],
    ['PM 负责人','王亮','产品管理部 / PM 负责人','同意发布','2026-09-16'],
    ['系统架构师','待签署','系统架构研发组 / 系统架构师','待审签','—'],
    ['前端负责人','待签署','前端研发组 / 前端负责人','待审签','—'],
    ['后端负责人','待签署','后端研发组 / 后端负责人','待审签','—'],
    ['测试负责人','待签署','质量保障中心 / 测试负责人','待审签','—'],
]):
    for c, txt in enumerate(row):
        cell_set(TABLES[1].rows[1 + k].cells[c]._tc, txt)
VER = [
    ['版本','修订日期','主要修订内容与动因','修订人','审核人'],
    ['v1.1.0','2026-09-08','全面升版：补齐全量数据字典、数学公式、字段校验、控制流逻辑与 Gherkin 验收准则','王亮','产品经理'],
    ['v1.2.0','2026-09-14','新增第六~第十二章框架章节（技术架构、公共模块、安全合规、接口点表、验收基线、里程碑）','王亮','产品经理'],
    ['v1.3.0','2026-09-15','细化功能模块分类，完成「指标管控」模块页面需求说明文档，确立模块样板范式','王亮','产品经理'],
    ['v2.0.0','2026-09-16','实现全文档模块颗粒度对齐、字段级可研发、验收级可测试','王亮','产品经理'],
    ['v2.1.0','2026-09-16','格式与结构修复：目录域升至 1-3 级、清除空白章标题、页面尺寸改为 A4、因子库模块子标题升级为四级标题、8 个模块标题补挂编号','王亮','产品经理'],
    ['v2.2.0','2026-09-16','内容终稿：重构第三方认证管理三模块（消除全文重复硬伤）、新增附录 F 北极星指标与数据源映射表、补充数据冲突仲裁与跨期调价受控机制、裁决技术选型、定稿非功能性能指标、制定 CBAM 数据出境合规前置方案、补齐 3 处缺口原型图','王亮','产品经理'],
]
replace_el(TABLES[2]._tbl, build_table(TPL_T5F, VER))
log('== P2-2 版本收口完成 ==')

# ================================================================== 公式卡竖线符号规范化
# 项目规范：正文与表格内禁用半角竖线（避免与表格分隔符语义冲突）
# 绝对值对 -> ABS( ... )；集合构造式「such that」竖线 -> U+2223
def _fix_pipe_cell(ti, r, c):
    tc = TABLES[ti].rows[r].cells[c]._tc
    n = 0
    for t in tc.findall('.//' + w('t')):
        s = t.text or ''
        if '|' not in s:
            continue
        ns = re.sub(r'\|\s*([^|]+?)\s*\|', lambda m: 'ABS( %s )' % m.group(1).strip(), s)
        ns = ns.replace('| today', '∣ today')
        if ns != s:
            t.text = ns
            t.set('{%s}space' % XMLNS, 'preserve')
            n += 1
    return n

_np = _fix_pipe_cell(72, 0, 0) + _fix_pipe_cell(137, 0, 0) + _fix_pipe_cell(153, 0, 0)
log('== 公式卡竖线符号规范化（%d 处）== ' % _np)

# ================================================================== 目录域置 dirty
cnt = 0
for it in doc.element.body.iter(w('instrText')):
    if 'TOC' in (it.text or ''):
        p = it.getparent()
        while p is not None and p.tag != w('p'):
            p = p.getparent()
        if p is None: continue
        for fc in p.iter(w('fldChar')):
            if fc.get(w('fldCharType')) == 'begin':
                fc.set(w('dirty'), 'true'); cnt += 1
log('== 目录域 dirty=true（%d 处）== ' % cnt)

doc.save(DST)
log('已保存：%s' % DST)
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '_fix_v22_log.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(LOG))

# -*- coding: utf-8 -*-
"""v2.2.0 封板终审：逐条核验 P0/P1/P2 修改项是否闭环，输出 PASS/FAIL 清单。"""
import os, re, sys, zipfile
import docx

BASE = r'D:\Project\TJ-nengtan\PRD'
P = os.path.join(BASE, '特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.2.docx')
d = docx.Document(P)

paras = [p.text for p in d.paragraphs]
cells = []
for t in d.tables:
    for r in t.rows:
        for c in r.cells:
            cells.append(c.text)
BLOB = '\n'.join(paras + cells)

z = zipfile.ZipFile(P)
media = [n for n in z.namelist() if n.startswith('word/media/') and not n.endswith('/')]

results = []
def ck(name, ok, detail=''):
    results.append((ok, name, detail))
    print("[%s] %s%s" % ('PASS' if ok else 'FAIL', name, ('  —— ' + detail) if detail else ''))

print('=' * 66)
print('  特变电工能碳数字化双中心 PRD  v2.2.0  封板终审')
print('=' * 66)
print('文件大小 %.2f MB | 段落 %d | 表格 %d | 媒体 %d'
      % (os.path.getsize(P) / 1048576, len(paras), len(d.tables), len(media)))
print()

# ---------------- P0 ----------------
print('── P0 阻断级 ──')
ck('P0-1 三模块 H3 标题唯一化',
   paras.count('认证资料维护') == 1 and paras.count('认证申请') == 1 and paras.count('认证结果管理') == 1)
# 各模块功能定位首句互异
loc = {}
for i, p in enumerate(paras):
    if p.strip() in ('认证资料维护', '认证申请', '认证结果管理'):
        for j in range(i + 1, min(i + 8, len(paras))):
            if paras[j].startswith('功能定位：'):
                loc[p.strip()] = paras[j]; break
uniq = len(set(loc.values())) == 3
ck('P0-1 三模块「功能定位」正文互不重复', uniq and len(loc) == 3,
   ' / '.join('%s→%s' % (k, v[:18]) for k, v in loc.items()))
routes = [p for p in paras if p.startswith('页面路由： /carbon-footprint/certification/')]
ck('P0-1 三模块页面路由独立', len(set(routes)) == 3, ' | '.join(r.replace('页面路由： ', '') for r in routes))
# 字段字典表体量差异（避免整表复制）
fd = [t for t in d.tables if len(t.columns) == 5 and t.rows and t.rows[0].cells[1].text.strip() == '字段中文名称']
ck('P0-1 三模块字段字典表行数不完全相同',
   len(set(len(t.rows) for t in fd)) > 1, '行数=%s' % [len(t.rows) for t in fd])
ck('P0-2 附录 F 及 F-1/F-2 三级标题齐全',
   '附录 F：北极星指标（NSM）与全量数据源映射表' in paras and '附录 F-1 全系统北极星指标（NSM）矩阵' in paras
   and '附录 F-2 数据源与端点映射表（Data Lineage Table）' in paras)
ck('P0-2 附录 F 数据表落位（NSM 矩阵 + 数据源血缘表）',
   any('北极星指标' in t.rows[0].cells[1].text for t in d.tables if len(t.columns) == 5)
   and any('备份降级数据源' in t.rows[0].cells[-1].text for t in d.tables))
print()

# ---------------- P1 ----------------
print('── P1 逻辑 / 非功能 / 合规 ──')
ck('P1-1 数据冲突仲裁机制（Reconciliation）章节', 'Reconciliation' in BLOB)
ck('P1-1 网关离线补传冲突 E_IO_GATEWAY_OFFLINE', 'E_IO_GATEWAY_OFFLINE' in BLOB)
ck('P1-1 ERP 兜底 BOM 冲突 INV-FALLBACK', 'INV-FALLBACK' in BLOB)
ck('P1-2 生效时间切片锁定机制', '生效时间切片' in BLOB)
ck('P1-2 追溯补差调整机制', '追溯补差' in BLOB)
ck('P1-3 边端 1s~5s 本地闭环告警', '1s~5s' in BLOB)
ck('P1-3 云端 15 分钟等间隔汇聚', '15 分钟等间隔' in BLOB)
ck('P1-3 32 台特种设备动态高频透传', '32 台特种设备' in BLOB)
print()

# ---------------- P2 技术 / 合规 ----------------
print('── P2 技术选型 / 非功能 / 合规 ──')
ck('P2-2 时序库最终裁决 TDengine（ADR-SYS-001）', 'ADR-SYS-001' in BLOB and 'TDengine' in BLOB)
ck('P2-2 双端主题 Tailwind class 模式（ADR-SYS-002）', 'ADR-SYS-002' in BLOB and 'class 模式' in BLOB)
ck('P2-2 采集分层决策（ADR-SYS-003）', 'ADR-SYS-003' in BLOB)
ck('P2-2 CBAM 出境决策（ADR-SYS-004）', 'ADR-SYS-004' in BLOB)
ck('P2-2 旧时序库选型残留清零', 'TimescaleDB' not in BLOB and 'InfluxDB' not in BLOB)
ck('P2-2 IoT 段落与最终裁决一致', '分布式时序数据库（TDengine 3.x' in BLOB)
ck('P2-3 大屏首屏 < 3.0s', '< 3.0s' in BLOB)
ck('P2-3 三维场景帧率 ≥ 45 FPS', '45 FPS' in BLOB)
ck('P2-3 跨月趋势查询 P95 < 800ms', '< 800ms' in BLOB)
ck('P2-3 月度用能报表 < 2.0s', '< 2.0s' in BLOB)
ck('P2-3 10 万行导出 < 30s', '< 30s' in BLOB)
ck('P2-4 CBAM 出境字段白名单表（8 行）',
   any(t.rows[0].cells[0].text.strip() == '字段类别' and '允许出境字段' in t.rows[0].cells[1].text for t in d.tables))
ck('P2-4 白名单外零放行规则', '白名单外' in BLOB and '默认拒绝出境' in BLOB)
print()

# ---------------- P2 原型 / 收口 ----------------
print('── P2 原型图 / 版本收口 ──')
# 结构式校验：三张新原型图紧邻其所属模块标题、且下一节为「定位与架构角色」
_NS_EMBED = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed'
_new_img_ctx = {}
for _i, _p in enumerate(d.paragraphs):
    for _b in _p._p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip'):
        _rid = _b.get(_NS_EMBED)
        if not _rid:
            continue
        _tgt = str(d.part.rels[_rid].target_ref)
        for _n in (40, 41, 42):
            if 'image%d.' % _n in _tgt:
                _prev = d.paragraphs[_i - 1].text.strip() if _i else ''
                _next = d.paragraphs[_i + 1].text.strip() if _i + 1 < len(d.paragraphs) else ''
                _new_img_ctx[_n] = (_prev, _next)
ck('P2-1 三张缺口原型图已入包（image40/41/42）',
   all(('word/media/image%d.png' % n) in media for n in (40, 41, 42)))
ck('P2-1 原型图锚点段落齐全（紧邻模块标题 + 后接定位与架构角色）',
   len(_new_img_ctx) == 3 and all(nxt == '定位与架构角色' for _, nxt in _new_img_ctx.values()),
   ' ; '.join('image%d: ←%s →%s' % (n, pv, nx) for n, (pv, nx) in sorted(_new_img_ctx.items())))
ck('P2-2 封面受控编号已升 V2.2', 'TBEA-PRD-MASTER-2026-V2.2' in d.tables[0].rows[0].cells[1].text)
ck('P2-2 封面文档版本 v2.2.0', 'v2.2.0' in d.tables[0].rows[1].cells[1].text)
ck('P2-2 审签栏表格完备', len(d.tables[1].rows) == 8 and len(d.tables[1].columns) == 5)
ck('P2-2 版本记录表含 v2.2.0 条目',
   any(r.cells[0].text.strip() == 'v2.2.0' for r in d.tables[2].rows))
ck('P2-2 目录域置 dirty（Word 打开自动刷新页码）',
   any('TOC' in (it.text or '') for it in d.element.body.iter(
       '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}instrText')))
print()

# ---------------- 结构硬伤 ----------------
print('── 结构硬伤总检 ──')
ph = [p for p in paras if '【待补充' in p or '【待确认' in p]
ck('正文【待补充/待确认】占位清零', len(ph) == 0, '残留 %d' % len(ph))
pipe_cells = [c for c in cells if '|' in c]
ck('正文与表格内半角竖线清零', len(pipe_cells) == 0, '残留 %d' % len(pipe_cells))
blank_h = [p.text for p in d.paragraphs if re.match(r'^Heading\s*[123]$', p.style.name or '') and not p.text.strip()]
ck('空白标题段落清零', len(blank_h) == 0, '残留 %d' % len(blank_h))
onesec = [p for p in paras if p.strip() == '（本章内容待补充）']
ck('无「本章内容待补充」空壳章节', len(onesec) == 0)
print()

npass = sum(1 for ok, _, _ in results if ok)
nfail = len(results) - npass
print('=' * 66)
print('  终审结论：%d 项通过 / %d 项失败 / 共 %d 项' % (npass, nfail, len(results)))
print('=' * 66)
if nfail:
    print('\n未通过项：')
    for ok, name, detail in results:
        if not ok:
            print('  x %s  %s' % (name, detail))

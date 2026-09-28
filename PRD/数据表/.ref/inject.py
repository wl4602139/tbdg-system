# -*- coding: utf-8 -*-
"""向 sheet1 的公式单元格注入缓存值（本机无 LibreOffice / formulas 引擎）。

预览器与部分阅读器只读缓存值；WPS / Excel 打开后仍可正常重算。
"""
import json
import os
import re
import sys
import zipfile
import shutil
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
XLSX = os.path.join(os.path.dirname(HERE),
                    "双中心能碳管控平台_基础参数与指标字典_V2.2.xlsx")
R = json.load(open(os.path.join(HERE, "rows_model.json"), encoding="utf-8"))
LAY = json.load(open(os.path.join(HERE, "layout.json"), encoding="utf-8"))
PARAMS = R["params"]
INDS = R["inds"]

P_IN = "EN-KE46"
I_IN = "IND-017"

# 02：数据行从第 4 行开始（表头第 3 行）
p_row = None
for i, p in enumerate(PARAMS):
    if p[0] == P_IN:
        p_row = 4 + i
        break

i_row = None
for i, x in enumerate(INDS):
    if x[0] == I_IN:
        i_row = 2 + i
        break

print("param row:", p_row, "| ind row:", i_row)

P_ROW = [None] + PARAMS[p_row - 4]      # 1-based 索引
I_ROW = [None] + INDS[i_row - 2]

# 收集 (单元格, 期望值)
pairs = [("B%d" % LAY["p_m"], p_row)]
for k, (nm, pos) in enumerate(LAY["pcols_note"]):
    pairs.append(("B%d" % (LAY["p_first"] + k), P_ROW[pos]))
pairs.append(("B%d" % LAY["i_m"], i_row))
for k, (nm, pos) in enumerate(LAY["iattrs"]):
    pairs.append(("B%d" % (LAY["i_first"] + k), I_ROW[pos]))

TARGET = dict(pairs)
_F = {}


def main():
    # 读取原公式
    z = zipfile.ZipFile(XLSX)
    names = z.namelist()
    sheet_name = "xl/worksheets/sheet1.xml"
    xml = z.read(sheet_name).decode("utf-8")

    for ref in TARGET:
        m = re.search(r'<c r="%s"[^>]*>(.*?)</c>' % re.escape(ref), xml, re.S)
        if not m:
            print("  ! 未找到", ref)
            continue
        fm = re.search(r"<f>(.*?)</f>", m.group(1), re.S)
        if fm:
            _F[ref] = fm.group(1)

    cnt_num = cnt_str = 0
    for ref, val in TARGET.items():
        if ref not in _F or val is None:
            continue
        f = _F[ref]
        if isinstance(val, (int, float)) and not isinstance(val, bool):
            new = '<c r="%s"><f>%s</f><v>%s</v></c>' % (ref, f, val)
            cnt_num += 1
        else:
            s = escape(str(val))
            # 清除旧 t 属性，避免类型冲突
            new = '<c r="%s" t="str"><f>%s</f><v>%s</v></c>' % (ref, f, s)
            cnt_str += 1
        pat = re.compile(r'<c r="%s"(?:\s[^>]*)?>.*?</c>' % re.escape(ref), re.S)
        xml2 = pat.sub(lambda _m: new, xml, count=1)
        if xml2 == xml:
            print("  ! 替换失败", ref)
        xml = xml2

    print("注入数值缓存:", cnt_num, "| 文本缓存:", cnt_str)

    # 写回 zip
    tmp = XLSX + ".tmp"
    zin = zipfile.ZipFile(XLSX)
    zout = zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED)
    for n in zin.namelist():
        data = zin.read(n)
        if n == sheet_name:
            data = xml.encode("utf-8")
        zout.writestr(n, data)
    zout.close()
    zin.close()
    shutil.move(tmp, XLSX)
    print("saved ->", XLSX)


if __name__ == "__main__":
    main()

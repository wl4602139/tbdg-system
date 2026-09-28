const fs = require('fs');

let content = fs.readFileSync('app/zero-carbon/project/self/page.tsx', 'utf8');
const isCRLF = content.includes('\r\n');
let norm = content.replace(/\r\n/g, '\n');

// 1. Table cell text color in factoryDetailModal
norm = norm.replaceAll(
  'border-r border-slate-100 text-slate-800',
  'border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200'
);

// 2. Line 399 att name
norm = norm.replaceAll(
  `<span className="text-[11px] font-medium text-slate-800 truncate max-w-[220px]" title={file.name}>`,
  `<span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]" title={file.name}>`
);

// 3. Line 776 badge
norm = norm.replaceAll(
  `<span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">`,
  `<span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border">`
);

// 4. EvaluationModal checkboxes & blocks (lines 1220-1410)
norm = norm.replace(
  `? 'bg-emerald-50 border-emerald-300 text-slate-900'\n                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'`,
  `? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-foreground'\n                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'`
);

norm = norm.replace(
  `<span className="font-bold text-xs text-slate-800">{opt.title}</span>`,
  `<span className="font-bold text-xs text-slate-800 dark:text-foreground">{opt.title}</span>`
);

norm = norm.replace(
  `<span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-400">`,
  `<span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-border text-slate-400">`
);

norm = norm.replace(
  `<div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">\n                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">\n                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">\n                      <Cpu className="size-4 text-purple-600" />\n                      4 智能控碳（零碳园区集控中心支持功能，共 13 项）\n                    </h4>`,
  `<div className="border border-slate-200 dark:border-border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">\n                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-border">\n                    <h4 className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">\n                      <Cpu className="size-4 text-purple-600" />\n                      4 智能控碳（零碳园区集控中心支持功能，共 13 项）\n                    </h4>`
);

norm = norm.replace(
  `<div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">\n                    <div className="flex items-center justify-between">\n                      <span className="text-slate-800 font-bold text-xs">[4.1] 重点用能设备数据自动采集率 Ra</span>`,
  `<div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-border space-y-2">\n                    <div className="flex items-center justify-between">\n                      <span className="text-slate-800 dark:text-foreground font-bold text-xs">[4.1] 重点用能设备数据自动采集率 Ra</span>`
);

norm = norm.replace(
  `className="h-8 w-28 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-[#2C7CFF] focus:outline-none focus:border-blue-500"`,
  `className="h-8 w-28 px-2.5 rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-slate-700 text-xs font-mono font-bold text-[#2C7CFF] focus:outline-none focus:border-blue-500"`
);

norm = norm.replace(
  `<span className="font-bold text-slate-800 text-xs">[4.2] 能碳管理中心 13 项数字化功能核验</span>`,
  `<span className="font-bold text-slate-800 dark:text-foreground text-xs">[4.2] 能碳管理中心 13 项数字化功能核验</span>`
);

norm = norm.replace(
  `? 'bg-purple-50 border-purple-300 text-slate-900'\n                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'`,
  `? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-slate-900 dark:text-foreground'\n                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'`
);

norm = norm.replace(
  `<span className="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-400 shrink-0">`,
  `<span className="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-border text-slate-400 shrink-0">`
);

norm = norm.replace(
  `<div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">\n                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">\n                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">\n                      <Compass className="size-4 text-amber-600" />\n                      5 碳抵消和信息披露（共 3 份报告与示范要求）\n                    </h4>`,
  `<div className="border border-slate-200 dark:border-border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">\n                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-border">\n                    <h4 className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">\n                      <Compass className="size-4 text-amber-600" />\n                      5 碳抵消和信息披露（共 3 份报告与示范要求）\n                    </h4>`
);

norm = norm.replace(
  `? 'bg-amber-50 border-amber-300 text-slate-900'\n                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'`,
  `? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-slate-900 dark:text-foreground'\n                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'`
);

norm = norm.replace(
  `<span className="font-bold text-xs block text-slate-800">{opt.title}</span>`,
  `<span className="font-bold text-xs block text-slate-800 dark:text-foreground">{opt.title}</span>`
);

norm = norm.replace(
  `<div className="flex items-center justify-between pt-3 border-t border-slate-200 shrink-0">\n                  <span className="text-[11px] text-slate-400">\n                    💡 提示：自评估填报修改将自动同步至大盘统筹得分与对应单体工厂明细。\n                  </span>\n                  <div className="flex items-center gap-2">\n                    <button\n                      type="button"\n                      onClick={() => setIsDeclareModalOpen(false)}\n                      className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"\n                    >\n                      取消\n                    </button>`,
  `<div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-border shrink-0">\n                  <span className="text-[11px] text-slate-400">\n                    💡 提示：自评估填报修改将自动同步至大盘统筹得分与对应单体工厂明细。\n                  </span>\n                  <div className="flex items-center gap-2">\n                    <button\n                      type="button"\n                      onClick={() => setIsDeclareModalOpen(false)}\n                      className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"\n                    >\n                      取消\n                    </button>`
);

norm = norm.replace(
  `className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold transition-colors cursor-pointer text-xs"`,
  `className="px-4 py-2 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer text-xs"`
);

if (isCRLF) norm = norm.replace(/\n/g, '\r\n');
fs.writeFileSync('app/zero-carbon/project/self/page.tsx', norm, 'utf8');
console.log('Finished updating self page part 2');

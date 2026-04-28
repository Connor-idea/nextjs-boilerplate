/**
 * SupplierReconciliation.jsx
 * 供应商对账模块
 * 包含对账单统计、条件筛选、批量操作、明细列表和分页功能。
 */

import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/* ─────────────────────────── 模拟数据 ─────────────────────────── */

function fmtDate(offsetDays) {
  const d = new Date('2025-10-02');
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const MOCK_BILLS = Array.from({ length: 92 }, (_, i) => ({
  id: i + 1,
  billNo: `18946523800295${20000 + i}`,
  billType: i % 3 === 0 ? '服务费账单' : '订单账单',
  receivable: 2000.0,
  payable: -200.0,
  invoiceStatus: i % 4 === 0 ? '未开票' : '已开票',
  settlementStatus: i % 5 === 0 ? '未结算' : '已结算',
  feeInvoiceStatus: i % 3 === 0 ? '已开票' : '未结算',
  feeSettlementStatus: i % 6 === 0 ? '已结算' : '未结算',
  supplierCode: '3123123123',
  supplierName: '诚信酒类超市',
  supplierFullName: '深圳市亿惠科技有限公司',
  totalAmount: 2100.0,
  actualCostTotal: 1900.0,
  serviceFeeTotal: 200.0,
  orderCount: 3 + (i % 5),
  createTime: fmtDate(i),
  invoiceTime: i % 4 === 0 ? '' : fmtDate(i + 2),
  settleTime: i % 5 === 0 ? '' : fmtDate(i + 5),
  feeInvoiceTime: i % 3 === 0 ? fmtDate(i + 1) : '',
  feeSettleTime: i % 6 === 0 ? fmtDate(i + 7) : '',
}));

/* ─────────────────────────── 辅助组件 ─────────────────────────── */

function StatCard({ label, value, unit = '元' }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 px-6 py-5 flex-1 min-w-0">
      <p className="text-xs text-slate-500 mb-3">{label}</p>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function FilterInput({ label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-slate-500">{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8"
      />
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-slate-500">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function RangeInput({ label, minVal, maxVal, onMinChange, onMaxChange, placeholder = '价格' }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-slate-500">{label}</label>}
      <div className="flex items-center gap-1">
        <input
          type="text"
          placeholder={`最低${placeholder}`}
          value={minVal}
          onChange={(e) => onMinChange(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8 w-28"
        />
        <span className="text-slate-400 text-xs">—</span>
        <input
          type="text"
          placeholder={`最高${placeholder}`}
          value={maxVal}
          onChange={(e) => onMaxChange(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8 w-28"
        />
      </div>
    </div>
  );
}

function StatusBadge({ text, type }) {
  const styles = {
    invoiced: 'bg-blue-50 text-blue-600 border-blue-100',
    settled: 'bg-green-50 text-green-600 border-green-100',
    unsettled: 'bg-orange-50 text-orange-600 border-orange-100',
    uninvoiced: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  const cls = styles[type] || 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded border ${cls}`}>
      {text}
    </span>
  );
}

function getStatusType(text) {
  if (text === '已开票') return 'invoiced';
  if (text === '已结算') return 'settled';
  if (text === '未结算') return 'unsettled';
  if (text === '未开票') return 'uninvoiced';
  return '';
}

/* ─────────────────────────── 主组件 ─────────────────────────── */

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function SupplierReconciliation() {
  /* ── 筛选状态 ── */
  const [billType, setBillType] = useState('');
  const [dateSearchType, setDateSearchType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [payableMin, setPayableMin] = useState('');
  const [payableMax, setPayableMax] = useState('');
  const [refundMin, setRefundMin] = useState('');
  const [refundMax, setRefundMax] = useState('');
  const [supplierCode, setSupplierCode] = useState('');
  const [supplierProductName, setSupplierProductName] = useState('');
  const [supplierFullName, setSupplierFullName] = useState('');

  /* ── 已应用筛选（点查询后生效）── */
  const [appliedFilters, setAppliedFilters] = useState({});

  /* ── 分页状态 ── */
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('');

  /* ── 选中行 ── */
  const [selectedIds, setSelectedIds] = useState(new Set());

  /* ── 详情页 ── */
  const [detailBill, setDetailBill] = useState(null);

  /* ── 筛选后数据 ── */
  const filteredData = useMemo(() => {
    return MOCK_BILLS.filter((b) => {
      if (appliedFilters.billType && b.billType !== appliedFilters.billType) return false;
      if (appliedFilters.supplierCode && !b.supplierCode.includes(appliedFilters.supplierCode)) return false;
      if (appliedFilters.supplierFullName && !b.supplierFullName.includes(appliedFilters.supplierFullName)) return false;
      if (appliedFilters.supplierProductName && !b.supplierName.includes(appliedFilters.supplierProductName)) return false;
      if (appliedFilters.payableMin && b.payable < Number(appliedFilters.payableMin)) return false;
      if (appliedFilters.payableMax && b.payable > Number(appliedFilters.payableMax)) return false;
      return true;
    });
  }, [appliedFilters]);

  /* ── 当前页数据 ── */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* ── 统计 ── */
  const stats = useMemo(() => ({
    count: filteredData.length,
    total: filteredData.reduce((s, b) => s + b.totalAmount, 0),
    actualCost: filteredData.reduce((s, b) => s + b.actualCostTotal, 0),
    serviceFee: filteredData.reduce((s, b) => s + b.serviceFeeTotal, 0),
  }), [filteredData]);

  /* ── 操作函数 ── */
  const handleQuery = () => {
    setAppliedFilters({ billType, dateSearchType, dateFrom, dateTo, payableMin, payableMax, refundMin, refundMax, supplierCode, supplierProductName, supplierFullName });
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleReset = () => {
    setBillType(''); setDateSearchType(''); setDateFrom(''); setDateTo('');
    setPayableMin(''); setPayableMax(''); setRefundMin(''); setRefundMax('');
    setSupplierCode(''); setSupplierProductName(''); setSupplierFullName('');
    setAppliedFilters({});
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedIds(new Set(pagedData.map((b) => b.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleJump = () => {
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) setCurrentPage(p);
    setJumpPage('');
  };

  const allOnPageSelected = pagedData.length > 0 && pagedData.every((b) => selectedIds.has(b.id));
  const hasSelection = selectedIds.size > 0;

  /* ── 分页页码渲染 ── */
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      if (currentPage > 4) buttons.push('...');
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) buttons.push(i);
      if (currentPage < totalPages - 3) buttons.push('...');
      buttons.push(totalPages);
    }
    return buttons;
  };

  /* ── 渲染 ── */

  /* 详情页视图 */
  if (detailBill) {
    return <BillDetail bill={detailBill} onBack={() => setDetailBill(null)} />;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">

      {/* ── 统计卡片 ── */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">对账单简易统计</h2>
        <div className="flex gap-4">
          <StatCard label="对账单总数（笔）" value={stats.count} unit="笔" />
          <StatCard label="对账单总金额（元）" value={stats.total} />
          <StatCard label="对账单实际成本价总金额（元）" value={stats.actualCost} />
          <StatCard label="对账单服务费总金额（元）" value={stats.serviceFee} />
        </div>
      </div>

      {/* ── 筛选区域 ── */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          {/* Row 1 */}
          <FilterSelect
            label="账单类型"
            value={billType}
            onChange={setBillType}
            options={[
              { value: '', label: '—请选择—' },
              { value: '订单账单', label: '订单账单' },
              { value: '服务费账单', label: '服务费账单' },
            ]}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">日期搜索</label>
            <div className="flex items-center gap-2">
              <select
                value={dateSearchType}
                onChange={(e) => setDateSearchType(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8 bg-white w-28"
              >
                <option value="">—请选择—</option>
                <option value="createTime">创建时间</option>
                <option value="settleTime">结算时间</option>
              </select>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8"
              />
              <span className="text-slate-400 text-xs">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 h-8"
              />
            </div>
          </div>
          <div /> <div />

          {/* Row 2 */}
          <RangeInput
            label="应付账款金额"
            minVal={payableMin}
            maxVal={payableMax}
            onMinChange={setPayableMin}
            onMaxChange={setPayableMax}
          />
          <RangeInput
            label="应付推款金额"
            minVal={refundMin}
            maxVal={refundMax}
            onMinChange={setRefundMin}
            onMaxChange={setRefundMax}
          />
          <FilterInput
            label="供应商端编号"
            placeholder="供应商编号"
            value={supplierCode}
            onChange={setSupplierCode}
          />
          <FilterInput
            label="供应商商品名称"
            placeholder="供应商商品名称"
            value={supplierProductName}
            onChange={setSupplierProductName}
          />

          {/* Row 3 */}
          <FilterInput
            label="供应商主体全称"
            placeholder="商品编号/商品名称/创建人"
            value={supplierFullName}
            onChange={setSupplierFullName}
          />
          <div /> <div />
          <div className="flex items-end gap-2 justify-end">
            <button
              onClick={handleQuery}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-1.5 rounded h-8 transition-colors"
            >
              <Search size={13} />
              查询
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm px-5 py-1.5 rounded h-8 transition-colors"
            >
              <RotateCcw size={13} />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* ── 操作按钮 & 表格 ── */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">

        {/* 操作按钮行 */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <ActionBtn label="补款调账" disabled={!hasSelection} onClick={() => {}} />
          <ActionBtn label="退款调账" disabled={!hasSelection} onClick={() => {}} />
          <ActionBtn label="批量发起服务费完结" disabled={!hasSelection} onClick={() => {}} />
          <ActionBtn label="批量审核完结" disabled={!hasSelection} onClick={() => {}} />
          <div className="ml-auto">
            <ActionBtn
              label="导出"
              icon={<Download size={13} />}
              onClick={() => {}}
              variant="outline"
            />
          </div>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单编号</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单类型</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">应收账款</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">应付账款</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单开票状态</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单结算状态</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">服务费开票状态</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">服务费结算状态</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">所属供应商端编号</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">所属供应商端名称</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">所属供应商主体全称</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单总金额</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">实际成本价总金额</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">服务费总金额</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">订单笔数（笔）</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单创建时间</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单开票时间</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">账单结算时间</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">服务费开票时间</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium">服务费结算时间</th>
                <th className="px-3 py-3 whitespace-nowrap font-medium sticky right-0 bg-slate-50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedData.map((bill) => (
                <tr
                  key={bill.id}
                  className={`hover:bg-slate-50 transition-colors group ${selectedIds.has(bill.id) ? 'bg-blue-50/40' : ''}`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(bill.id)}
                      onChange={(e) => handleSelectRow(bill.id, e.target.checked)}
                      className="w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3 text-xs whitespace-nowrap">
                    <button
                      onClick={() => setDetailBill(bill)}
                      className="text-blue-500 hover:text-blue-700 hover:underline font-medium transition-colors"
                    >
                      {bill.billNo}
                    </button>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{bill.billType}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-700">
                    ¥{bill.receivable.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-red-500">
                    ¥{bill.payable.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge text={bill.invoiceStatus} type={getStatusType(bill.invoiceStatus)} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge text={bill.settlementStatus} type={getStatusType(bill.settlementStatus)} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge text={bill.feeInvoiceStatus} type={getStatusType(bill.feeInvoiceStatus)} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge text={bill.feeSettlementStatus} type={getStatusType(bill.feeSettlementStatus)} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-500">{bill.supplierCode}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{bill.supplierName}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-600">{bill.supplierFullName}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    ¥{bill.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                    ¥{bill.actualCostTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                    ¥{bill.serviceFeeTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-slate-700">{bill.orderCount}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-500">{bill.createTime}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-400">{bill.invoiceTime || '—'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-400">{bill.settleTime || '—'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-400">{bill.feeInvoiceTime || '—'}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-400">{bill.feeSettleTime || '—'}</td>
                  <td className={`px-3 py-3 whitespace-nowrap sticky right-0 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10 transition-colors ${selectedIds.has(bill.id) ? 'bg-blue-50/40' : 'bg-white group-hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <button className="text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors">
                        查看详情
                      </button>
                      {bill.invoiceStatus === '已开票' &&
                        bill.settlementStatus === '已结算' &&
                        bill.feeInvoiceStatus === '已开票' &&
                        bill.feeSettlementStatus === '已结算' && (
                        <button className="text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors">
                          审核完结
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pagedData.length === 0 && (
                <tr>
                  <td colSpan={22} className="text-center py-12 text-slate-400 text-sm">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            {/* 首页 */}
            <PageBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft size={14} />
            </PageBtn>
            <PageBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={14} />
            </PageBtn>
            {renderPageButtons().map((p, idx) =>
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 select-none">…</span>
              ) : (
                <PageBtn
                  key={p}
                  active={p === currentPage}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </PageBtn>
              )
            )}
            <PageBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={14} />
            </PageBtn>
            <PageBtn onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              <ChevronsRight size={14} />
            </PageBtn>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}条/页</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">跳至</span>
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                className="border border-slate-300 rounded px-2 py-1 w-10 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span className="text-slate-500">页</span>
              <button
                onClick={handleJump}
                className="border border-slate-300 rounded px-2 py-1 hover:bg-slate-50 transition-colors"
              >
                GO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── 小工具组件 ─────────────────────────── */

function ActionBtn({ label, icon, onClick, variant = 'default', disabled = false }) {
  const base = 'relative flex items-center gap-1 text-xs px-3 py-1.5 rounded border transition-colors group/btn';
  const enabledStyle = 'border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer';
  const disabledStyle = 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50';
  return (
    <div className="relative inline-flex">
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`${base} ${disabled ? disabledStyle : enabledStyle}`}
      >
        {icon}
        {label}
      </button>
      {disabled && (
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50
          whitespace-nowrap rounded bg-slate-700 px-2 py-1 text-xs text-white opacity-0
          group-hover/btn:opacity-100 transition-opacity shadow-lg">
          请选中需要操作的对账单后再进行「{label}」操作
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
        </div>
      )}
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[28px] h-7 px-1.5 rounded text-xs flex items-center justify-center border transition-colors
        ${active
          ? 'bg-blue-500 text-white border-blue-500'
          : disabled
          ? 'text-slate-300 border-slate-200 cursor-not-allowed'
          : 'border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer'
        }`}
    >
      {children}
    </button>
  );
}

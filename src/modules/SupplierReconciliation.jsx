/**
 * SupplierReconciliation.jsx
 * 供应商对账模块
 * 包含对账单统计、条件筛选、批量操作、明细列表和分页功能。
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Search, RotateCcw, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import SubpageLayout from '../components/SubpageLayout';

/* ─────────────────────────── 模拟数据 ─────────────────────────── */

function fmtDate(offsetDays) {
  const d = new Date('2025-10-02');
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/* 对账单内订单明细 mock（每张账单随机生成若干条订单） */
const PRODUCT_NAMES = [
  '星巴克（Starbucks）丹青墨绿系列不锈钢保温杯325ml',
  '天章（TANGO）回形针镀镍曲别针3#29mm金属200枚办公文具',
  '斯图（sitoo）强力高粘EVA泡沫双面胶18mm*3m',
  '得力（deli）订书机24/6规格办公用品',
  '晨光（M&G）中性笔0.5mm黑色签字笔水笔20支装',
  '广博（GuangBo）A4打印纸80g复印纸500张',
  '惠普（HP）CE505A硒鼓黑色激光打印机墨盒',
  '联想（Lenovo）USB光学鼠标有线商务办公家用',
];
const COMPANY_NAMES = ['深圳市人人卡科技有限公司', '广州数联软件技术有限公司', '北京优科网络科技有限公司', '上海云码信息技术有限公司'];
const MALL_NAMES = ['人人商城', '美好福利平台', '人人公司员工福利商城', '靠铺第一商城', '靠铺壹号商城'];
// 各商品对应的品牌&规格（多行格式）
const BRANDS = [
  '品牌：星巴克\n大小：325ml\n颜色：灰色',
  '品牌：无\n大小：29mm\n数量：200',
  '品牌：sitoo\n数量：1卷',
  '品牌：得力\n规格：24/6',
  '品牌：晨光\n规格：无',
  '品牌：广博\n规格：80g/500张',
  '品牌：惠普\n型号：CE505A',
  '品牌：联想\n规格：USB有线',
];
const BUYER_NAMES = ['Jack', '小豪', '陈宇', '李明', 'Rose', '王芳', '小超', '陈明'];

function genBillOrders(billIndex, count) {
  return Array.from({ length: count }, (_, j) => {
    const cost = Math.round((9.91 + (billIndex * 17 + j * 31) % 190) * 100) / 100;
    const total = Math.round(cost * 1.1 * 100) / 100;
    const fee = Math.round((total - cost) * 100) / 100;
    const d = new Date('2025-01-01');
    d.setDate(d.getDate() + (billIndex * 7 + j * 13) % 365);
    const dtStr = (offsetMin) => {
      const dd = new Date(d.getTime() + offsetMin * 60000);
      const p = (n) => String(n).padStart(2, '0');
      return `${dd.getFullYear()}-${p(dd.getMonth()+1)}-${p(dd.getDate())} ${p(dd.getHours())}:${p(dd.getMinutes())}:${p(dd.getSeconds())}`;
    };
    const idx = (billIndex + j) % PRODUCT_NAMES.length;
    const qty = 1 + (billIndex * 3 + j * 7) % 9;
    const unitPrice = Math.round(cost / qty * 100) / 100;
    const buyerName = BUYER_NAMES[(billIndex * 3 + j * 5) % BUYER_NAMES.length];
    const phone = `1${[3,5,7,8,9][(billIndex + j) % 5]}${String(10000000 + (billIndex * 1031 + j * 613) % 89999999).padStart(9,'0')}`;
    // 订单完成时间：少数订单未完成，用 '——' 表示
    const hasFinish = (billIndex + j) % 7 !== 5;
    return {
      id: `189465238${String(20000000 + billIndex * 100 + j)}`,
      productName: PRODUCT_NAMES[idx],
      productImg: null,
      totalAmount: total,
      costAmount: cost,
      feeAmount: fee,
      finishTime: hasFinish ? dtStr(60) : '——',
      payTime: dtStr(0),
      company: COMPANY_NAMES[(billIndex + j) % COMPANY_NAMES.length],
      mallName: MALL_NAMES[(billIndex + j) % MALL_NAMES.length],
      brandSpec: BRANDS[idx],
      unitPrice,
      qty,
      buyerInfo: `ID:${buyerName}\n手机：${phone}`,
    };
  });
}

const MOCK_BILLS = Array.from({ length: 92 }, (_, i) => {
  // 每条账单的账款金额在 1000–9000 之间变化，服务费约为 10%
  const base = Math.round((1000 + (i * 137 + 3000) % 8000) / 100) * 100;
  const actualCostTotal = base;
  const serviceFeeTotal = Math.round(base * 0.1 * 100) / 100;
  const totalAmount = actualCostTotal + serviceFeeTotal;
  const payable = -actualCostTotal;       // 应付账款 = 账款成本（我方付给供应商）
  const receivable = serviceFeeTotal;     // 应收账款 = 服务费（供应商付给我方）
  return ({
  id: i + 1,
  billNo: `18946523800295${20000 + i}`,
  billType: i % 3 === 0 ? '服务费账单' : '订单账单',
  receivable,
  payable,
  invoiceStatus: i % 4 === 0 ? '未开票' : '已开票',
  settlementStatus: i % 5 === 0 ? '未结算' : '已结算',
  feeInvoiceStatus: i % 3 === 0 ? '已开票' : '未开票',
  feeSettlementStatus: i % 6 === 0 ? '已结算' : '未结算',
  supplierCode: '3123123123',
  supplierName: '诚信酒类超市',
  supplierFullName: '深圳市亿惠科技有限公司',
  totalAmount,
  actualCostTotal,
  serviceFeeTotal,
  orderCount: 3 + (i % 5),
  createTime: fmtDate(i),
  invoiceTime: i % 4 === 0 ? '' : fmtDate(i + 2),
  settleTime: i % 5 === 0 ? '' : fmtDate(i + 5),
  feeInvoiceTime: i % 3 === 0 ? fmtDate(i + 1) : '',
  feeSettleTime: i % 6 === 0 ? fmtDate(i + 7) : '',
  // 供应商凭证（模拟已上传）
  supplierInvoiceVouchers: i % 4 !== 0
    ? [{ name: `开票凭证_${20000 + i}.pdf`, size: 512 * 1024 + i * 1024 }]
    : [],
  supplierSettleVouchers: i % 5 !== 0
    ? [{ name: `结算凭证_${20000 + i}.pdf`, size: 768 * 1024 + i * 512 }]
    : [],
  // 我方财务
  ourInvoiceStatus: i % 4 === 0 ? '未开票' : '已开票',
  ourInvoiceTime: i % 4 === 0 ? '' : fmtDate(i + 3),
  ourSettleStatus: i % 5 === 0 ? '未结算' : '已结算',
  ourSettleTime: i % 5 === 0 ? '' : fmtDate(i + 6),
  // 供应商是否已发起结算单
  settleInitiated: i % 7 !== 0, // 约 6/7 的记录已发起
  remark: i % 3 === 0 ? '' : (i % 3 === 1 ? '请尽快完成结算，逾期将影响下月合作。' : '供应商已确认金额，待我方开票。'),
  orders: genBillOrders(i, 3 + (i % 5)),
  })
});

/* ─────────────────────────── 辅助组件 ─────────────────────────── */

function StatCard({ label, value, unit = '元' }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 px-6 py-5 flex-1 min-w-0">
      <p className="text-xs text-slate-500 mb-3">{label}</p>
      <p className="text-2xl font-bold text-slate-800 tracking-tight sm:text-3xl">
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
        className="h-8 w-full border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
        className="h-8 w-full border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
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
      <div className="flex flex-wrap items-center gap-1 sm:flex-nowrap">
        <input
          type="text"
          placeholder={`最低${placeholder}`}
          value={minVal}
          onChange={(e) => onMinChange(e.target.value)}
          className="h-8 w-full min-w-0 border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 sm:w-28"
        />
        <span className="text-slate-400 text-xs">—</span>
        <input
          type="text"
          placeholder={`最高${placeholder}`}
          value={maxVal}
          onChange={(e) => onMaxChange(e.target.value)}
          className="h-8 w-full min-w-0 border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 sm:w-28"
        />
      </div>
    </div>
  );
}

function StatusBadge({ text, type }) {
  const styles = {
    completed: 'bg-green-50 text-green-600 border-green-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const cls = styles[type] || 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded border ${cls}`}>
      {text}
    </span>
  );
}

function getStatusType(text) {
  if (text === '已开票' || text === '已结算') return 'completed';
  if (text === '未开票' || text === '未结算') return 'pending';
  return '';
}

/* ─────────────────────────── 主组件 ─────────────────────────── */

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function SupplierReconciliation({ initialBillsData, onBillsChange }) {
  const externalBills = Array.isArray(initialBillsData) ? initialBillsData : MOCK_BILLS;
  const billSnapshotRef = useRef(JSON.stringify(externalBills));
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
  const [bills, setBills] = useState(externalBills);
  const [detailBill, setDetailBill] = useState(null);

  useEffect(() => {
    const nextSnapshot = JSON.stringify(externalBills);
    if (nextSnapshot !== billSnapshotRef.current) {
      billSnapshotRef.current = nextSnapshot;
      setBills(externalBills);
    }
  }, [externalBills]);

  useEffect(() => {
    const nextSnapshot = JSON.stringify(bills);
    if (nextSnapshot !== billSnapshotRef.current) {
      billSnapshotRef.current = nextSnapshot;
      onBillsChange?.(bills);
    }
  }, [bills, onBillsChange]);

  /* ── 筛选后数据 ── */
  const filteredData = useMemo(() => {
    return bills.filter((b) => {
      if (appliedFilters.billType && b.billType !== appliedFilters.billType) return false;
      if (appliedFilters.supplierCode && !b.supplierCode.includes(appliedFilters.supplierCode)) return false;
      if (appliedFilters.supplierFullName && !b.supplierFullName.includes(appliedFilters.supplierFullName)) return false;
      if (appliedFilters.supplierProductName && !b.supplierName.includes(appliedFilters.supplierProductName)) return false;
      if (appliedFilters.payableMin && b.payable < Number(appliedFilters.payableMin)) return false;
      if (appliedFilters.payableMax && b.payable > Number(appliedFilters.payableMax)) return false;
      return true;
    });
  }, [appliedFilters, bills]);

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

  const handleSaveBill = (nextBill) => {
    setBills((prev) => prev.map((item) => (item.id === nextBill.id ? nextBill : item)));
    setDetailBill(nextBill);
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
    return <BillDetail bill={detailBill} onBack={() => setDetailBill(null)} onSave={handleSaveBill} />;
  }

  return (
    <div className="page-shell bg-slate-50 min-h-full">

      {/* ── 统计卡片 ── */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-5 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">对账单简易统计</h2>
        <div className="metric-grid">
          <StatCard label="对账单总数（笔）" value={stats.count} unit="笔" />
          <StatCard label="对账单总金额（元）" value={stats.total} />
          <StatCard label="对账单实际成本价总金额（元）" value={stats.actualCost} />
          <StatCard label="对账单服务费总金额（元）" value={stats.serviceFee} />
        </div>
      </div>

      {/* ── 筛选区域 ── */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-5 sm:p-5">
        <div className="filter-grid gap-x-6 gap-y-4">
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
            <div className="flex flex-wrap items-center gap-2">
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

          <FilterInput
            label="供应商主体全称"
            placeholder="商品编号/商品名称/创建人"
            value={supplierFullName}
            onChange={setSupplierFullName}
          />
          <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-1 xl:justify-end">
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
      <div className="console-table-section rounded-none">

        {/* 操作按钮行 */}
        <div className="action-cluster console-table-toolbar">
          <ActionBtn label="补款调账" disabled={!hasSelection} onClick={() => {}} />
          <ActionBtn label="退款调账" disabled={!hasSelection} onClick={() => {}} />
          <ActionBtn label="批量发起服务费完结" disabled={!hasSelection} onClick={() => {}} />
          <ActionBtn label="批量审核完结" disabled={!hasSelection} onClick={() => {}} />
          <div className="sm:ml-auto">
            <ActionBtn
              label="导出"
              icon={<Download size={13} />}
              onClick={() => {}}
              variant="outline"
            />
          </div>
        </div>

        <div className="table-shell table-shell-dense">
          <table className="console-table console-table-dense w-full min-w-[1750px] text-sm text-left border-collapse">
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
                <th className="console-table-sticky-right px-3 py-3 whitespace-nowrap font-medium">操作</th>
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
                  <td className={`console-table-sticky-right px-3 py-3 whitespace-nowrap transition-colors ${selectedIds.has(bill.id) ? 'bg-console-primary-soft' : 'group-hover:bg-console-surface-alt'}`}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setDetailBill(bill)} className="text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors">
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
        <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-3 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
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

/* ─────────────────────────── 对账单详情页 ─────────────────────────── */

const ACCEPTED_EXTS = '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.pdf,.jpg,.jpeg,.png,.gif,.webp';
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);
const isImageFile = (name) => IMAGE_EXTS.has((name.split('.').pop() || '').toLowerCase());
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_FILE_COUNT = 5;

/* ── 文件预览 Modal ── */
function FilePreviewModal({ file, onClose }) {
  const [content, setContent] = React.useState(null);
  // 用 ref 管理 blobURL，避免 StrictMode 双执行导致 URL 被提前撤销
  const activeUrlRef = React.useRef(null);

  React.useEffect(() => {
    // 撤销上一个 URL
    if (activeUrlRef.current) {
      URL.revokeObjectURL(activeUrlRef.current);
      activeUrlRef.current = null;
    }

    if (!file) { setContent(null); return; }
    setContent(null);

    if (!(file instanceof File)) {
      if (file?.previewType === 'image') {
        setContent({ type: 'mock-image', label: file.previewLabel || file.name });
        return;
      }
      setContent({ type: 'mock' });
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      const url = URL.createObjectURL(file);
      activeUrlRef.current = url;
      setContent({ type: 'pdf', url });
      return;
    }

    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      const url = URL.createObjectURL(file);
      activeUrlRef.current = url;
      setContent({ type: 'image', url });
      return;
    }

    if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => setContent({ type: 'text', text: e.target.result });
      reader.readAsText(file, 'UTF-8');
      return;
    }

    // Office & other: provide download
    const dlUrl = URL.createObjectURL(file);
    activeUrlRef.current = dlUrl;
    setContent({ type: 'download', url: dlUrl, ext });
  }, [file]);

  // 组件卸载时统一清理
  React.useEffect(() => {
    return () => {
      if (activeUrlRef.current) {
        URL.revokeObjectURL(activeUrlRef.current);
        activeUrlRef.current = null;
      }
    };
  }, []);

  if (!file) return null;

  const fmtSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '820px', maxWidth: '92vw', height: '82vh' }}>

        {/* 头部 */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-slate-400 flex-shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p className="text-sm font-medium text-slate-800 flex-1 truncate">{file.name}</p>
          {file.size ? <span className="text-xs text-slate-400 flex-shrink-0">{fmtSize(file.size)}</span> : null}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          {!content && (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">加载中…</div>
          )}

          {content?.type === 'pdf' && (
            <iframe
              src={content.url}
              className="w-full h-full border-0"
              title={file.name}
            />
          )}

          {content?.type === 'image' && (
            <div className="flex items-center justify-center h-full p-6 bg-slate-50 overflow-auto">
              <img src={content.url} alt={file.name} className="max-w-full max-h-full object-contain rounded" />
            </div>
          )}

          {content?.type === 'text' && (
            <pre className="p-6 text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed overflow-auto h-full">
              {content.text}
            </pre>
          )}

          {content?.type === 'unsupported' && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                className="text-slate-200">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <p className="text-sm text-slate-500 font-medium">该格式暂不支持在线预览</p>
              <p className="text-xs text-slate-400">支持预览格式：PDF · 图片（PNG/JPG/GIF/WEBP）</p>
            </div>
          )}

          {content?.type === 'download' && (
            <div className="flex items-center justify-center h-full">
              <a
                href={content.url}
                download={file.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下载文件
              </a>
            </div>
          )}

          {content?.type === 'mock' && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                className="text-slate-200">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p className="text-sm text-slate-600 font-medium">{file.name}</p>
              <p className="text-xs text-slate-400">{fmtSize(file.size)}</p>
              <p className="text-xs text-slate-300 mt-1">演示数据，接入文件服务后可查看实际内容</p>
            </div>
          )}

          {content?.type === 'mock-image' && (
            <div className="flex items-center justify-center h-full p-6 bg-slate-50 overflow-auto">
              <div className="w-full max-w-[520px] aspect-[4/3] rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center text-center px-8">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <p className="text-sm font-medium text-slate-700">{content.label || file.name}</p>
                <p className="text-xs text-slate-400 mt-2">演示图片凭证，原型阶段仅展示布局与预览交互</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── 图片文件行（缩略图 + 预览/删除） ── */
function ImageFileRow({ file, onPreview, onRemove }) {
  const [thumb, setThumb] = React.useState(null);
  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5">
      <button
        type="button"
        onClick={onPreview}
        className="flex-shrink-0 w-10 h-10 rounded overflow-hidden border border-slate-200 bg-white hover:opacity-80 transition-opacity"
        title="点击大图预览"
      >
        {thumb
          ? <img src={thumb} alt={file.name} className="w-full h-full object-cover" />
          : <span className="flex items-center justify-center w-full h-full text-slate-300 text-[10px]">…</span>
        }
      </button>
      <span className="text-slate-700 flex-1 truncate max-w-xs">{file.name}</span>
      <button
        type="button"
        onClick={onPreview}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        预览
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

function FileUploadArea({ label, files, onChange }) {
  const imgInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [previewFile, setPreviewFile] = React.useState(null);

  const handleFileChange = (e) => {
    const incoming = Array.from(e.target.files || []);
    const merged = [...files];
    const errors = [];
    for (const f of incoming) {
      if (merged.length >= MAX_FILE_COUNT) {
        errors.push(`最多上传 ${MAX_FILE_COUNT} 个文件`);
        break;
      }
      merged.push(f);
    }
    if (errors.length) alert(errors.join('\n'));
    onChange(merged);
    e.target.value = '';
  };

  const handleRemove = (idx) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  const fmtSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canAdd = files.length < MAX_FILE_COUNT;
  const btnCls = (enabled) =>
    `flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors ${
      enabled
        ? 'border-blue-300 text-blue-500 hover:bg-blue-50 cursor-pointer'
        : 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
    }`;

  return (
    <div>
      <div className="flex flex-col gap-1.5 mb-2">
        {/* 上传图片 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-36 flex-shrink-0">{label}</span>
          <button
            type="button"
            onClick={() => canAdd && imgInputRef.current?.click()}
            className={btnCls(canAdd)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            上传图片
          </button>
          <span className="text-xs text-slate-400">建议尺寸：单张大小不超过2M，最多上传5张</span>
        </div>
        {/* 上传文件 */}
        <div className="flex items-center gap-2">
          <span className="w-36 flex-shrink-0" />
          <button
            type="button"
            onClick={() => canAdd && fileInputRef.current?.click()}
            className={btnCls(canAdd)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            上传文件
          </button>
          <span className="text-xs text-slate-400">支持格式：.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf</span>
        </div>
        <input ref={imgInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.webp" multiple className="hidden" onChange={handleFileChange} />
        <input ref={fileInputRef} type="file" accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf" multiple className="hidden" onChange={handleFileChange} />
      </div>
      {files.length > 0 && (
        <div className="ml-36 flex flex-col gap-1.5">
          {files.map((f, idx) => (
            isImageFile(f.name)
              ? <ImageFileRow key={idx} file={f} onPreview={() => setPreviewFile(f)} onRemove={() => handleRemove(idx)} />
              : (
                <div key={idx} className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded px-3 py-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="text-slate-700 flex-1 truncate max-w-xs">{f.name}</span>
                  <span className="text-slate-400 flex-shrink-0">{fmtSize(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(f)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    预览
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              )
          ))}
        </div>
      )}
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}

/* 只读凭证预览（供应商侧） */
function VoucherPreview({ label, vouchers }) {
  const [previewFile, setPreviewFile] = React.useState(null);
  const fmtSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="text-xs text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</span>
        <div className="flex-1">
          {vouchers.length === 0 ? (
            <span className="text-xs text-slate-400">未上传</span>
          ) : (
            <div className="flex flex-col gap-1.5">
              {vouchers.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded px-3 py-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="text-slate-700 flex-1 truncate max-w-xs">{f.name}</span>
                  <span className="text-slate-400 flex-shrink-0">{fmtSize(f.size)}</span>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors ml-1 flex-shrink-0"
                    onClick={() => setPreviewFile(f)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    预览
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}

function DetailField({ label, children, className = '' }) {
  return (
    <div className={`flex flex-col items-start gap-2 sm:flex-row sm:gap-5 ${className}`}>
      <span className="w-full flex-shrink-0 text-xs leading-6 text-slate-500 sm:w-36 sm:leading-7">{label}</span>
      <div className="flex-1 min-w-0 text-sm text-slate-700 leading-7">{children ?? '—'}</div>
    </div>
  );
}

function formatDetailDateTime(value) {
  if (!value) return '暂无';
  const text = String(value).replace(/-/g, '/');
  return text.includes(':') ? text : `${text} 10:00:00`;
}

function getComparableDateValue(value, endOfDay = false) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return Date.parse(`${value}${endOfDay ? 'T23:59:59' : 'T00:00:00'}`);
  }
  const normalized = String(value).replace(/\//g, '-').replace(' ', 'T');
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function isAttachmentImageItem(file) {
  if (!file) return false;
  if (file instanceof File) return isImageFile(file.name);
  if (file.previewType === 'image') return true;
  return isImageFile(file.name || '');
}

function getAttachmentName(file) {
  return file?.name || '未命名文件';
}

function getAttachmentSize(file) {
  return file?.size || 0;
}

function getAttachmentUploadedAt(file, fallbackTime) {
  return file?.uploadedAt || fallbackTime || '—';
}

function isPdfAttachmentItem(file) {
  return (getAttachmentName(file).split('.').pop() || '').toLowerCase() === 'pdf';
}

function canPreviewFileAttachment(file) {
  return isPdfAttachmentItem(file);
}

function downloadAttachmentItem(file) {
  if (file instanceof File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return;
  }

  const blob = new Blob([`演示文件：${getAttachmentName(file)}`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = getAttachmentName(file);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function InlineValueField({ label, value, valueClassName = '' }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:min-w-[200px]">
      <span className="text-xs text-slate-500 whitespace-nowrap">{label}</span>
      <span className={`text-sm text-slate-800 ${valueClassName}`}>{value}</span>
    </div>
  );
}

function StatusChoiceGroup({ value, options, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-8 pt-1">
      {options.map((option) => {
        const checked = value === option;
        return (
          <label key={option} className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="radio"
              className="sr-only"
              checked={checked}
              onChange={() => onChange(option)}
            />
            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${checked ? 'border-blue-500' : 'border-slate-300'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${checked ? 'bg-blue-500' : 'bg-transparent'}`} />
            </span>
            {option}
          </label>
        );
      })}
    </div>
  );
}

function VoucherThumbnail({ file, onPreview }) {
  const [thumbUrl, setThumbUrl] = React.useState('');

  React.useEffect(() => {
    if (!(file instanceof File) || !isImageFile(file.name)) {
      setThumbUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <button
      type="button"
      onClick={onPreview}
      className="w-[126px] h-[92px] rounded-lg border border-slate-200 bg-slate-50 overflow-hidden hover:border-blue-300 transition-colors flex items-center justify-center"
      title="点击放大预览"
    >
      {thumbUrl ? (
        <img src={thumbUrl} alt={getAttachmentName(file)} className="w-full h-full object-cover" />
      ) : (
        <div className="px-3 text-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <p className="text-[11px] text-slate-500 leading-4">{file.previewLabel || '凭证图片'}</p>
        </div>
      )}
    </button>
  );
}

function AttachmentBlock({
  label,
  attachments,
  editable = false,
  onChange,
  emptyText = '暂无',
  note,
  fallbackTime,
  showDelete = false,
  showPreviewAction = true,
  showDownloadAction = true,
  showImageHint = false,
}) {
  const imageInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [previewFile, setPreviewFile] = React.useState(null);

  const imageAttachments = attachments.filter(isAttachmentImageItem);
  const fileAttachments = attachments.filter((item) => !isAttachmentImageItem(item));

  const appendFiles = (incoming) => {
    if (!editable || !onChange) return;
    const next = [...attachments];
    const errors = [];
    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} 超过 2MB 限制`);
        continue;
      }
      if (next.length >= MAX_FILE_COUNT) {
        errors.push(`最多上传 ${MAX_FILE_COUNT} 个文件`);
        break;
      }
      next.push(file);
    }
    if (errors.length) alert(errors.join('\n'));
    onChange(next);
  };

  const handleDownload = (item) => {
    downloadAttachmentItem(item);
  };

  return (
    <DetailField label={label} className="items-start">
      <div className="space-y-4">
        {attachments.length === 0 && !editable ? (
          <p className="text-sm text-slate-400 pt-1">{emptyText}</p>
        ) : (
          <>
            {(imageAttachments.length > 0 || editable || note) && (
              <div>
                <div className="flex flex-wrap items-start gap-4">
                  {imageAttachments.map((item, index) => (
                    <VoucherThumbnail
                      key={`${getAttachmentName(item)}-${index}`}
                      file={item}
                      onPreview={() => setPreviewFile(item)}
                    />
                  ))}
                  {editable && (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-[126px] h-[92px] rounded-lg border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                    >
                      <span className="text-xl leading-none">+</span>
                      <span className="text-[11px] mt-1">上传图片</span>
                    </button>
                  )}
                  {note ? <p className="text-xs text-rose-400 font-medium pt-8">{note}</p> : null}
                </div>
                {showImageHint && (
                  <p className="text-[11px] text-slate-400 mt-2">建议尺寸：单张大小不超过2M，最多上传5张</p>
                )}
              </div>
            )}

            {fileAttachments.length > 0 && (
              <div className="space-y-3">
                {fileAttachments.map((item, index) => {
                  const absoluteIndex = attachments.findIndex((current, currentIndex) => currentIndex >= index && current === item);
                  const allowPreview = showPreviewAction && (editable || canPreviewFileAttachment(item));
                  return (
                    <div key={`${getAttachmentName(item)}-${index}`} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg border border-blue-100 bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-5">
                          <span className="text-slate-700 max-w-[320px] truncate">{getAttachmentName(item)}</span>
                          {allowPreview ? (
                            <button type="button" onClick={() => setPreviewFile(item)} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">预览</button>
                          ) : null}
                          {showDownloadAction ? (
                            <button type="button" onClick={() => handleDownload(item)} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">下载</button>
                          ) : null}
                          {editable && showDelete && absoluteIndex > -1 ? (
                            <button
                              type="button"
                              onClick={() => onChange(attachments.filter((_, currentIndex) => currentIndex !== absoluteIndex))}
                              className="text-xs text-rose-400 hover:text-rose-500 transition-colors"
                            >
                              删除
                            </button>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">上传于{getAttachmentUploadedAt(item, fallbackTime)} · {getAttachmentSize(item) ? `${(getAttachmentSize(item) / 1024).toFixed(0)}KB` : '演示文件'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {editable && (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 h-8 inline-flex items-center justify-center rounded bg-blue-500 text-white text-xs hover:bg-blue-600 transition-colors"
                >
                  添加文件
                </button>
                <p className="text-[11px] text-slate-400 mt-2">支持 .doc/.docx/.ppt/.pptx/.xls/.xlsx/.txt/.pdf 等文件格式</p>
              </div>
            )}
          </>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          multiple
          className="hidden"
          onChange={(e) => {
            appendFiles(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTS}
          multiple
          className="hidden"
          onChange={(e) => {
            appendFiles(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
      </div>
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </DetailField>
  );
}

const DEFAULT_BILL_REMARK = '供应商备注：票开专票。KPI 方案备注：不包含月卡管理费，只承担开票费。';

function getBillAttachmentKey(item) {
  if (item instanceof File) {
    return `${item.name}:${item.size}:${item.lastModified}`;
  }

  return [
    item?.name || '',
    item?.size || 0,
    item?.uploadedAt || '',
    item?.previewType || '',
    item?.previewLabel || '',
  ].join(':');
}

function createBillDetailSnapshot({ accountInvoiceAttachments, accountSettlementAttachments, serviceFeeInvoiceAttachments, remark }) {
  return JSON.stringify({
    accountInvoiceAttachments: accountInvoiceAttachments.map(getBillAttachmentKey),
    accountSettlementAttachments: accountSettlementAttachments.map(getBillAttachmentKey),
    serviceFeeInvoiceAttachments: serviceFeeInvoiceAttachments.map(getBillAttachmentKey),
    remark,
  });
}

function BillDetail({ bill, onBack, onSave }) {
  const fmt = (v) => (v !== undefined && v !== null ? `¥${Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` : '—');
  const orders = bill.orders || [];

  const invoiceTimeText = formatDetailDateTime(bill.invoiceTime || bill.createTime);
  const settlementTimeText = formatDetailDateTime(bill.settleTime || bill.createTime);

  const seedAccountInvoiceAttachments = React.useMemo(() => {
    if (bill.invoiceStatus !== '已开票') return [];
    return [
      {
        name: `发票凭证主图_${bill.id}.jpg`,
        size: 428 * 1024,
        uploadedAt: invoiceTimeText,
        previewType: 'image',
        previewLabel: '发票凭证图片',
      },
      {
        name: `发票凭证_${bill.id}.docx`,
        size: 126 * 1024,
        uploadedAt: invoiceTimeText,
      },
    ];
  }, [bill.id, bill.invoiceStatus, invoiceTimeText]);

  const seedAccountSettlementAttachments = React.useMemo(() => {
    if (bill.settlementStatus !== '已结算') return [];
    return [
      {
        name: `打款委托凭证_${bill.id}_1.jpg`,
        size: 356 * 1024,
        uploadedAt: settlementTimeText,
        previewType: 'image',
        previewLabel: '结算凭证图片一',
      },
      {
        name: `打款委托凭证_${bill.id}_2.jpg`,
        size: 342 * 1024,
        uploadedAt: settlementTimeText,
        previewType: 'image',
        previewLabel: '结算凭证图片二',
      },
      {
        name: `打款委托凭证_${bill.id}.docx`,
        size: 118 * 1024,
        uploadedAt: settlementTimeText,
      },
    ];
  }, [bill.id, bill.settlementStatus, settlementTimeText]);

  const seedServiceFeeInvoiceAttachments = React.useMemo(() => {
    if (bill.feeInvoiceStatus !== '已开票') return [];
    return [
      {
        name: `服务费发票_${bill.id}.pdf`,
        size: 168 * 1024,
        uploadedAt: formatDetailDateTime(bill.feeInvoiceTime || bill.createTime),
      },
    ];
  }, [bill.id, bill.feeInvoiceStatus, bill.feeInvoiceTime, bill.createTime]);

  const seedServiceFeeSettleAttachments = React.useMemo(() => {
    if (bill.feeSettlementStatus !== '已结算') return [];
    return [
      {
        name: `服务费结算凭证_${bill.id}.pdf`,
        size: 164 * 1024,
        uploadedAt: formatDetailDateTime(bill.feeSettleTime || bill.createTime),
      },
    ];
  }, [bill.id, bill.feeSettlementStatus, bill.feeSettleTime, bill.createTime]);

  const [accountInvoiceAttachments, setAccountInvoiceAttachments] = React.useState(bill.accountInvoiceAttachments || seedAccountInvoiceAttachments);
  const [accountSettlementAttachments, setAccountSettlementAttachments] = React.useState(bill.accountSettlementAttachments || seedAccountSettlementAttachments);
  const [serviceFeeInvoiceAttachments, setServiceFeeInvoiceAttachments] = React.useState(bill.serviceFeeInvoiceAttachments || seedServiceFeeInvoiceAttachments);
  const [remark, setRemark] = React.useState(bill.remark || DEFAULT_BILL_REMARK);
  const [saveState, setSaveState] = React.useState('idle');

  const accountInvoiceStatus = bill.invoiceStatus;
  const accountSettlementStatus = bill.settlementStatus;
  const serviceFeeInvoiceStatus = serviceFeeInvoiceAttachments.length > 0 ? '已开票' : '未开票';
  const serviceFeeSettlementStatus = bill.feeSettlementStatus;
  const serviceFeeSettleAttachments = bill.serviceFeeSettleAttachments || seedServiceFeeSettleAttachments;
  const serviceFeeSettlementTimeText = getAttachmentUploadedAt(
    serviceFeeSettleAttachments[0],
    formatDetailDateTime(bill.feeSettleTime || bill.createTime),
  );
  const serviceFeeInvoiceTimeText = getAttachmentUploadedAt(
    serviceFeeInvoiceAttachments[0],
    formatDetailDateTime(bill.feeInvoiceTime || bill.createTime),
  );
  const detailBillType = (bill.billType || '—').replace(/账单/g, '账款');

  React.useEffect(() => {
    setAccountInvoiceAttachments(bill.accountInvoiceAttachments || seedAccountInvoiceAttachments);
    setAccountSettlementAttachments(bill.accountSettlementAttachments || seedAccountSettlementAttachments);
    setServiceFeeInvoiceAttachments(bill.serviceFeeInvoiceAttachments || seedServiceFeeInvoiceAttachments);
    setRemark(bill.remark || DEFAULT_BILL_REMARK);
    setSaveState('idle');
  }, [bill, seedAccountInvoiceAttachments, seedAccountSettlementAttachments, seedServiceFeeInvoiceAttachments]);

  const baselineSnapshot = React.useMemo(() => createBillDetailSnapshot({
    accountInvoiceAttachments: bill.accountInvoiceAttachments || seedAccountInvoiceAttachments,
    accountSettlementAttachments: bill.accountSettlementAttachments || seedAccountSettlementAttachments,
    serviceFeeInvoiceAttachments: bill.serviceFeeInvoiceAttachments || seedServiceFeeInvoiceAttachments,
    remark: bill.remark || DEFAULT_BILL_REMARK,
  }), [bill, seedAccountInvoiceAttachments, seedAccountSettlementAttachments, seedServiceFeeInvoiceAttachments]);

  const currentSnapshot = React.useMemo(() => createBillDetailSnapshot({
    accountInvoiceAttachments,
    accountSettlementAttachments,
    serviceFeeInvoiceAttachments,
    remark,
  }), [accountInvoiceAttachments, accountSettlementAttachments, serviceFeeInvoiceAttachments, remark]);

  const hasUnsavedChanges = currentSnapshot !== baselineSnapshot;

  React.useEffect(() => {
    if (hasUnsavedChanges) {
      setSaveState('idle');
    }
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges && !window.confirm('当前账款详情有未保存的修改，确定返回吗？')) {
      return;
    }
    onBack();
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm('确定取消当前修改并恢复到上次保存状态吗？')) {
      return;
    }

    setAccountInvoiceAttachments(bill.accountInvoiceAttachments || seedAccountInvoiceAttachments);
    setAccountSettlementAttachments(bill.accountSettlementAttachments || seedAccountSettlementAttachments);
    setServiceFeeInvoiceAttachments(bill.serviceFeeInvoiceAttachments || seedServiceFeeInvoiceAttachments);
    setRemark(bill.remark || DEFAULT_BILL_REMARK);
    setSaveState('idle');
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const nextServiceFeeInvoiceStatus = serviceFeeInvoiceAttachments.length > 0 ? '已开票' : '未开票';
    onSave?.({
      ...bill,
      accountInvoiceAttachments,
      accountSettlementAttachments,
      feeInvoiceStatus: nextServiceFeeInvoiceStatus,
      feeInvoiceTime: nextServiceFeeInvoiceStatus === '已开票' ? (bill.feeInvoiceTime || now) : '',
      serviceFeeInvoiceAttachments,
      remark,
    });
    setSaveState('saved');
  };

  const orderSummary = React.useMemo(() => ({
    totalOrders: orders.length,
    totalAmount: orders.reduce((sum, item) => sum + item.totalAmount, 0),
    totalCost: orders.reduce((sum, item) => sum + item.costAmount, 0),
    totalFee: orders.reduce((sum, item) => sum + item.feeAmount, 0),
  }), [orders]);

  const badge = (text) => <StatusBadge text={text} type={getStatusType(text)} />;
  const quickStatuses = [
    { label: '账款开票', value: accountInvoiceStatus },
    { label: '账款结算', value: accountSettlementStatus },
    { label: '服务费结算', value: serviceFeeSettlementStatus },
  ];
  const baseInfoItems = [
    { label: '所属供应商端编号', value: bill.supplierCode || '—' },
    { label: '所属供应商端名称', value: bill.supplierName || '—' },
    { label: '所属供应商主体全称', value: bill.supplierFullName || '—' },
    { label: '账款类型', value: detailBillType },
    { label: '账款编号', value: bill.billNo || '—' },
    { label: '应收款数', value: fmt(bill.receivable), emphasis: true },
    { label: '应付款数', value: fmt(bill.payable), emphasis: true },
  ];

  return (
    <div className="page-shell min-h-full bg-slate-50">
      <SubpageLayout
        onBack={handleBack}
        breadcrumbs={[
          { label: '财务管理' },
          { label: '供应商对账款', onClick: handleBack },
          { label: '账款详情' },
        ]}
        className="page-shell-wide"
        contentClassName="space-y-6"
      >
          <section className="page-card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">账款要素信息</h2>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 xl:justify-end">
                  {quickStatuses.map((item) => (
                    <div key={item.label} className="inline-flex items-center gap-2 text-xs text-slate-500">
                      <span>{item.label}</span>
                      {badge(item.value)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <div className="space-y-6">
                <div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">基础信息</h3>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {baseInfoItems.map((item) => (
                      <div key={item.label} className="border-b border-slate-100 pb-3">
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className={`mt-2 break-all ${item.emphasis ? 'text-base font-semibold text-slate-900' : 'text-sm font-medium text-slate-800'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 border-t border-slate-200 pt-6 xl:grid-cols-2 xl:gap-0">
                  <div className="space-y-5 xl:pr-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">账款票据与结算</h3>
                    </div>
                    <DetailField label="账款开票状态">{badge(accountInvoiceStatus)}</DetailField>

                    <DetailField label="账款开票时间">{accountInvoiceStatus === '已开票' ? invoiceTimeText : '暂无'}</DetailField>

                    <AttachmentBlock
                      label="账款开票凭证"
                      attachments={accountInvoiceAttachments}
                      editable={accountInvoiceStatus === '已开票'}
                      onChange={setAccountInvoiceAttachments}
                      note="产品说明：图片可点击放大"
                      fallbackTime={invoiceTimeText}
                      showDelete
                      showDownloadAction={false}
                      showImageHint
                    />

                    <DetailField label="账款结算状态">{badge(accountSettlementStatus)}</DetailField>

                    <DetailField label="账款结算时间">{accountSettlementStatus === '已结算' ? settlementTimeText : '暂无'}</DetailField>

                    <AttachmentBlock
                      label="账款结算凭证"
                      attachments={accountSettlementAttachments}
                      editable
                      onChange={setAccountSettlementAttachments}
                      fallbackTime={settlementTimeText}
                      showDelete
                      showDownloadAction={false}
                      showImageHint
                    />
                  </div>

                  <div className="space-y-5 border-t border-slate-200 pt-6 xl:border-t-0 xl:border-l xl:border-slate-100 xl:pl-6 xl:pt-0">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">服务费票据与结算</h3>
                    </div>
                    <DetailField label="服务费结算状态">{badge(serviceFeeSettlementStatus)}</DetailField>

                    <DetailField label="服务费结算时间">{serviceFeeSettlementStatus === '已结算' ? serviceFeeSettlementTimeText : '暂无'}</DetailField>

                    <AttachmentBlock
                      label="服务费结算凭证"
                      attachments={serviceFeeSettleAttachments}
                      emptyText="暂无"
                      fallbackTime={serviceFeeSettlementTimeText}
                    />

                    <DetailField label="服务费开票状态">{badge(serviceFeeInvoiceStatus)}</DetailField>

                    <DetailField label="服务费开票时间">{serviceFeeInvoiceStatus === '已开票' ? serviceFeeInvoiceTimeText : '暂无'}</DetailField>

                    <AttachmentBlock
                      label="服务费开票凭证"
                      attachments={serviceFeeInvoiceAttachments}
                      editable
                      onChange={setServiceFeeInvoiceAttachments}
                      fallbackTime={serviceFeeInvoiceTimeText}
                      showDelete
                      showDownloadAction={false}
                      showImageHint
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">账款备注</h3>
                    {hasUnsavedChanges ? (
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        有未保存更改
                      </span>
                    ) : saveState === 'saved' ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        已保存
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-slate-500">账款备注</label>
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="mt-2 min-h-[124px] w-full border border-slate-200 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                    />
                    <p className="mt-2 text-[11px] text-slate-400">还可输入{500 - remark.length}个字</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex h-9 items-center justify-center rounded border border-slate-200 bg-white px-5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                    className={`inline-flex h-9 items-center justify-center rounded px-5 text-sm transition-colors ${
                      hasUnsavedChanges
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="page-card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-base font-semibold text-slate-800">账款统计</h2>
              <p className="mt-1 text-sm text-slate-500">帮助快速确认当前账款内订单规模、成本与服务费。</p>
            </div>
            <div className="px-5 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 xl:gap-0">
                {[
                  { label: '账款内订单总数（笔）', value: orderSummary.totalOrders, isMoney: false },
                  { label: '账款内订单总金额', value: orderSummary.totalAmount, isMoney: true },
                  { label: '账款总成本金额', value: orderSummary.totalCost, isMoney: true },
                  { label: '账款服务费总额', value: orderSummary.totalFee, isMoney: true },
                ].map(({ label, value, isMoney }, index) => (
                  <div
                    key={label}
                    className={`${index > 0 ? 'border-t border-slate-100 pt-4 xl:border-t-0 xl:border-l xl:border-slate-100 xl:pl-6 xl:pt-0' : ''} ${index < 3 ? 'xl:pr-6' : ''}`}
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-slate-800">
                      {isMoney ? (
                        <>
                          <span className="mr-0.5 text-base font-semibold">¥</span>
                          {Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </>
                      ) : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <BillOrderSection bill={bill} />
      </SubpageLayout>
    </div>
  );
}

/* ─────────────────────────── 账单订单明细区块 ─────────────────────────── */

const KW_OPTIONS = ['订单编号', '商品名称', '企业用户主体'];
const DATE_OPTIONS = ['支付时间', '订单完成时间'];

function BillOrderSection({ bill }) {
  const orders = bill.orders || [];

  // 筛选状态
  const [kwType, setKwType] = React.useState('');
  const [kwValue, setKwValue] = React.useState('');
  const [dateType, setDateType] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo]     = React.useState('');
  const [minAmt, setMinAmt]     = React.useState('');
  const [maxAmt, setMaxAmt]     = React.useState('');
  const [previewPage, setPreviewPage] = React.useState(1);
  const [previewPageSize, setPreviewPageSize] = React.useState(5);

  const [applied, setApplied] = React.useState({});

  const handleQuery = () => {
    setApplied({ kwType, kwValue, dateType, dateFrom, dateTo, minAmt, maxAmt });
    setPreviewPage(1);
  };

  const handleClear = () => {
    setKwType(''); setKwValue(''); setDateType('');
    setDateFrom(''); setDateTo(''); setMinAmt(''); setMaxAmt('');
    setApplied({});
    setPreviewPage(1);
  };

  const filtered = React.useMemo(() => {
    return orders.filter(o => {
      if (applied.kwType && applied.kwValue) {
        const v = applied.kwValue.toLowerCase();
        if (applied.kwType === '订单编号' && !o.id.includes(v)) return false;
        if (applied.kwType === '商品名称' && !o.productName.toLowerCase().includes(v)) return false;
        if (applied.kwType === '企业用户主体' && !o.company.toLowerCase().includes(v)) return false;
      }
      if (applied.dateType && (applied.dateFrom || applied.dateTo)) {
        const targetDate = getComparableDateValue(applied.dateType === '支付时间' ? o.payTime : o.finishTime);
        const fromDate = getComparableDateValue(applied.dateFrom);
        const toDate = getComparableDateValue(applied.dateTo, true);
        if (fromDate !== null && (targetDate === null || targetDate < fromDate)) return false;
        if (toDate !== null && (targetDate === null || targetDate > toDate)) return false;
      }
      if (applied.minAmt && o.totalAmount < Number(applied.minAmt)) return false;
      if (applied.maxAmt && o.totalAmount > Number(applied.maxAmt)) return false;
      return true;
    });
  }, [orders, applied]);

  const appliedFilterSummary = React.useMemo(() => {
    const summary = [];
    if (applied.kwType && applied.kwValue) summary.push(`${applied.kwType}：${applied.kwValue}`);
    if (applied.dateType && (applied.dateFrom || applied.dateTo)) summary.push(`${applied.dateType}：${applied.dateFrom || '开始'} ~ ${applied.dateTo || '结束'}`);
    if (applied.minAmt || applied.maxAmt) summary.push(`金额：${applied.minAmt || '不限'} ~ ${applied.maxAmt || '不限'}`);
    return summary;
  }, [applied]);

  const previewTotalPages = Math.max(1, Math.ceil(filtered.length / previewPageSize));

  React.useEffect(() => {
    setPreviewPage((prev) => Math.min(prev, previewTotalPages));
  }, [previewTotalPages]);

  const pagedOrders = React.useMemo(
    () => filtered.slice((previewPage - 1) * previewPageSize, previewPage * previewPageSize),
    [filtered, previewPage, previewPageSize]
  );

  const renderPreviewPageButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    if (previewTotalPages <= maxVisible) {
      for (let i = 1; i <= previewTotalPages; i += 1) buttons.push(i);
    } else {
      buttons.push(1);
      if (previewPage > 3) buttons.push('...');
      const start = Math.max(2, previewPage - 1);
      const end = Math.min(previewTotalPages - 1, previewPage + 1);
      for (let i = start; i <= end; i += 1) buttons.push(i);
      if (previewPage < previewTotalPages - 2) buttons.push('...');
      buttons.push(previewTotalPages);
    }

    return buttons;
  };

  const fmt2 = (v) => `¥${Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;

  return (
    <section className="page-card overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">筛选和表格预览</h2>
            <p className="mt-1 text-sm text-slate-500">先筛选订单，再按分页预览当前账款内的订单明细，减少一次性阅读负担。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">共 {filtered.length} 条预览订单</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">第 {previewPage} / {previewTotalPages} 页</span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-slate-400">筛选条件摘要</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {appliedFilterSummary.length > 0 ? (
                  appliedFilterSummary.map((item) => (
                    <span key={item} className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs text-blue-700">{item}</span>
                  ))
                ) : (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">当前未启用筛选，展示账款内全部订单</span>
                )}
              </div>
            </div>
            <div className="action-cluster xl:justify-end">
              <button onClick={handleQuery}
                className="inline-flex h-9 items-center justify-center rounded bg-blue-600 px-5 text-sm text-white transition-colors hover:bg-blue-700">
                查询
              </button>
              <button onClick={handleClear}
                className="inline-flex h-9 items-center justify-center rounded border border-slate-300 bg-white px-5 text-sm text-slate-600 transition-colors hover:bg-slate-50">
                清空
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-0">
            <div className="space-y-4 xl:pr-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">关键字定位</h3>
                <p className="mt-1 text-xs text-slate-500">按订单编号、商品名称或企业用户主体快速定位。</p>
              </div>
              <div className="space-y-2">
                <select
                  value={kwType}
                  onChange={e => setKwType(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">请选择关键字类型</option>
                  {KW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="请输入关键字"
                    value={kwValue}
                    onChange={e => setKwValue(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6 xl:border-t-0 xl:border-l xl:border-slate-100 xl:px-6 xl:pt-0">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">时间范围</h3>
                <p className="mt-1 text-xs text-slate-500">先选择时间字段，再限定起止日期。</p>
              </div>
              <div className="space-y-2">
                <select
                  value={dateType}
                  onChange={e => setDateType(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">请选择日期类型</option>
                  {DATE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] sm:items-center">
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                  <span className="hidden text-center text-sm text-slate-400 sm:block">~</span>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6 xl:border-t-0 xl:border-l xl:border-slate-100 xl:pl-6 xl:pt-0">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">金额范围</h3>
                <p className="mt-1 text-xs text-slate-500">限定订单总金额区间，缩小表格预览结果。</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] sm:items-center">
                <input type="number" placeholder="最低价格" value={minAmt} onChange={e => setMinAmt(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                <span className="hidden text-center text-sm text-slate-400 sm:block">~</span>
                <input type="number" placeholder="最高价格" value={maxAmt} onChange={e => setMaxAmt(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex items-center justify-end px-5 py-3 sm:px-6">
          <button className="flex items-center gap-1.5 text-sm border border-slate-300 text-slate-600 px-4 py-1.5 rounded hover:bg-slate-50 transition-colors">
            <Download size={14} />
            导出
          </button>
        </div>
        <div className="table-shell table-shell-dense">
          <table className="console-table console-table-dense w-full min-w-[1800px] whitespace-nowrap text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                {['订单编号', '商品图片', '商品名称', '订单总金额（含运费）', '实际成本价（含运费）', '服务费金额', '订单完成时间', '支付时间', '企业用户主体', '商城名称', '品牌&规格', '商品单价', '商品数量', '买家ID/手机'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-600 text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={15} className="text-center py-12 text-sm text-slate-400">暂无数据</td></tr>
              ) : pagedOrders.map((o, idx) => (
                <tr key={o.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-blue-600 font-medium whitespace-nowrap">{o.id}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 mx-auto flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 max-w-[200px]">{o.productName}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{fmt2(o.totalAmount)}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{fmt2(o.costAmount)}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{fmt2(o.feeAmount)}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">{o.finishTime}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500 whitespace-nowrap">{o.payTime}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{o.company}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{o.mallName}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700">{o.brandSpec}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{fmt2(o.unitPrice)}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-700 whitespace-nowrap">{o.qty}</td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">{o.buyerInfo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-xs text-slate-500">
            当前显示第 <span className="font-semibold text-slate-700">{previewPage}</span> 页，共 <span className="font-semibold text-slate-700">{filtered.length}</span> 条筛选结果。
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>每页</span>
              <select
                value={previewPageSize}
                onChange={(e) => {
                  setPreviewPageSize(Number(e.target.value));
                  setPreviewPage(1);
                }}
                className="h-8 rounded border border-slate-300 bg-white px-2 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>{size} 条</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <PageBtn onClick={() => setPreviewPage(1)} disabled={previewPage === 1}>
                <ChevronsLeft size={14} />
              </PageBtn>
              <PageBtn onClick={() => setPreviewPage((page) => Math.max(1, page - 1))} disabled={previewPage === 1}>
                <ChevronLeft size={14} />
              </PageBtn>
              {renderPreviewPageButtons().map((page, index) => (
                page === '...' ? (
                  <span key={`preview-ellipsis-${index}`} className="px-1.5 text-xs text-slate-400">...</span>
                ) : (
                  <PageBtn
                    key={`preview-${page}`}
                    active={page === previewPage}
                    onClick={() => setPreviewPage(page)}
                  >
                    {page}
                  </PageBtn>
                )
              ))}
              <PageBtn onClick={() => setPreviewPage((page) => Math.min(previewTotalPages, page + 1))} disabled={previewPage === previewTotalPages}>
                <ChevronRight size={14} />
              </PageBtn>
              <PageBtn onClick={() => setPreviewPage(previewTotalPages)} disabled={previewPage === previewTotalPages}>
                <ChevronsRight size={14} />
              </PageBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 小工具组件 ─────────────────────────── */

function ActionBtn({ label, icon, onClick, variant = 'default', disabled = false }) {
  const [tooltip, setTooltip] = React.useState(null); // { x, y }
  const base = 'flex items-center gap-1 text-xs px-3 py-1.5 rounded border transition-colors';
  const enabledStyle = 'border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer';
  const disabledStyle = 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50';

  const handleMouseEnter = (e) => {
    if (!disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  };
  const handleMouseLeave = () => setTooltip(null);

  return (
    <>
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${base} ${disabled ? disabledStyle : enabledStyle}`}
      >
        {icon}
        {label}
      </button>
      {tooltip && disabled && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
          }}
          className="whitespace-nowrap rounded bg-slate-700 px-2.5 py-1.5 text-xs text-white shadow-lg pointer-events-none"
        >
          请选中需要操作的对账单后再进行「{label}」操作
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
        </div>,
        document.body
      )}
    </>
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

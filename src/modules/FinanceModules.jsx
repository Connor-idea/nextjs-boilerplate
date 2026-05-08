import React, { useMemo, useState } from 'react';
import { AlertTriangle, Download, FileText, Plus, Receipt, RefreshCcw, Scale, Search, Wallet } from 'lucide-react';
import {
  channelCorrectionRows,
  channelStatementRows,
  customerCorrectionRows,
  employeeCorrectionRows,
  employeeStatementRows,
  settlementOrderRows,
  systemServiceFeeRows,
} from '../constants/uatSupplementData';

function Hero({ icon: Icon, title, description, actions }) {
  return (
    <section className="page-card overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <Icon size={14} />
              财务模块补全
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, detail, tone = 'text-slate-900' }) {
  return (
    <div className="page-card p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, tone = 'default' }) {
  const toneClassName = tone === 'primary'
    ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700';

  return (
    <button type="button" className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${toneClassName}`}>
      <Icon size={16} />
      {label}
    </button>
  );
}

function StatusBadge({ value }) {
  const toneClassName = value === '未核算'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : value === '已核算' || value === '订单已结算'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : value === '未读'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-slate-100 text-slate-600 border-slate-200';

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${toneClassName}`}>{value}</span>;
}

function FilterPanel({ children, onReset }) {
  return (
    <section className="page-card p-5 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>
        {onReset ? (
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
              <RefreshCcw size={16} />
              重置筛选
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TextFilter({ label, value, onChange, placeholder }) {
  return (
    <label className="text-sm text-slate-600">
      <span className="mb-2 block">{label}</span>
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100" placeholder={placeholder} />
      </div>
    </label>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="text-sm text-slate-600">
      <span className="mb-2 block">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TableCard({ minWidth = '960px', children }) {
  return (
    <section className="page-card p-5 sm:p-6">
      <div className="table-shell table-shell-dense overflow-hidden">
        <div style={{ minWidth }}>{children}</div>
      </div>
    </section>
  );
}

function formatMoney(value) {
  return typeof value === 'number' ? `¥${value.toLocaleString()}` : value;
}

export function SystemServiceFeeModule() {
  const [customerName, setCustomerName] = useState('');
  const [orderCode, setOrderCode] = useState('');

  const rows = useMemo(() => {
    return systemServiceFeeRows.filter((row) => {
      if (customerName && !row.customerName.toLowerCase().includes(customerName.toLowerCase())) return false;
      if (orderCode && !row.orderCode.toLowerCase().includes(orderCode.toLowerCase())) return false;
      return true;
    });
  }, [customerName, orderCode]);

  const metrics = useMemo(() => ({
    count: rows.length,
    totalAmount: rows.reduce((sum, row) => sum + row.amount, 0),
    invoiced: rows.filter((row) => row.invoiced).length,
    missingContract: rows.filter((row) => row.contractStatus === '暂无合同').length,
  }), [rows]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero
          icon={Receipt}
          title="系统服务费"
          description="参考 UAT 的系统服务费页补充订单检索、开票状态和分成详情入口，用当前项目风格统一表达收款凭证与合同状态。"
          actions={[
            <ActionButton key="add" icon={Plus} label="添加" tone="primary" />,
            <ActionButton key="export" icon={Download} label="导出清单" />,
          ]}
        />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="当前订单数" value={metrics.count} detail="按客户名与订单号筛选后结果" />
          <MetricCard label="订单金额汇总" value={formatMoney(metrics.totalAmount)} detail="系统服务费订单金额合计" tone="text-blue-600" />
          <MetricCard label="已开发票" value={metrics.invoiced} detail="已完成发票开具的订单数" tone="text-emerald-600" />
          <MetricCard label="缺合同订单" value={metrics.missingContract} detail="需要补齐合同附件的订单数" tone="text-amber-600" />
        </section>
        <FilterPanel onReset={() => { setCustomerName(''); setOrderCode(''); }}>
          <TextFilter label="客户名称" value={customerName} onChange={setCustomerName} placeholder="请输入客户名称" />
          <TextFilter label="订单编号" value={orderCode} onChange={setOrderCode} placeholder="请输入订单编号" />
        </FilterPanel>
        <TableCard minWidth="980px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">客户名称</th>
                <th className="px-4 py-3 font-semibold">订单编号</th>
                <th className="px-4 py-3 font-semibold">订单属性</th>
                <th className="px-4 py-3 font-semibold">收款凭证</th>
                <th className="px-4 py-3 font-semibold">合同</th>
                <th className="px-4 py-3 font-semibold">订单金额</th>
                <th className="px-4 py-3 font-semibold">是否已开发票</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.id}</td>
                  <td className="px-4 py-4 text-slate-700">{row.customerName}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderCode}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderType}</td>
                  <td className="px-4 py-4 text-slate-600">{row.receiptStatus}</td>
                  <td className="px-4 py-4 text-slate-600">{row.contractStatus}</td>
                  <td className="px-4 py-4 text-slate-700">{formatMoney(row.amount)}</td>
                  <td className="px-4 py-4"><StatusBadge value={row.invoiced ? '已核算' : '未核算'} /></td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">编辑</button>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">分成详情</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}

export function EmployeeStatementModule() {
  const [keyword, setKeyword] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('不限');
  const [payoutStatus, setPayoutStatus] = useState('不限');

  const rows = useMemo(() => {
    return employeeStatementRows.filter((row) => {
      if (keyword && !`${row.name}${row.month}`.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (employmentStatus !== '不限' && row.employmentStatus !== employmentStatus) return false;
      if (payoutStatus !== '不限' && row.payoutStatus !== payoutStatus) return false;
      return true;
    });
  }, [employmentStatus, keyword, payoutStatus]);

  const metrics = useMemo(() => ({
    count: rows.length,
    pending: rows.filter((row) => row.payoutStatus === '未核算').length,
    settled: rows.filter((row) => row.payoutStatus === '已核算').length,
    totalShare: rows.reduce((sum, row) => sum + Number(row.totalShare), 0),
  }), [rows]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={Wallet} title="员工对账单" description="对齐 UAT 的员工结算页，集中展示员工分成、核算状态、打款凭证与异常订单计数。" actions={[<ActionButton key="export" icon={Download} label="导出" />]} />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="结算记录数" value={metrics.count} detail="当前筛选下的员工对账单数量" />
          <MetricCard label="待核算" value={metrics.pending} detail="尚未完成核算的记录数" tone="text-amber-600" />
          <MetricCard label="已核算" value={metrics.settled} detail="可进入打款流程的记录数" tone="text-emerald-600" />
          <MetricCard label="累计总分成" value={formatMoney(metrics.totalShare)} detail="系统服务费与供应链分成合计" tone="text-blue-600" />
        </section>
        <FilterPanel onReset={() => { setKeyword(''); setEmploymentStatus('不限'); setPayoutStatus('不限'); }}>
          <TextFilter label="关键词" value={keyword} onChange={setKeyword} placeholder="员工姓名 / 结算月份" />
          <SelectFilter label="员工状态" value={employmentStatus} onChange={setEmploymentStatus} options={['不限', '在职', '离职']} />
          <SelectFilter label="打款状态" value={payoutStatus} onChange={setPayoutStatus} options={['不限', '未核算', '已核算']} />
        </FilterPanel>
        <TableCard minWidth="1180px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">员工名称</th>
                <th className="px-4 py-3 font-semibold">员工状态</th>
                <th className="px-4 py-3 font-semibold">结算月份</th>
                <th className="px-4 py-3 font-semibold">系统服务费分成</th>
                <th className="px-4 py-3 font-semibold">供应链分成</th>
                <th className="px-4 py-3 font-semibold">累计总分成</th>
                <th className="px-4 py-3 font-semibold">打款时间</th>
                <th className="px-4 py-3 font-semibold">打款状态</th>
                <th className="px-4 py-3 font-semibold">打款凭证</th>
                <th className="px-4 py-3 font-semibold">异常订单数量</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={`${row.name}-${row.month}`} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.name}</td>
                  <td className="px-4 py-4 text-slate-600">{row.employmentStatus}</td>
                  <td className="px-4 py-4 text-slate-600">{row.month}</td>
                  <td className="px-4 py-4 text-slate-700">{row.serviceFeeShare}</td>
                  <td className="px-4 py-4 text-slate-700">{row.supplyShare}</td>
                  <td className="px-4 py-4 text-slate-700">{row.totalShare}</td>
                  <td className="px-4 py-4 text-slate-600">{row.paidAt}</td>
                  <td className="px-4 py-4"><StatusBadge value={row.payoutStatus} /></td>
                  <td className="px-4 py-4 text-slate-600">{row.voucher}</td>
                  <td className="px-4 py-4 text-slate-700">{row.abnormalOrders}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">查看明细</button>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{row.payoutStatus === '已核算' ? '去打款' : '去核算'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}

export function EmployeeCorrectionModule() {
  const [orderCode, setOrderCode] = useState('');
  const [productName, setProductName] = useState('');
  const [orderType, setOrderType] = useState('全部');

  const rows = useMemo(() => {
    return employeeCorrectionRows.filter((row) => {
      if (orderCode && !row.orderCode.toLowerCase().includes(orderCode.toLowerCase())) return false;
      if (productName && !row.productName.toLowerCase().includes(productName.toLowerCase())) return false;
      if (orderType !== '全部' && row.orderType !== orderType) return false;
      return true;
    });
  }, [orderCode, orderType, productName]);

  const diffAmount = useMemo(() => rows.reduce((sum, row) => sum + (Number(row.correctedProfit) - Number(row.originalProfit)), 0), [rows]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={Scale} title="员工账单校正" description="按照 UAT 的校正申请结构补齐员工账单校正页，重点呈现原利润、校正后利润以及订单级明细。" />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard label="校正记录数" value={rows.length} detail="当前查询结果中的校正条目" />
          <MetricCard label="存在差异" value={rows.filter((row) => Number(row.originalProfit) !== Number(row.correctedProfit)).length} detail="原利润与校正后利润不一致" tone="text-amber-600" />
          <MetricCard label="利润变动" value={diffAmount.toFixed(2)} detail="校正前后利润差值汇总" tone={diffAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
        </section>
        <FilterPanel onReset={() => { setOrderCode(''); setProductName(''); setOrderType('全部'); }}>
          <TextFilter label="订单编号" value={orderCode} onChange={setOrderCode} placeholder="请输入订单编号" />
          <TextFilter label="商品名称" value={productName} onChange={setProductName} placeholder="请输入商品名称" />
          <SelectFilter label="订单类型" value={orderType} onChange={setOrderType} options={['全部', '产品销售', '系统服务费']} />
        </FilterPanel>
        <TableCard minWidth="1080px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">校对 ID</th>
                <th className="px-4 py-3 font-semibold">员工姓名</th>
                <th className="px-4 py-3 font-semibold">订单编号</th>
                <th className="px-4 py-3 font-semibold">订单类型</th>
                <th className="px-4 py-3 font-semibold">商品信息</th>
                <th className="px-4 py-3 font-semibold">订单金额</th>
                <th className="px-4 py-3 font-semibold">原利润</th>
                <th className="px-4 py-3 font-semibold">校正后利润</th>
                <th className="px-4 py-3 font-semibold">支付时间</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.id}</td>
                  <td className="px-4 py-4 text-slate-700">{row.employeeName}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderCode}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderType}</td>
                  <td className="px-4 py-4 text-slate-600">{row.productName}</td>
                  <td className="px-4 py-4 text-slate-700">{row.orderAmount}</td>
                  <td className="px-4 py-4 text-slate-700">{row.originalProfit}</td>
                  <td className={`px-4 py-4 font-medium ${Number(row.correctedProfit) !== Number(row.originalProfit) ? 'text-amber-600' : 'text-slate-700'}`}>{row.correctedProfit}</td>
                  <td className="px-4 py-4 text-slate-600">{row.paidAt}</td>
                  <td className="px-4 py-4"><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">查客户账单校对详情</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}

export function ChannelStatementModule() {
  const [keyword, setKeyword] = useState('');
  const [channelStatus, setChannelStatus] = useState('不限');
  const [payoutStatus, setPayoutStatus] = useState('不限');

  const rows = useMemo(() => {
    return channelStatementRows.filter((row) => {
      if (keyword && !`${row.channelName}${row.channelCode}`.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (channelStatus !== '不限' && row.channelStatus !== channelStatus) return false;
      if (payoutStatus !== '不限' && row.payoutStatus !== payoutStatus) return false;
      return true;
    });
  }, [channelStatus, keyword, payoutStatus]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={Wallet} title="渠道对账单" description="对齐 UAT 的渠道对账单页，统一查看渠道的系统服务费分成、供应链分成、核算状态和打款凭证。" actions={[<ActionButton key="export" icon={Download} label="导出" />]} />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <MetricCard label="结算渠道数" value={rows.length} detail="当前条件下的渠道结算记录" />
          <MetricCard label="待核算记录" value={rows.filter((row) => row.payoutStatus === '未核算').length} detail="尚未完成结算核算" tone="text-amber-600" />
          <MetricCard label="累计总分成" value={formatMoney(rows.reduce((sum, row) => sum + row.totalShare, 0))} detail="系统服务费与供应链分成合计" tone="text-blue-600" />
          <MetricCard label="异常订单数" value={rows.reduce((sum, row) => sum + row.abnormalOrders, 0)} detail="当前结果中的异常订单累计数" tone="text-rose-600" />
        </section>
        <FilterPanel onReset={() => { setKeyword(''); setChannelStatus('不限'); setPayoutStatus('不限'); }}>
          <TextFilter label="关键词" value={keyword} onChange={setKeyword} placeholder="渠道名称 / 渠道编号" />
          <SelectFilter label="渠道状态" value={channelStatus} onChange={setChannelStatus} options={['不限', '正常']} />
          <SelectFilter label="打款状态" value={payoutStatus} onChange={setPayoutStatus} options={['不限', '未核算', '已核算']} />
        </FilterPanel>
        <TableCard minWidth="1260px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">渠道名称</th>
                <th className="px-4 py-3 font-semibold">渠道编号</th>
                <th className="px-4 py-3 font-semibold">渠道状态</th>
                <th className="px-4 py-3 font-semibold">结算月份</th>
                <th className="px-4 py-3 font-semibold">系统服务费分成</th>
                <th className="px-4 py-3 font-semibold">供应链分成</th>
                <th className="px-4 py-3 font-semibold">累计总分成</th>
                <th className="px-4 py-3 font-semibold">打款时间</th>
                <th className="px-4 py-3 font-semibold">打款状态</th>
                <th className="px-4 py-3 font-semibold">打款凭证</th>
                <th className="px-4 py-3 font-semibold">异常订单数量</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={`${row.channelCode}-${row.month}`} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.channelName}</td>
                  <td className="px-4 py-4 text-slate-600">{row.channelCode}</td>
                  <td className="px-4 py-4 text-slate-600">{row.channelStatus}</td>
                  <td className="px-4 py-4 text-slate-600">{row.month}</td>
                  <td className="px-4 py-4 text-slate-700">{row.serviceFeeShare}</td>
                  <td className="px-4 py-4 text-slate-700">{row.supplyShare}</td>
                  <td className="px-4 py-4 text-slate-700">{row.totalShare}</td>
                  <td className="px-4 py-4 text-slate-600">{row.paidAt}</td>
                  <td className="px-4 py-4"><StatusBadge value={row.payoutStatus} /></td>
                  <td className="px-4 py-4 text-slate-600">{row.voucher}</td>
                  <td className="px-4 py-4 text-slate-700">{row.abnormalOrders}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">查看明细</button>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{row.payoutStatus === '已核算' ? '去打款' : '去核算'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}

export function ChannelCorrectionModule() {
  const [orderCode, setOrderCode] = useState('');
  const [productName, setProductName] = useState('');
  const [orderType, setOrderType] = useState('全部');

  const rows = useMemo(() => {
    return channelCorrectionRows.filter((row) => {
      if (orderCode && !row.orderCode.toLowerCase().includes(orderCode.toLowerCase())) return false;
      if (productName && !row.productName.toLowerCase().includes(productName.toLowerCase())) return false;
      if (orderType !== '全部' && row.orderType !== orderType) return false;
      return true;
    });
  }, [orderCode, orderType, productName]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={Scale} title="渠道账单校正" description="参考 UAT 的渠道账单校正页，补齐订单级校正流水和渠道提成调整明细。" />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard label="校正记录数" value={rows.length} detail="当前查询到的渠道校正条目" />
          <MetricCard label="利润变动记录" value={rows.filter((row) => Number(row.originalProfit) !== Number(row.correctedProfit)).length} detail="存在原利润与校正后利润差异" tone="text-amber-600" />
          <MetricCard label="渠道提成总额" value={formatMoney(rows.reduce((sum, row) => sum + row.correctedProfit, 0))} detail="按校正后渠道提成金额汇总" tone="text-blue-600" />
        </section>
        <FilterPanel onReset={() => { setOrderCode(''); setProductName(''); setOrderType('全部'); }}>
          <TextFilter label="订单编号" value={orderCode} onChange={setOrderCode} placeholder="请输入订单编号" />
          <TextFilter label="商品名称" value={productName} onChange={setProductName} placeholder="请输入商品名称" />
          <SelectFilter label="订单类型" value={orderType} onChange={setOrderType} options={['全部', '系统服务费']} />
        </FilterPanel>
        <TableCard minWidth="1080px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">校对 ID</th>
                <th className="px-4 py-3 font-semibold">渠道首联系人姓名</th>
                <th className="px-4 py-3 font-semibold">订单编号</th>
                <th className="px-4 py-3 font-semibold">订单类型</th>
                <th className="px-4 py-3 font-semibold">商品信息</th>
                <th className="px-4 py-3 font-semibold">订单金额</th>
                <th className="px-4 py-3 font-semibold">原利润</th>
                <th className="px-4 py-3 font-semibold">校正后利润</th>
                <th className="px-4 py-3 font-semibold">支付时间</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.id}</td>
                  <td className="px-4 py-4 text-slate-700">{row.contactName}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderCode}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderType}</td>
                  <td className="px-4 py-4 text-slate-600">{row.productName}</td>
                  <td className="px-4 py-4 text-slate-700">{row.orderAmount}</td>
                  <td className="px-4 py-4 text-slate-700">{row.originalProfit}</td>
                  <td className={`px-4 py-4 font-medium ${Number(row.originalProfit) !== Number(row.correctedProfit) ? 'text-amber-600' : 'text-slate-700'}`}>{row.correctedProfit}</td>
                  <td className="px-4 py-4 text-slate-600">{row.paidAt}</td>
                  <td className="px-4 py-4"><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">查渠道账单校对详情</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}

export function CustomerCorrectionModule() {
  const [orderCode, setOrderCode] = useState('');
  const [ownerInfo, setOwnerInfo] = useState('');
  const [productName, setProductName] = useState('');
  const [orderType, setOrderType] = useState('不限');

  const rows = useMemo(() => {
    return customerCorrectionRows.filter((row) => {
      if (orderCode && !row.orderCode.toLowerCase().includes(orderCode.toLowerCase())) return false;
      if (productName && !row.productName.toLowerCase().includes(productName.toLowerCase())) return false;
      if (ownerInfo && !`${row.channelPriority}${row.orderType}`.includes(ownerInfo)) return false;
      if (orderType !== '不限' && row.orderType !== orderType) return false;
      return true;
    });
  }, [orderCode, orderType, ownerInfo, productName]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={AlertTriangle} title="客户账单校正" description="参考 UAT 的客户账单校正页，聚焦客户订单的原靠铺分成与校正后分成信息，并保留优先渠道分成状态。" actions={[<ActionButton key="add" icon={Plus} label="添加" tone="primary" />]} />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="校正订单数" value={rows.length} detail="当前查询条件下的客户校正记录" />
          <MetricCard label="优先渠道开启" value={rows.filter((row) => row.channelPriority === '开启').length} detail="优先渠道分成状态为开启" tone="text-blue-600" />
          <MetricCard label="供应链订单" value={rows.filter((row) => row.orderType === '供应链订单').length} detail="涉及供应链分成的客户订单" tone="text-emerald-600" />
          <MetricCard label="系统服务费订单" value={rows.filter((row) => row.orderType === '系统服务费').length} detail="涉及系统服务费分成的客户订单" tone="text-amber-600" />
        </section>
        <FilterPanel onReset={() => { setOrderCode(''); setOwnerInfo(''); setProductName(''); setOrderType('不限'); }}>
          <TextFilter label="订单编号" value={orderCode} onChange={setOrderCode} placeholder="请输入订单编号" />
          <TextFilter label="负责人信息" value={ownerInfo} onChange={setOwnerInfo} placeholder="请输入负责人信息" />
          <TextFilter label="商品名称" value={productName} onChange={setProductName} placeholder="请输入商品名称" />
          <SelectFilter label="订单类型" value={orderType} onChange={setOrderType} options={['不限', '供应链订单', '系统服务费']} />
        </FilterPanel>
        <TableCard minWidth="1260px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">校对订单 ID</th>
                <th className="px-4 py-3 font-semibold">订单编号</th>
                <th className="px-4 py-3 font-semibold">商品信息</th>
                <th className="px-4 py-3 font-semibold">订单实付金额</th>
                <th className="px-4 py-3 font-semibold">订单类型</th>
                <th className="px-4 py-3 font-semibold">原分成基数</th>
                <th className="px-4 py-3 font-semibold">原分成金额</th>
                <th className="px-4 py-3 font-semibold">校正后分成基数</th>
                <th className="px-4 py-3 font-semibold">校正后分成金额</th>
                <th className="px-4 py-3 font-semibold">优先渠道分成状态</th>
                <th className="px-4 py-3 font-semibold">创建时间</th>
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.correctionId} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.correctionId}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderCode}</td>
                  <td className="px-4 py-4 text-slate-600">{row.productName}</td>
                  <td className="px-4 py-4 text-slate-700">{row.amount}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderType}</td>
                  <td className="px-4 py-4 text-slate-700">{row.originalBase}</td>
                  <td className="px-4 py-4 text-slate-700">{row.originalShare}</td>
                  <td className="px-4 py-4 text-slate-700">{row.correctedBase}</td>
                  <td className="px-4 py-4 text-slate-700">{row.correctedShare}</td>
                  <td className="px-4 py-4"><StatusBadge value={row.channelPriority} /></td>
                  <td className="px-4 py-4 text-slate-600">{row.createdAt}</td>
                  <td className="px-4 py-4"><button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">查看</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}

export function SettlementOrderModule() {
  const [orderCode, setOrderCode] = useState('');
  const [productName, setProductName] = useState('');

  const rows = useMemo(() => {
    return settlementOrderRows.filter((row) => {
      if (orderCode && !row.orderCode.toLowerCase().includes(orderCode.toLowerCase())) return false;
      if (productName && !row.productName.toLowerCase().includes(productName.toLowerCase())) return false;
      return true;
    });
  }, [orderCode, productName]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={FileText} title="结算订单列表" description="参考 UAT 的结算订单页，集中查看订单编号、商品信息、支付时间、结算时间和结算状态。" />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="结算订单数" value={rows.length} detail="当前筛选结果中的订单数量" />
          <MetricCard label="供应链订单" value={rows.filter((row) => row.orderType === '供应链订单').length} detail="供应链类已结算订单数量" tone="text-emerald-600" />
          <MetricCard label="系统服务费订单" value={rows.filter((row) => row.orderType === '系统服务费').length} detail="系统服务费类已结算订单数量" tone="text-blue-600" />
          <MetricCard label="订单金额汇总" value={formatMoney(rows.reduce((sum, row) => sum + row.amount, 0))} detail="当前结果的结算金额汇总" tone="text-slate-900" />
        </section>
        <FilterPanel onReset={() => { setOrderCode(''); setProductName(''); }}>
          <TextFilter label="订单编号" value={orderCode} onChange={setOrderCode} placeholder="请输入订单编号" />
          <TextFilter label="商品名称" value={productName} onChange={setProductName} placeholder="请输入商品名称" />
        </FilterPanel>
        <TableCard minWidth="980px">
          <table className="console-table console-table-dense w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">订单编号</th>
                <th className="px-4 py-3 font-semibold">商品信息</th>
                <th className="px-4 py-3 font-semibold">订单类型</th>
                <th className="px-4 py-3 font-semibold">订单金额</th>
                <th className="px-4 py-3 font-semibold">支付完成时间</th>
                <th className="px-4 py-3 font-semibold">结算完成时间</th>
                <th className="px-4 py-3 font-semibold">结算靠铺状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={`${row.orderCode}-${row.paidAt}`} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{row.orderCode}</td>
                  <td className="px-4 py-4 text-slate-600">{row.productName}</td>
                  <td className="px-4 py-4 text-slate-600">{row.orderType}</td>
                  <td className="px-4 py-4 text-slate-700">{row.amount}</td>
                  <td className="px-4 py-4 text-slate-600">{row.paidAt}</td>
                  <td className="px-4 py-4 text-slate-600">{row.settledAt}</td>
                  <td className="px-4 py-4"><StatusBadge value={row.settleStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
}
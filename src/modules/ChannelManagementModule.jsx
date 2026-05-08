import React, { useMemo, useState } from 'react';
import { Download, FolderKanban, Plus, RefreshCcw, Search } from 'lucide-react';
import { channelRows } from '../constants/uatSupplementData';

const CHANNEL_TABS = ['全部渠道', '我的渠道'];

const CHANNEL_STATUS_TONE = {
  经营中: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  待复核: 'bg-amber-50 text-amber-700 border-amber-200',
};

function MetricCard({ label, value, detail, tone }) {
  return (
    <div className="page-card p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${CHANNEL_STATUS_TONE[value] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {value}
    </span>
  );
}

export default function ChannelManagementModule() {
  const [activeTab, setActiveTab] = useState('全部渠道');
  const [keyword, setKeyword] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('经营中');

  const visibleRows = useMemo(() => {
    return channelRows.filter((row) => {
      if (activeTab !== '全部渠道' && row.scope !== activeTab) {
        return false;
      }

      if (keyword && !`${row.shortName}${row.accountName}${row.contact}${row.phone}`.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }

      if (owner && !row.owner.includes(owner)) {
        return false;
      }

      if (status !== '不限' && row.status !== status) {
        return false;
      }

      return true;
    });
  }, [activeTab, keyword, owner, status]);

  const metrics = useMemo(() => {
    const totalCustomers = visibleRows.reduce((sum, row) => sum + row.customerCount, 0);
    const totalAmount = visibleRows.reduce((sum, row) => sum + row.customerAmount, 0);
    const contractsReady = visibleRows.filter((row) => row.attachment === '下载' || row.attachment === '已归档').length;

    return {
      channels: visibleRows.length,
      totalCustomers,
      totalAmount,
      contractsReady,
    };
  }, [visibleRows]);

  const handleReset = () => {
    setKeyword('');
    setOwner('');
    setStatus('经营中');
  };

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <FolderKanban size={14} />
                  渠道主数据
                </div>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">全部渠道</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  参考 UAT 的渠道管理页补充当前项目缺失内容，支持按渠道名称、负责人和状态查询，并统一查看渠道引进客户数、成交额、合同附件和当前经营状态。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                  <Plus size={16} />
                  添加渠道
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                  <Download size={16} />
                  导出
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
            <MetricCard label="当前渠道数" value={metrics.channels} detail="当前页签与筛选结果" tone="text-slate-900" />
            <MetricCard label="引进客户总数" value={metrics.totalCustomers} detail="来自渠道带来的成交客户" tone="text-emerald-600" />
            <MetricCard label="累计客户金额" value={`¥${metrics.totalAmount.toLocaleString()}`} detail="按引进成交客户金额聚合" tone="text-blue-600" />
            <MetricCard label="已归档合同" value={metrics.contractsReady} detail="合同或附件已具备下载条件" tone="text-amber-600" />
          </div>
        </section>

        <section className="page-card p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {CHANNEL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm text-slate-600 xl:col-span-2">
                <span className="mb-2 block">关键词</span>
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" placeholder="渠道编号 / 渠道名称 / 联系人 / 手机号" />
                </div>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">渠道主负责人</span>
                <input value={owner} onChange={(event) => setOwner(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" placeholder="请输入渠道主负责人" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">渠道状态</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100">
                  {['经营中', '待复核', '不限'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                <RefreshCcw size={16} />
                重置筛选
              </button>
            </div>
          </div>

          <div className="table-shell mt-5 overflow-hidden">
            <table className="console-table min-w-[1180px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">渠道简称</th>
                  <th className="px-4 py-3 font-semibold">账号名</th>
                  <th className="px-4 py-3 font-semibold">渠道主负责人</th>
                  <th className="px-4 py-3 font-semibold">成交客户数</th>
                  <th className="px-4 py-3 font-semibold">成交客户金额</th>
                  <th className="px-4 py-3 font-semibold">联系人</th>
                  <th className="px-4 py-3 font-semibold">手机</th>
                  <th className="px-4 py-3 font-semibold">合同附件</th>
                  <th className="px-4 py-3 font-semibold">渠道状态</th>
                  <th className="px-4 py-3 font-semibold">创建时间</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-semibold text-slate-800">{row.shortName}</td>
                    <td className="px-4 py-4 text-slate-600">{row.accountName}</td>
                    <td className="px-4 py-4 text-slate-700">{row.owner}</td>
                    <td className="px-4 py-4 text-slate-700">{row.customerCount}</td>
                    <td className="px-4 py-4 text-slate-700">¥{row.customerAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-700">{row.contact}</td>
                    <td className="px-4 py-4 text-slate-600">{row.phone}</td>
                    <td className="px-4 py-4 text-slate-600">{row.attachment}</td>
                    <td className="px-4 py-4"><StatusBadge value={row.status} /></td>
                    <td className="px-4 py-4 text-slate-600">{row.createdAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {['编辑', '删除'].map((action) => (
                          <button key={action} type="button" className="console-table-action console-table-action-primary">
                            {action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
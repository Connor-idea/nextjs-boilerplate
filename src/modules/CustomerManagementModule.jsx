import React, { useMemo, useState } from 'react';
import { Building2, Download, Filter, FolderInput, LifeBuoy, RefreshCcw, Search, Shuffle, UserPlus } from 'lucide-react';

const CUSTOMER_TABS = ['全部客户', '我的客户', '团队客户', '协同客户', '团队协同'];

const CUSTOMER_ROWS = [
  {
    id: 'KH-2026-001',
    tab: '全部客户',
    shortName: '靠铺科技',
    status: '合作中',
    star: '五星',
    contact: '赵乐',
    phone: '13800138001',
    untrackedDays: 0,
    expireAt: '2026-11-30',
    owner: '樊世豪',
    intentStatus: '有意向且有订单',
    region: '华东',
    industry: '企业服务',
    size: '中型企业',
    publicSea: '不属于',
  },
  {
    id: 'KH-2026-002',
    tab: '我的客户',
    shortName: '云杉制造',
    status: '合作中',
    star: '四星',
    contact: '林晓',
    phone: '13800138002',
    untrackedDays: 3,
    expireAt: '2026-08-12',
    owner: '张三',
    intentStatus: '有意向未成交',
    region: '华北',
    industry: '智能制造',
    size: '大型企业',
    publicSea: '不属于',
  },
  {
    id: 'KH-2026-003',
    tab: '团队客户',
    shortName: '极光零售',
    status: '待激活',
    star: '三星',
    contact: '孙琦',
    phone: '13800138003',
    untrackedDays: 7,
    expireAt: '2026-06-25',
    owner: '李四',
    intentStatus: '有意向未成交',
    region: '华南',
    industry: '零售餐饮',
    size: '成长型企业',
    publicSea: '不属于',
  },
  {
    id: 'KH-2026-004',
    tab: '协同客户',
    shortName: '星链物流',
    status: '预警中',
    star: '二星',
    contact: '王诗语',
    phone: '13800138004',
    untrackedDays: 14,
    expireAt: '2026-05-30',
    owner: '王五',
    intentStatus: '无意向流失',
    region: '西南',
    industry: '物流运输',
    size: '中型企业',
    publicSea: '属于',
  },
  {
    id: 'KH-2026-005',
    tab: '团队协同',
    shortName: '山海教育',
    status: '合作中',
    star: '四星',
    contact: '吴优',
    phone: '13800138005',
    untrackedDays: 1,
    expireAt: '2026-12-18',
    owner: '孙琦',
    intentStatus: '有意向且有订单',
    region: '华中',
    industry: '教育培训',
    size: '中型企业',
    publicSea: '不属于',
  },
  {
    id: 'KH-2026-006',
    tab: '全部客户',
    shortName: '盛景传媒',
    status: '沉默期',
    star: '一星',
    contact: '周杰',
    phone: '13800138006',
    untrackedDays: 21,
    expireAt: '2026-05-18',
    owner: '赵六',
    intentStatus: '无意向流失',
    region: '华东',
    industry: '广告传媒',
    size: '小微企业',
    publicSea: '属于',
  },
  {
    id: 'KH-2026-007',
    tab: '我的客户',
    shortName: '微光医疗',
    status: '合作中',
    star: '五星',
    contact: '钱伟',
    phone: '13800138007',
    untrackedDays: 2,
    expireAt: '2027-01-06',
    owner: '张三',
    intentStatus: '有意向且有订单',
    region: '华东',
    industry: '医疗健康',
    size: '大型企业',
    publicSea: '不属于',
  },
];

const STATUS_TONE = {
  合作中: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  待激活: 'bg-amber-50 text-amber-700 border-amber-200',
  预警中: 'bg-rose-50 text-rose-700 border-rose-200',
  沉默期: 'bg-slate-100 text-slate-600 border-slate-200',
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

function ToolbarButton({ icon: Icon, label }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function CustomerStatus({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_TONE[value] || STATUS_TONE['沉默期']}`}>
      {value}
    </span>
  );
}

export default function CustomerManagementModule() {
  const [activeTab, setActiveTab] = useState('全部客户');
  const [keyword, setKeyword] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('不限');
  const [star, setStar] = useState('不限');
  const [intentStatus, setIntentStatus] = useState('不限');
  const [region, setRegion] = useState('不限');
  const [industry, setIndustry] = useState('不限');
  const [size, setSize] = useState('不限');
  const [publicSea, setPublicSea] = useState('不属于');

  const visibleRows = useMemo(() => {
    return CUSTOMER_ROWS.filter((row) => {
      if (activeTab !== '全部客户' && row.tab !== activeTab) {
        return false;
      }

      if (keyword && !`${row.shortName}${row.contact}${row.phone}`.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }

      if (owner && !row.owner.includes(owner)) {
        return false;
      }

      if (status !== '不限' && row.status !== status) {
        return false;
      }

      if (star !== '不限' && row.star !== star) {
        return false;
      }

      if (intentStatus !== '不限' && row.intentStatus !== intentStatus) {
        return false;
      }

      if (region !== '不限' && row.region !== region) {
        return false;
      }

      if (industry !== '不限' && row.industry !== industry) {
        return false;
      }

      if (size !== '不限' && row.size !== size) {
        return false;
      }

      if (publicSea !== '不限' && row.publicSea !== publicSea) {
        return false;
      }

      return true;
    });
  }, [activeTab, industry, intentStatus, keyword, owner, publicSea, region, size, star, status]);

  const metrics = useMemo(() => {
    const inCooperation = visibleRows.filter((item) => item.status === '合作中').length;
    const overdue = visibleRows.filter((item) => item.untrackedDays >= 7).length;
    const inPublicSea = visibleRows.filter((item) => item.publicSea === '属于').length;

    return {
      total: visibleRows.length,
      inCooperation,
      overdue,
      inPublicSea,
    };
  }, [visibleRows]);

  const handleReset = () => {
    setKeyword('');
    setOwner('');
    setStatus('不限');
    setStar('不限');
    setIntentStatus('不限');
    setRegion('不限');
    setIndustry('不限');
    setSize('不限');
    setPublicSea('不属于');
  };

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <Building2 size={14} />
                  UAT 对齐模块
                </div>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">客户列表</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  参考 UAT 的全部客户页补充当前项目缺失内容，保留现有 CRM 的卡片化风格，并提供客户状态、意向、区域、行业、企业规格和公海归属等多维筛选。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ToolbarButton icon={UserPlus} label="添加客户" />
                <ToolbarButton icon={LifeBuoy} label="移入公海" />
                <ToolbarButton icon={Shuffle} label="转移客户" />
                <ToolbarButton icon={Download} label="导出" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
            <MetricCard label="当前视图客户数" value={metrics.total} detail="已按当前页签和筛选器收敛" tone="text-slate-900" />
            <MetricCard label="合作中客户" value={metrics.inCooperation} detail="处于活跃协作周期" tone="text-emerald-600" />
            <MetricCard label="待重点跟进" value={metrics.overdue} detail="未跟进天数大于等于 7 天" tone="text-amber-600" />
            <MetricCard label="公海客户" value={metrics.inPublicSea} detail="当前筛选结果中的公海归属数量" tone="text-blue-600" />
          </div>
        </section>

        <section className="page-card p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {CUSTOMER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter size={16} />
              多维筛选
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">关键词</span>
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100" placeholder="客户名称 / 联系人 / 手机号" />
                </div>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">客户主负责人</span>
                <input value={owner} onChange={(event) => setOwner(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100" placeholder="请输入客户主负责人" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">客户状态</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '合作中', '待激活', '预警中', '沉默期'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">客户星级</span>
                <select value={star} onChange={(event) => setStar(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '五星', '四星', '三星', '二星', '一星'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">客户意向状态</span>
                <select value={intentStatus} onChange={(event) => setIntentStatus(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '有意向未成交', '有意向且有订单', '无意向流失'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">所属区域</span>
                <select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '华东', '华北', '华南', '华中', '西南'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">所属行业</span>
                <select value={industry} onChange={(event) => setIndustry(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '企业服务', '智能制造', '零售餐饮', '物流运输', '医疗健康', '广告传媒', '教育培训'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-2 block">企业规格</span>
                <select value={size} onChange={(event) => setSize(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '大型企业', '中型企业', '成长型企业', '小微企业'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <label className="text-sm text-slate-600 sm:w-56">
                <span className="mb-2 block">公海客户</span>
                <select value={publicSea} onChange={(event) => setPublicSea(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  {['不限', '不属于', '属于'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <button type="button" onClick={handleReset} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                <RefreshCcw size={16} />
                重置筛选
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
            <span>共 {visibleRows.length} 条客户记录</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <FolderInput size={14} />
              当前页签：{activeTab}
            </span>
          </div>

          <div className="table-shell mt-4 overflow-hidden">
            <table className="console-table min-w-[1120px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">客户简称</th>
                  <th className="px-4 py-3 font-semibold">客户状态</th>
                  <th className="px-4 py-3 font-semibold">客户星级</th>
                  <th className="px-4 py-3 font-semibold">首联系人</th>
                  <th className="px-4 py-3 font-semibold">手机号码</th>
                  <th className="px-4 py-3 font-semibold">未跟进天数</th>
                  <th className="px-4 py-3 font-semibold">系统到期时间</th>
                  <th className="px-4 py-3 font-semibold">主负责人</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-semibold text-slate-800">{row.shortName}</td>
                    <td className="px-4 py-4"><CustomerStatus value={row.status} /></td>
                    <td className="px-4 py-4 text-slate-600">{row.star}</td>
                    <td className="px-4 py-4 text-slate-700">{row.contact}</td>
                    <td className="px-4 py-4 text-slate-600">{row.phone}</td>
                    <td className={`px-4 py-4 font-medium ${row.untrackedDays >= 7 ? 'text-rose-600' : 'text-slate-700'}`}>{row.untrackedDays}</td>
                    <td className="px-4 py-4 text-slate-600">{row.expireAt}</td>
                    <td className="px-4 py-4 text-slate-700">{row.owner}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {['跟进', '编辑', '删除'].map((action) => (
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
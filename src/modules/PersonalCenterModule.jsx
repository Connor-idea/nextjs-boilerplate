import React, { useMemo, useState } from 'react';
import { BellRing, CreditCard, KeyRound, Save, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { bankAccountRows, messageRows } from '../constants/uatSupplementData';

const PERSONAL_TABS = ['基础资料', '消息列表', '收款信息'];

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default function PersonalCenterModule() {
  const notifications = useSelector((state) => state.ui.notifications);
  const [activeTab, setActiveTab] = useState('基础资料');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [bankForm, setBankForm] = useState({ accountName: '', accountNumber: '', bankName: '' });
  const [messageStatus, setMessageStatus] = useState('全部消息');
  const [messageType, setMessageType] = useState('全部');

  const mergedMessages = useMemo(() => {
    const realtimeMessages = notifications.map((item) => ({
      id: `rt-${item.id}`,
      title: `【系统通知】${item.title}`,
      businessType: '系统广播',
      receivedAt: item.time,
      status: item.unread ? '未读' : '已读',
    }));

    return [...realtimeMessages, ...messageRows];
  }, [notifications]);

  const visibleMessages = useMemo(() => {
    return mergedMessages.filter((item) => {
      if (messageStatus === '未读消息' && item.status !== '未读') return false;
      if (messageStatus === '已读消息' && item.status !== '已读') return false;
      if (messageType !== '全部' && item.businessType !== messageType) return false;
      return true;
    });
  }, [mergedMessages, messageStatus, messageType]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <ShieldCheck size={14} />
                  账号与通知中心
                </div>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">个人中心</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  以当前项目风格整合 UAT 的基础资料、消息列表和收款信息，方便统一管理账号安全、待办通知与财务收款账户。
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center text-sm">
                <div>
                  <p className="text-xs text-slate-500">安全提醒</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{passwordForm.newPassword ? '待保存' : '正常'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">消息总数</p>
                  <p className="mt-2 text-xl font-bold text-blue-600">{mergedMessages.length}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">收款账户</p>
                  <p className="mt-2 text-xl font-bold text-emerald-600">{bankAccountRows.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {PERSONAL_TABS.map((tab) => (
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
          </div>
        </section>

        {activeTab === '基础资料' && (
          <section className="page-card p-5 sm:p-6">
            <SectionTitle icon={KeyRound} title="修改密码" description="参考 UAT 的基础资料页，保留最核心的密码修改结构，并补充安全提示。" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid grid-cols-1 gap-4">
                  <label className="text-sm text-slate-600">
                    <span className="mb-2 block">原密码</span>
                    <input type="password" value={passwordForm.oldPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, oldPassword: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="请输入原密码" />
                  </label>
                  <label className="text-sm text-slate-600">
                    <span className="mb-2 block">设置新密码</span>
                    <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="请设置新密码" />
                  </label>
                  <label className="text-sm text-slate-600">
                    <span className="mb-2 block">确认密码</span>
                    <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="请确认新密码" />
                  </label>
                </div>
                <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                  <Save size={16} />
                  保存
                </button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">密码安全建议</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {[
                    '至少使用 8 位以上密码，并混合大小写字母、数字和符号。',
                    '不要与渠道后台、客户系统或个人邮箱复用同一组密码。',
                    '出现负责人离职、权限调整或共享账号时应立即更新密码。',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === '消息列表' && (
          <section className="page-card p-5 sm:p-6">
            <SectionTitle icon={BellRing} title="消息列表" description="整合当前项目实时通知与 UAT 的业务待办消息，支持按状态和业务类型快速筛选。" />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap gap-2">
                {['全部消息', '未读消息', '已读消息'].map((item) => (
                  <button key={item} type="button" onClick={() => setMessageStatus(item)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${messageStatus === item ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px_auto]">
                <label className="text-sm text-slate-600">
                  <span className="mb-2 block">业务类型</span>
                  <select value={messageType} onChange={(event) => setMessageType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200">
                    {['全部', '主负责人离职', '服务费到期', '系统广播'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  当前显示 <span className="font-semibold text-slate-900">{visibleMessages.length}</span> 条消息
                </div>
              </div>
            </div>
            <div className="table-shell mt-5 overflow-hidden">
              <table className="console-table min-w-[920px]">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">消息标题</th>
                    <th className="px-4 py-3 font-semibold">业务类型</th>
                    <th className="px-4 py-3 font-semibold">接收时间</th>
                    <th className="px-4 py-3 font-semibold">状态</th>
                    <th className="px-4 py-3 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-4 font-medium text-slate-800">{message.title}</td>
                      <td className="px-4 py-4 text-slate-600">{message.businessType}</td>
                      <td className="px-4 py-4 text-slate-600">{message.receivedAt}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${message.status === '未读' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button type="button" className="console-table-action">
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === '收款信息' && (
          <section className="page-card p-5 sm:p-6">
            <SectionTitle icon={CreditCard} title="收款信息" description="参考 UAT 的银行卡维护页，支持新增收款账户，并展示当前保存的默认打款账户。" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid grid-cols-1 gap-4">
                  <label className="text-sm text-slate-600">
                    <span className="mb-2 block">姓名</span>
                    <input value={bankForm.accountName} onChange={(event) => setBankForm((current) => ({ ...current, accountName: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="请输入银行卡姓名" />
                  </label>
                  <label className="text-sm text-slate-600">
                    <span className="mb-2 block">银行卡账号</span>
                    <input value={bankForm.accountNumber} onChange={(event) => setBankForm((current) => ({ ...current, accountNumber: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="请输入银行卡账号" />
                  </label>
                  <label className="text-sm text-slate-600">
                    <span className="mb-2 block">开户行</span>
                    <input value={bankForm.bankName} onChange={(event) => setBankForm((current) => ({ ...current, bankName: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="请输入开户行" />
                  </label>
                </div>
                <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                  <Save size={16} />
                  保存
                </button>
              </div>
              <div className="space-y-4">
                {bankAccountRows.map((row) => (
                  <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{row.bankName}</p>
                        <p className="mt-2 text-sm text-slate-600">{row.accountName}</p>
                        <p className="mt-1 font-mono text-sm text-slate-500">{row.accountNumber}</p>
                      </div>
                      {row.isDefault && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">默认账户</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
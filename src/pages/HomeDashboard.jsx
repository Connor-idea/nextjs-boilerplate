import React, { useMemo } from 'react';
import { Activity, BellRing, CircleDot, RefreshCw, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { summarizeDashboardMetrics } from '../lib/crmAdapters';

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="page-card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  const leads = useSelector((state) => state.crm.leads);
  const supplierBills = useSelector((state) => state.crm.supplierBills);
  const notifications = useSelector((state) => state.ui.notifications);
  const connectionStatus = useSelector((state) => state.ui.connectionStatus);
  const syncStatus = useSelector((state) => state.crm.syncStatus);
  const metrics = useMemo(() => summarizeDashboardMetrics(leads, supplierBills, notifications), [leads, supplierBills, notifications]);

  const statusTone = connectionStatus === 'connected'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : connectionStatus === 'connecting'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-rose-200 bg-rose-50 text-rose-700';

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">REALTIME CRM</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900">前后端闭环总览</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  当前工作台已经切到 React Router + Redux 的统一编排层，销售线索、AI 分配、AI 推客和供应商对账会通过 NestJS API 与 WebSocket 实时同步。
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-xs font-medium ${statusTone}`}>
                <CircleDot size={12} />
                连接状态：{connectionStatus}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
            <StatCard icon={Users} label="线索总量" value={metrics.totalLeads} tone="bg-blue-50 text-blue-600" />
            <StatCard icon={Activity} label="待跟进线索" value={metrics.pendingFollowUps} tone="bg-orange-50 text-orange-600" />
            <StatCard icon={RefreshCw} label="供应商账款" value={metrics.supplierBills} tone="bg-emerald-50 text-emerald-600" />
            <StatCard icon={BellRing} label="未读通知" value={metrics.unreadNotifications} tone="bg-violet-50 text-violet-600" />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="page-card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-800">当前业务闭环</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                '线索列表在前端模块内处理后，会先写入 Redux，再同步到 NestJS 内存态。',
                'AI 智能分配确认后，后端统一回写负责人、分配日志和系统通知。',
                'AI 推客处理结果会把 trackStatus、跟进历史和公司备注回写到同一条线索。',
                '画像页读取的是后端派生后的团队画像，不再是纯前端死数据。',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="page-card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-800">同步状态</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-800">前端编排</p>
                <p className="mt-2">React Router 驱动模块导航，Redux 维护共享业务状态。</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-800">后端同步</p>
                <p className="mt-2">最近一次同步状态：{syncStatus}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-800">实时推送</p>
                <p className="mt-2">Socket 已用于推送全量业务状态更新与通知增量。</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
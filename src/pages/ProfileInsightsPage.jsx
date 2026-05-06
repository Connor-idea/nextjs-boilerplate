import React from 'react';
import { Briefcase, CircleDot, TrendingUp, UserCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';

function ProfileCard({ profile }) {
  const momentumTone = profile.momentum === 'busy'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : profile.momentum === 'ready'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className="page-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{profile.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{profile.role}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${momentumTone}`}>
          <CircleDot size={12} />
          {profile.momentumLabel}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
          <p className="text-slate-500">当前跟进</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{profile.openLeads}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
          <p className="text-slate-500">已完成</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{profile.completedTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
          <p className="text-slate-500">高分线索</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{profile.highValueLeads}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
          <p className="text-slate-500">平均分</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{profile.avgScore}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <Briefcase size={16} className="mt-0.5 text-slate-400" />
          <span>{profile.industries.join('、') || '暂无行业偏好'}</span>
        </div>
        <div className="flex items-start gap-2">
          <TrendingUp size={16} className="mt-0.5 text-slate-400" />
          <span>{profile.insight}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfileInsightsPage() {
  const profiles = useSelector((state) => state.crm.profiles);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <UserCircle2 size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">实时销售画像</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                这里展示的是后端基于最新线索归属、跟进状态和高分线索分布实时派生的团队画像，而不是静态原型数据。
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </section>
      </div>
    </div>
  );
}
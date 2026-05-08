import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  AlertCircle,
  BellRing,
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Filter,
  History,
  Megaphone,
  Mic,
  PencilLine,
  RefreshCw,
  Save,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPathForModule } from '../app/moduleRegistry';
import {
  COMMISSION_MONTH_OPTIONS,
  COMMISSION_PREVIEW_ROWS,
  COMMISSION_RULE_DEFAULTS,
  COMMISSION_SUMMARY_ROWS,
  DAILY_REPORT_HISTORY_ROWS,
  DAILY_REPORT_TEMPLATES,
  PERSONAL_DASHBOARD_DATA,
  REMINDER_RULE_DEFAULTS,
  TEAM_DASHBOARD_DATA,
  WEEKLY_REPORT_SUMMARIES,
} from '../constants/roleWorkbenchData';
import {
  canAccessTeamDashboard,
  canAuditCommission,
  canEditCommissionRules,
  canViewAllReports,
  canViewOtherReports,
  getAccessibleMemberNames,
  getLeadOwnerNameForRole,
  getRoleMeta,
  getRoleType,
  getTeamScopeForRole,
  getTeamScopeLabel,
  getTeamScopeOptionsForRole,
} from '../constants/roles';

const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

function formatPercent(value) {
  return `${value}%`;
}

function resolveTargetPath(target) {
  switch (target) {
    case 'leads':
      return getPathForModule('leads');
    case 'customer':
      return getPathForModule('customer');
    case 'team-dashboard':
      return getPathForModule('home-team-dashboard');
    default:
      return getPathForModule('home');
  }
}

function ProgressBar({ value, toneClassName = 'bg-console-primary' }) {
  return (
    <div className="h-2 rounded-full bg-console-surface-muted">
      <div className={`h-2 rounded-full ${toneClassName}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function SectionIntro({ eyebrow, title, description, actions }) {
  return (
    <section className="page-card overflow-hidden">
      <div className="border-b border-console-border px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {eyebrow ? <p className="text-xs font-semibold tracking-[0.12em] text-console-subtle">{eyebrow}</p> : null}
            <h1 className="mt-2 text-[22px] font-semibold text-console-text">{title}</h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-console-muted">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, unit, tone = 'text-slate-900' }) {
  return (
    <div className="console-summary-card">
      <p className="text-xs font-medium tracking-[0.12em] text-console-muted">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className={`text-2xl font-semibold ${tone}`}>{value}</span>
        <span className="pb-1 text-sm text-console-muted">{unit}</span>
      </div>
    </div>
  );
}

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function BriefingMetricCard({ icon: Icon, label, value, toneClassName }) {
  return (
    <div className="console-summary-card">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-console ${toneClassName}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-console-text">{value}</p>
          <p className="mt-1 text-sm text-console-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

function GoalProgressCard({ metricLabel, targetValue, achievedValue, progressValue }) {
  const clampedProgress = clampPercent(progressValue);
  const size = 132;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - ((clampedProgress || 0) / 100) * circumference;

  return (
    <section className="page-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-console-text">业绩目标</h2>
          <p className="mt-1 text-sm text-console-muted">{metricLabel}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-console-muted">
          <span>公司目标</span>
          <div className="console-chip shadow-console">
            <CalendarDays size={12} />
            2026-05
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative flex h-[132px] w-[132px] shrink-0 items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e6eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#4286fd"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-semibold text-console-primary">{Math.round(clampedProgress)}%</p>
            <p className="mt-1 text-sm text-console-muted">完成度</p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 text-sm text-console-muted sm:grid-cols-2">
          <div>
            <p>目标值</p>
            <p className="mt-2 text-xl font-semibold text-console-text">{targetValue}</p>
          </div>
          <div>
            <p>完成值</p>
            <p className="mt-2 text-xl font-semibold text-console-text">{achievedValue}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RankingChartCard({ rows }) {
  const maxAmount = Math.max(...rows.map((item) => item.achievedAmount), 1);
  const maxCustomers = Math.max(...rows.map((item) => item.newCustomers), 1);

  return (
    <section className="page-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-console-text">业绩排行</h2>
          <p className="mt-1 text-sm text-console-muted">按本月系统成交金额与新增客户数查看当前个人排行。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-4 text-xs text-console-muted sm:flex">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-5 rounded-full bg-console-warning" />
              系统成交金额（元）
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-5 rounded-full bg-console-primary" />
              新增客户数
            </span>
          </div>
          <div className="console-chip shadow-console">
            <span>个人排行</span>
            <span className="inline-flex items-center gap-2 border-l border-console-border pl-3">
              <CalendarDays size={12} />
              2026-05
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-console border border-console-border bg-console-surface-alt px-4 py-5">
        <div className="relative h-[340px]">
          <div className="absolute inset-0 flex flex-col justify-between text-xs text-console-neutral">
            {[0, 1, 2, 3, 4, 5].map((line) => (
              <div key={line} className="border-t border-console-border" />
            ))}
          </div>
          <div className="absolute inset-x-2 bottom-0 top-4 flex items-end justify-around gap-3 overflow-x-auto pb-14">
            {rows.map((item) => (
              <div key={item.name} className="flex min-w-[84px] flex-1 flex-col items-center justify-end gap-3">
                <div className="flex h-full items-end gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] text-console-muted">{formatCurrency(item.achievedAmount)}</span>
                    <div
                      className="w-5 rounded-t-2xl bg-console-warning"
                      style={{ height: `${Math.max(16, (item.achievedAmount / maxAmount) * 180)}px` }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] text-console-muted">{item.newCustomers}</span>
                    <div
                      className="w-5 rounded-t-2xl bg-console-primary"
                      style={{ height: `${Math.max(16, (item.newCustomers / maxCustomers) * 140)}px` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-console-text">{item.name}</p>
                  <p className="mt-1 text-xs text-console-muted">{item.roleLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function statusClassName(value) {
  if (value === '已发放' || value === '已提交' || value === '已生成') {
    return 'bg-console-success-soft text-console-success';
  }
  if (value === '未生成' || value === '未提交' || value === '待发放') {
    return 'bg-console-warning-soft text-console-warning';
  }
  if (value === '优秀') {
    return 'bg-console-success-soft text-console-success';
  }
  if (value === '关注') {
    return 'bg-console-danger-soft text-console-danger';
  }

  return 'bg-console-surface-muted text-console-muted';
}

export function PersonalDashboardModule({ userRole }) {
  const navigate = useNavigate();
  const roleMeta = getRoleMeta(userRole);
  const roleType = getRoleType(userRole);
  const personalData = PERSONAL_DASHBOARD_DATA[roleMeta.accountName] || PERSONAL_DASHBOARD_DATA.admin;
  const teamScopeKey = roleType === 'super-admin' ? 'all' : getTeamScopeForRole(userRole);
  const teamScopeData = TEAM_DASHBOARD_DATA[teamScopeKey] || TEAM_DASHBOARD_DATA.all;
  const [briefingRange, setBriefingRange] = useState('7d');
  const totalTodos = useMemo(
    () => personalData.todoGroups.reduce((count, group) => count + group.items.length, 0),
    [personalData.todoGroups],
  );
  const rankingRows = useMemo(
    () => teamScopeData.ranking.map((item) => ({
      ...item,
      newCustomers: PERSONAL_DASHBOARD_DATA[item.name]?.performance?.newCustomers || 0,
    })),
    [teamScopeData.ranking],
  );
  const performanceRate = Math.round((personalData.performance.achievedAmount / personalData.performance.targetAmount) * 100);
  const newCustomerRate = Math.round((personalData.performance.newCustomers / personalData.performance.targetNewCustomers) * 100);
  const showTeamEntry = canAccessTeamDashboard(userRole);
  const isLeader = roleType === 'sales-leader';
  const briefingFactor = briefingRange === '7d'
    ? { count: 0.35, amount: 0.24 }
    : briefingRange === '30d'
      ? { count: 1, amount: 1 }
      : { count: 4.2, amount: 4.8 };
  const scaleCount = (value, keepMinimum = false) => {
    const scaledValue = Math.round(value * briefingFactor.count);

    if (keepMinimum && value > 0) {
      return Math.max(1, scaledValue);
    }

    return scaledValue;
  };
  const scaleAmount = (value) => Math.round(value * briefingFactor.amount);
  const baseNewChannels = roleType === 'super-admin'
    ? 2
    : roleType === 'sales-leader'
      ? 1
      : 0;
  const supplyChainOrderAmount = Math.round(personalData.performance.achievedAmount * (roleType === 'super-admin' ? 0.3 : roleType === 'sales-leader' ? 0.22 : 0.16));
  const supplyChainCommission = Math.round(personalData.performance.estimatedCommission * (roleType === 'super-admin' ? 0.32 : roleType === 'sales-leader' ? 0.24 : 0.18));
  const briefingMetrics = [
    {
      label: '新增客户数',
      value: scaleCount(personalData.performance.newCustomers, true),
      icon: Users,
      toneClassName: 'bg-console-primary-soft text-console-primary',
    },
    {
      label: '新增渠道数',
      value: scaleCount(baseNewChannels),
      icon: Megaphone,
      toneClassName: 'bg-console-surface-alt text-console-text',
    },
    {
      label: '系统成交金额',
      value: formatCurrency(scaleAmount(personalData.performance.achievedAmount)),
      icon: Target,
      toneClassName: 'bg-console-surface-muted text-console-text',
    },
    {
      label: '供应链订单金额',
      value: formatCurrency(scaleAmount(supplyChainOrderAmount)),
      icon: Wallet,
      toneClassName: 'bg-console-primary-soft text-console-primary',
    },
    {
      label: '我的系统分成',
      value: formatCurrency(scaleAmount(personalData.performance.estimatedCommission)),
      icon: TrendingUp,
      toneClassName: 'bg-console-surface-alt text-console-text',
    },
    {
      label: '我的供应链分成',
      value: formatCurrency(scaleAmount(supplyChainCommission)),
      icon: ShieldAlert,
      toneClassName: 'bg-console-warning-soft text-console-warning',
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <SectionIntro
          eyebrow="PERSONAL DASHBOARD"
          title="我的工作台"
          description={`早上好，${roleMeta.accountName}。AI 已根据当前客户状态、督促规则和业绩目标整理出 ${totalTodos} 件优先事项。`}
          actions={showTeamEntry ? (
            <button
              type="button"
              onClick={() => navigate(getPathForModule('home-team-dashboard'))}
              className="console-btn-primary"
            >
              {isLeader ? '查看本组汇总' : '查看团队作战图'}
              <ArrowRight size={16} />
            </button>
          ) : null}
        />

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-console-text">数据简报</h2>
              <p className="mt-2 text-sm text-console-muted">把新增客户、成交金额、个人分成、月度目标和个人排行统一放在我的工作台查看。</p>
            </div>
            <div className="console-segmented">
              {[
                { key: '7d', label: '7天内' },
                { key: '30d', label: '30天内' },
                { key: 'year', label: '自然年内' },
              ].map((item) => {
                const isActive = briefingRange === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setBriefingRange(item.key)}
                    className={`console-segmented-item ${isActive ? 'console-segmented-item-active' : ''}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {briefingMetrics.map((item) => (
              <BriefingMetricCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
                toneClassName={item.toneClassName}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <GoalProgressCard
                metricLabel="系统成交金额"
                targetValue={formatCurrency(personalData.performance.targetAmount)}
                achievedValue={formatCurrency(personalData.performance.achievedAmount)}
                progressValue={performanceRate}
              />
              <GoalProgressCard
                metricLabel="新增客户数"
                targetValue={`${personalData.performance.targetNewCustomers}`}
                achievedValue={`${personalData.performance.newCustomers}`}
                progressValue={newCustomerRate}
              />
            </div>

            <RankingChartCard rows={rankingRows} />
          </div>
        </section>

        <section className="page-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-console-text">今日待办</h2>
              <p className="mt-2 text-sm text-console-muted">按优先级自动归类，帮助你先处理风险最高和离成交最近的客户。</p>
            </div>
            <div className="console-chip">
              <ClipboardList size={14} />
              待办 {totalTodos} 件
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {personalData.todoGroups.map((group) => (
                <div key={group.key} className={`rounded-3xl border px-4 py-4 ${group.accentClassName}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <span>{group.icon}</span>
                      {group.label}
                    </div>
                    <span className="text-xs text-slate-500">{group.items.length} 件</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <div key={`${group.key}-${item.customerName}`} className="rounded-2xl bg-white/80 px-4 py-3">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.customerName}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.tag} · {item.meta}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate(getPathForModule('customer'))}
                            className="console-btn-secondary rounded-full px-3 py-1.5"
                          >
                            {item.actionLabel}
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-console border border-console-border bg-console-primary-soft p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-console-text">
                <Bot size={16} className="text-console-primary" />
                AI 建议
              </div>
              <div className="mt-4 space-y-3">
                {personalData.aiSuggestions.map((item) => (
                  <div key={item.text} className="rounded-console bg-console-surface px-4 py-4 shadow-console">
                    <p className="text-sm leading-6 text-console-muted">{item.text}</p>
                    <button
                      type="button"
                      onClick={() => navigate(resolveTargetPath(item.target))}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-console-primary transition-colors hover:text-console-primary-hover"
                    >
                      {item.actionLabel}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-console-text">
            <Users size={18} className="text-console-primary" />
            我的客户概况
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {personalData.kpis.map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} unit={item.unit} tone={item.tone} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-console-text">
              <Filter size={18} className="text-console-text" />
              转化漏斗
            </div>
            <div className="mt-5 space-y-5">
              {personalData.funnel.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-3 text-sm text-console-muted">
                    <span>{item.label}</span>
                    <span className="font-medium text-console-text">{formatPercent(item.rate)}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={item.rate} toneClassName="bg-console-text" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-console-text">
              <AlertCircle size={18} className="text-console-danger" />
              逾期未跟进
            </div>
            <div className="mt-5 space-y-3">
              {personalData.overdueCustomers.map((item) => (
                <div key={item.customerName} className="rounded-console border border-console-border bg-console-surface-alt px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-console-text">{item.customerName}</p>
                      <p className="mt-1 text-sm text-console-muted">已超过 {item.days} 天未跟进</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(getPathForModule('customer'))}
                      className="console-btn-secondary rounded-full px-3 py-1.5"
                    >
                      立即跟进
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-console-text">
            <TrendingUp size={18} className="text-console-success" />
            我的业绩看板（本月）
          </div>
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between gap-3 text-sm text-console-muted">
                  <span>系统成交额</span>
                  <span className="font-medium text-console-text">
                    {formatCurrency(personalData.performance.achievedAmount)} / {formatCurrency(personalData.performance.targetAmount)}
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={performanceRate} toneClassName="bg-console-success" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 text-sm text-console-muted">
                  <span>新增客户数</span>
                  <span className="font-medium text-console-text">
                    {personalData.performance.newCustomers} / {personalData.performance.targetNewCustomers} 个
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={newCustomerRate} toneClassName="bg-console-primary" />
                </div>
              </div>
              <div className="console-muted-card text-sm leading-6 text-console-muted">
                <p className="font-semibold text-console-text">AI 建议</p>
                <p className="mt-2">{personalData.performance.aiAdvice}</p>
              </div>
            </div>
            <div className="rounded-console border border-console-success-soft bg-console-success-soft p-5">
              <p className="text-sm font-medium text-console-success">本月提成预估</p>
              <p className="mt-3 text-3xl font-semibold text-console-success">{formatCurrency(personalData.performance.estimatedCommission)}</p>
              <div className="mt-5 space-y-3 text-sm text-console-muted">
                <div className="flex items-center justify-between gap-3">
                  <span>距月底</span>
                  <span className="font-medium text-console-text">{personalData.performance.daysLeft} 天</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>成交缺口</span>
                  <span className="font-medium text-console-text">{formatCurrency(personalData.performance.targetAmount - personalData.performance.achievedAmount)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(getPathForModule('finance-commission'))}
                  className="inline-flex items-center gap-2 rounded-full border border-console-success bg-console-surface px-3 py-2 text-sm font-medium text-console-success transition hover:bg-console-success-soft"
                >
                  查看提成管理
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function TeamDashboardModule({ userRole, showToast }) {
  const navigate = useNavigate();
  const scopeOptions = useMemo(
    () => getTeamScopeOptionsForRole(userRole).filter((item) => TEAM_DASHBOARD_DATA[item.key]),
    [userRole],
  );
  const [selectedScope, setSelectedScope] = useState(scopeOptions[0]?.key || getTeamScopeForRole(userRole));
  const teamData = TEAM_DASHBOARD_DATA[selectedScope] || TEAM_DASHBOARD_DATA[getTeamScopeForRole(userRole)] || TEAM_DASHBOARD_DATA.all;
  const [selectedMemberName, setSelectedMemberName] = useState(teamData.ranking[0]?.name || '');
  const completionRate = Math.round((teamData.achievedAmount / teamData.targetAmount) * 100);
  const selectedMember = teamData.ranking.find((item) => item.name === selectedMemberName) || teamData.ranking[0];

  useEffect(() => {
    setSelectedMemberName((currentName) => {
      if (teamData.ranking.some((item) => item.name === currentName)) {
        return currentName;
      }

      return teamData.ranking[0]?.name || '';
    });
  }, [teamData.ranking]);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <SectionIntro
          eyebrow="TEAM WAR MAP"
          title="团队作战图"
          description={`当前展示范围为${teamData.label}。管理层可以从这里查看完成度、预警信息、AI 建议和督促执行记录。`}
          actions={(
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                <CalendarDays size={14} />
                2026年05月
              </div>
              <select
                value={selectedScope}
                onChange={(event) => setSelectedScope(event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300"
              >
                {scopeOptions.map((option) => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => showToast?.(`已刷新${getTeamScopeLabel(selectedScope)}数据`)}
                className="console-btn-secondary rounded-full"
              >
                <RefreshCw size={14} />
                刷新
              </button>
              <button
                type="button"
                onClick={() => showToast?.('团队月报已加入导出队列')}
                className="console-btn-primary rounded-full border-none bg-console-primary-soft text-console-primary hover:bg-console-primary-soft"
              >
                <Download size={14} />
                导出报告
              </button>
            </>
          )}
        />

        <section className="page-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-console-text">团队总目标</h2>
              <p className="mt-2 text-sm text-console-muted">目标金额、完成率和剩余高意向客户池会随范围切换自动刷新。</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-console-success-soft px-3 py-1 text-xs font-medium text-console-success">
              <Target size={14} />
              完成率 {formatPercent(completionRate)}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <MetricCard label="目标金额" value={formatCurrency(teamData.targetAmount)} unit="" tone="text-slate-900" />
            <MetricCard label="完成金额" value={formatCurrency(teamData.achievedAmount)} unit="" tone="text-console-success" />
            <MetricCard label="距月底" value={teamData.daysLeft} unit="天" tone="text-slate-900" />
            <MetricCard label="高意向客户池" value={teamData.highIntentPool} unit="家" tone="text-console-primary" />
          </div>
          <div className="mt-5">
            <ProgressBar value={completionRate} toneClassName="bg-console-success" />
          </div>
          <p className="mt-3 text-sm text-console-muted">距离目标仍差 {formatCurrency(teamData.targetAmount - teamData.achievedAmount)}，建议优先推进高意向客户签约。</p>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <TrendingUp size={18} className="text-blue-600" />
              成员完成度排行
            </div>
            <div className="mt-5 table-shell">
              <table className="console-table min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-400">
                    <th className="pb-3 pr-4 font-medium">姓名</th>
                    <th className="pb-3 pr-4 font-medium">角色</th>
                    <th className="pb-3 pr-4 font-medium">完成额</th>
                    <th className="pb-3 pr-4 font-medium">完成率</th>
                    <th className="pb-3 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.ranking.map((item) => {
                    const rate = Math.round((item.achievedAmount / item.targetAmount) * 100);
                    const isActive = item.name === selectedMember?.name;

                    return (
                      <tr
                        key={item.name}
                        className={`cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 ${isActive ? 'bg-blue-50/70' : ''}`}
                        onClick={() => setSelectedMemberName(item.name)}
                      >
                        <td className="py-4 pr-4 font-medium text-slate-900">{item.name}</td>
                        <td className="py-4 pr-4">{item.roleLabel}</td>
                        <td className="py-4 pr-4">{formatCurrency(item.achievedAmount)}</td>
                        <td className="py-4 pr-4">
                          <div className="min-w-[120px]">
                            <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                              <span>{formatPercent(rate)}</span>
                              <span>{formatCurrency(item.targetAmount)}</span>
                            </div>
                            <ProgressBar value={rate} toneClassName={rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-blue-500' : 'bg-rose-500'} />
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName(item.badge)}`}>{item.badge}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="page-card p-5 sm:p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ShieldAlert size={18} className="text-amber-600" />
                团队预警
              </div>
              <div className="mt-5 space-y-4">
                {teamData.alerts.map((group) => (
                  <div key={group.type} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{group.type}</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      {group.items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => navigate(getPathForModule('leads'))}
                          className="block w-full text-left transition hover:text-slate-900"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedMember ? (
              <div className="page-card p-5 sm:p-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Users size={18} className="text-blue-600" />
                  成员详情
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-base font-semibold text-slate-900">{selectedMember.name}</p>
                    <p className="mt-1">{selectedMember.roleLabel}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 px-4 py-4">
                      <p className="text-xs text-slate-400">高意向客户</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{selectedMember.highIntentCount} 家</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-4">
                      <p className="text-xs text-slate-400">逾期客户</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{selectedMember.overdueCount} 家</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-4">
                    <p className="text-xs text-slate-400">当前重点客户</p>
                    <p className="mt-2 font-medium text-slate-900">{selectedMember.focusCustomer}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => showToast?.(`已向 ${selectedMember.name} 发送督促通知`)}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
                    >
                      <Megaphone size={14} />
                      发起督促
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(getPathForModule('leads'))}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      查看线索
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Bot size={18} className="text-sky-600" />
              AI 建议
            </div>
            <div className="mt-5 space-y-3">
              {teamData.suggestions.map((item) => (
                <div key={item.customerName} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.customerName}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.level} 级客户 · 合同预估 {formatCurrency(item.contractAmount)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(getPathForModule('customer'))}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
                    >
                      立即查看
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <BellRing size={18} className="text-violet-600" />
                督促日志
              </div>
              <button
                type="button"
                onClick={() => showToast?.('完整督促日志页待接入，当前先展示最近记录')}
                className="text-sm font-medium text-violet-700"
              >
                查看全部日志
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {teamData.reminderLogs.map((item) => (
                <div key={`${item.triggerTime}-${item.target}-${item.customer}`} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">{item.triggerTime} · {item.triggerType}</p>
                  <p className="mt-2">{item.target} · {item.customer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ReminderSettingsModule({ showToast }) {
  const [rules, setRules] = useState(REMINDER_RULE_DEFAULTS.escalationRules);
  const [specialRules, setSpecialRules] = useState(REMINDER_RULE_DEFAULTS.specialRules);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [templateDraft, setTemplateDraft] = useState('');

  const validationErrors = useMemo(() => {
    const errors = {};

    rules.forEach((rule, index) => {
      const triggerDays = Number(rule.triggerDays);

      if (!Number.isInteger(triggerDays) || triggerDays <= 0) {
        errors[rule.id] = '触发天数必须为正整数';
        return;
      }

      if (index > 0 && triggerDays <= Number(rules[index - 1].triggerDays)) {
        errors[rule.id] = '触发天数必须逐级递增';
        return;
      }

      if (!rule.selectedOptions.length) {
        errors[rule.id] = '至少保留一个通知对象';
      }
    });

    specialRules.forEach((rule) => {
      if (!Number.isFinite(Number(rule.value)) || Number(rule.value) <= 0) {
        errors[rule.id] = '规则值必须大于 0';
      }
      if (!rule.selectedOptions.length) {
        errors[rule.id] = '至少保留一个通知对象';
      }
    });

    return errors;
  }, [rules, specialRules]);

  const editingRule = rules.find((item) => item.id === editingRuleId);

  function updateRule(ruleId, updater) {
    setRules((currentRules) => currentRules.map((item) => (item.id === ruleId ? updater(item) : item)));
  }

  function updateSpecialRule(ruleId, updater) {
    setSpecialRules((currentRules) => currentRules.map((item) => (item.id === ruleId ? updater(item) : item)));
  }

  function handleToggleRule(rule) {
    if (rule.id === 'level-4' && rule.enabled) {
      const shouldContinue = window.confirm('停用第四级规则后，超期客户将不再自动释放至公海池，是否继续？');
      if (!shouldContinue) {
        return;
      }
    }

    updateRule(rule.id, (currentRule) => ({ ...currentRule, enabled: !currentRule.enabled }));
  }

  function handleToggleOption(ruleId, optionLabel) {
    updateRule(ruleId, (currentRule) => {
      const selectedOptions = currentRule.selectedOptions.includes(optionLabel)
        ? currentRule.selectedOptions.filter((item) => item !== optionLabel)
        : [...currentRule.selectedOptions, optionLabel];

      return {
        ...currentRule,
        selectedOptions,
      };
    });
  }

  function handleToggleSpecialOption(ruleId, optionLabel) {
    updateSpecialRule(ruleId, (currentRule) => {
      const selectedOptions = currentRule.selectedOptions.includes(optionLabel)
        ? currentRule.selectedOptions.filter((item) => item !== optionLabel)
        : [...currentRule.selectedOptions, optionLabel];

      return {
        ...currentRule,
        selectedOptions,
      };
    });
  }

  function openTemplateEditor(rule) {
    setEditingRuleId(rule.id);
    setTemplateDraft(rule.template);
  }

  function handleSaveTemplate() {
    if (!editingRule) {
      return;
    }

    updateRule(editingRule.id, (currentRule) => ({
      ...currentRule,
      template: templateDraft.trim(),
    }));
    setEditingRuleId(null);
    showToast?.('消息模板已保存');
  }

  function handleResetDefaults() {
    const shouldContinue = window.confirm('恢复默认后，当前未保存的配置将被清空，是否继续？');
    if (!shouldContinue) {
      return;
    }

    setRules(REMINDER_RULE_DEFAULTS.escalationRules);
    setSpecialRules(REMINDER_RULE_DEFAULTS.specialRules);
    showToast?.('已恢复默认规则');
  }

  function handleSaveAllRules() {
    if (Object.keys(validationErrors).length > 0) {
      showToast?.('存在未通过校验的规则，请先修正', 'error');
      return;
    }

    showToast?.('规则已保存并立即生效');
  }

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <SectionIntro
          eyebrow="REMINDER SETTINGS"
          title="督促规则配置"
          description="销售总监可以在这里维护四级督促规则、特殊场景预警和 AI 消息模板，系统会按保存后的规则立即执行。"
          actions={(
            <>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RefreshCw size={14} />
                恢复默认
              </button>
              <button
                type="button"
                onClick={handleSaveAllRules}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
              >
                <Save size={14} />
                保存全部规则
              </button>
            </>
          )}
        />

        <section className="page-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BellRing size={18} className="text-blue-600" />
            四级督促规则
          </div>
          <div className="mt-5 space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-slate-900">{rule.title}</p>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${rule.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {rule.enabled ? '启用中' : '已停用'}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[180px_1fr]">
                      <label className="text-sm text-slate-600">
                        <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-400">触发条件</span>
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                          未跟进天数 ≥
                          <input
                            type="number"
                            min="1"
                            value={rule.triggerDays}
                            onChange={(event) => updateRule(rule.id, (currentRule) => ({ ...currentRule, triggerDays: event.target.value }))}
                            className="w-20 rounded-xl border border-slate-200 px-3 py-1 outline-none transition focus:border-blue-300"
                          />
                          天
                        </div>
                      </label>
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{rule.mode === 'release' ? '执行动作' : '通知对象'}</p>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {rule.options.map((option) => (
                            <label key={option} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                              <input
                                type="checkbox"
                                checked={rule.selectedOptions.includes(option)}
                                onChange={() => handleToggleOption(rule.id, option)}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">AI 消息模板</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{rule.template}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openTemplateEditor(rule)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                        >
                          <PencilLine size={14} />
                          编辑
                        </button>
                      </div>
                    </div>
                    {validationErrors[rule.id] ? <p className="mt-3 text-sm text-rose-600">{validationErrors[rule.id]}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleRule(rule)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    {rule.enabled ? '停用' : '启用'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ShieldAlert size={18} className="text-violet-600" />
              特殊规则配置
            </div>
            <div className="mt-5 space-y-4">
              {specialRules.map((rule) => (
                <div key={rule.id} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rule.label}</p>
                      <p className="mt-1 text-xs text-slate-400">自定义阈值和通知范围，保存后立即生效。</p>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => updateSpecialRule(rule.id, (currentRule) => ({ ...currentRule, enabled: !currentRule.enabled }))}
                      />
                      启用
                    </label>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      <input
                        type="number"
                        min="1"
                        value={rule.value}
                        onChange={(event) => updateSpecialRule(rule.id, (currentRule) => ({ ...currentRule, value: event.target.value }))}
                        className="w-20 rounded-xl border border-slate-200 px-3 py-1 outline-none transition focus:border-blue-300"
                      />
                      {rule.unit}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {rule.options.map((option) => (
                        <label key={option} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={rule.selectedOptions.includes(option)}
                            onChange={() => handleToggleSpecialOption(rule.id, option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  {validationErrors[rule.id] ? <p className="mt-3 text-sm text-rose-600">{validationErrors[rule.id]}</p> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="page-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <History size={18} className="text-amber-600" />
                规则执行日志预览
              </div>
              <button
                type="button"
                onClick={() => showToast?.('完整规则日志页待接入，当前先保留最近 10 条预览')}
                className="text-sm font-medium text-amber-700"
              >
                查看全部日志
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {REMINDER_RULE_DEFAULTS.logs.map((item) => (
                <div key={`${item.triggerTime}-${item.target}-${item.customer}`} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">{item.triggerTime} · {item.level}</p>
                  <p className="mt-2">{item.target} · {item.customer}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {editingRule ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl shadow-slate-950/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-slate-400">MESSAGE TEMPLATE</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">编辑消息模板</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingRuleId(null)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  关闭
                </button>
              </div>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                可用变量：{' '}
                {['{客户名}', '{销售名}', '{未跟进天数}', '{到期日期}'].map((item) => (
                  <span key={item} className="mr-2 inline-flex rounded-full bg-white px-2 py-1 text-xs text-slate-700">{item}</span>
                ))}
              </div>
              <textarea
                value={templateDraft}
                maxLength={200}
                onChange={(event) => setTemplateDraft(event.target.value)}
                className="mt-5 h-40 w-full rounded-3xl border border-slate-200 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-300"
              />
              <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
                <span>字数：{templateDraft.length}/200</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingRuleId(null)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    保存模板
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CommissionManagementModule({ userRole, showToast }) {
  const roleType = getRoleType(userRole);
  const roleMeta = getRoleMeta(userRole);
  const canEditRules = canEditCommissionRules(userRole);
  const canAudit = canAuditCommission(userRole);
  const canSeeRulesTab = canEditRules || roleType === 'finance';
  const [activeTab, setActiveTab] = useState(canSeeRulesTab ? 'rules' : 'summary');
  const [rules, setRules] = useState(COMMISSION_RULE_DEFAULTS);
  const [summaryRows, setSummaryRows] = useState(COMMISSION_SUMMARY_ROWS);
  const [selectedMonth, setSelectedMonth] = useState(COMMISSION_MONTH_OPTIONS[0].value);
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const ownerName = getLeadOwnerNameForRole(userRole);
  const teamScope = getTeamScopeForRole(userRole);

  const visibleRows = useMemo(() => {
    const rowsByMonth = summaryRows.filter((row) => row.month === selectedMonth);

    if (roleType === 'super-admin' || roleType === 'sales-director' || roleType === 'finance') {
      return rowsByMonth;
    }

    if (roleType === 'sales-leader') {
      return rowsByMonth.filter((row) => row.teamKey === teamScope);
    }

    return rowsByMonth.filter((row) => row.ownerName === ownerName);
  }, [ownerName, roleType, selectedMonth, summaryRows, teamScope]);

  const totalCommission = visibleRows.reduce((sum, item) => sum + item.commissionAmount, 0);
  const issuedCommission = visibleRows
    .filter((item) => item.payStatus === '已发放')
    .reduce((sum, item) => sum + item.commissionAmount, 0);
  const pendingCommission = totalCommission - issuedCommission;
  const selectedRow = visibleRows.find((item) => item.id === selectedRowId) || visibleRows[0] || null;

  useEffect(() => {
    setSelectedRowId((currentId) => {
      if (visibleRows.some((item) => item.id === currentId)) {
        return currentId;
      }

      return visibleRows[0]?.id || null;
    });
  }, [visibleRows]);

  function updateRule(path, value) {
    setRules((currentRules) => {
      const nextRules = { ...currentRules };

      if (path.length === 1) {
        nextRules[path[0]] = value;
        return nextRules;
      }

      nextRules[path[0]] = {
        ...nextRules[path[0]],
        [path[1]]: value,
      };

      return nextRules;
    });
  }

  function updateChannelRule(level, value) {
    setRules((currentRules) => ({
      ...currentRules,
      channelRules: currentRules.channelRules.map((item) => (
        item.level === level ? { ...item, discount: value } : item
      )),
    }));
  }

  function handleSaveRules() {
    showToast?.('规则已保存，下月起生效');
    setIsEditingRules(false);
  }

  function handleMarkPaid(rowId) {
    setSummaryRows((currentRows) => currentRows.map((row) => (
      row.id === rowId ? { ...row, payStatus: '已发放' } : row
    )));
    showToast?.('提成状态已更新为已发放');
  }

  function handleBulkMarkPaid() {
    setSummaryRows((currentRows) => currentRows.map((row) => (
      visibleRows.some((item) => item.id === row.id) && row.payStatus !== '已发放'
        ? { ...row, payStatus: '已发放' }
        : row
    )));
    showToast?.('当前范围内待发放提成已批量更新');
  }

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <SectionIntro
          eyebrow="COMMISSION CENTER"
          title="提成管理"
          description={`当前账号为${roleMeta.label} ${roleMeta.accountName}。系统会根据角色自动收敛可见范围，并展示对应的规则配置或月度提成汇总。`}
          actions={(
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 text-sm text-slate-600">
              {canSeeRulesTab ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`rounded-full px-4 py-2 font-medium transition ${activeTab === 'rules' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  提成规则配置
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`rounded-full px-4 py-2 font-medium transition ${activeTab === 'summary' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                月度提成汇总
              </button>
            </div>
          )}
        />

        {activeTab === 'rules' ? (
          <section className="space-y-6">
            <section className="page-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">提成规则配置</h2>
                  <p className="mt-2 text-sm text-slate-500">支持合同金额/利润基数、人员梯度提成、主管奖励和渠道折扣规则。</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {canEditRules ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingRules((currentValue) => !currentValue)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <PencilLine size={14} />
                      {isEditingRules ? '取消编辑' : '编辑规则'}
                    </button>
                  ) : null}
                  {canEditRules ? (
                    <button
                      type="button"
                      onClick={handleSaveRules}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      <Save size={14} />
                      保存
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => showToast?.('规则历史版本页待接入，当前保留入口')}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <History size={14} />
                    查看历史版本
                  </button>
                </div>
              </div>
              <div className="mt-5 space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">基础设置</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                    {['合同金额', '利润'].map((option) => (
                      <label key={option} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                        <input
                          type="radio"
                          checked={rules.calcBase === option}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={() => updateRule(['calcBase'], option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">员工提成规则</p>
                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                      <label className="flex items-center justify-between gap-3">
                        <span>开荒期提成（前 3 个月新客户）</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.employee.pioneering}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['employee', 'pioneering'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                      {[
                        ['季度完成率 < 80%', 'low'],
                        ['季度完成率 80%-99%', 'mid'],
                        ['季度完成率 ≥ 100%', 'high'],
                      ].map(([label, field]) => (
                        <label key={field} className="flex items-center justify-between gap-3">
                          <span>{label}</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rules.employee[field]}
                            disabled={!canEditRules || !isEditingRules}
                            onChange={(event) => updateRule(['employee', field], event.target.value)}
                            className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">主管 / 总监提成规则</p>
                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                      <label className="flex items-center justify-between gap-3">
                        <span>主管基础提成</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.leader.base}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['leader', 'base'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3">
                        <span>主管超额奖励</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.leader.bonus}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['leader', 'bonus'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3">
                        <span>开荒期加成</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.leader.pioneeringBonus}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['leader', 'pioneeringBonus'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3">
                        <span>总监固定比例</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.director.fixed}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['director', 'fixed'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">客户成功提成</p>
                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                      <label className="flex items-center justify-between gap-3">
                        <span>基础提成</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.customerSuccess.base}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['customerSuccess', 'base'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3">
                        <span>满意度奖励</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rules.customerSuccess.satisfactionBonus}
                          disabled={!canEditRules || !isEditingRules}
                          onChange={(event) => updateRule(['customerSuccess', 'satisfactionBonus'], event.target.value)}
                          className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">渠道分成规则</p>
                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                      {rules.channelRules.map((item) => (
                        <label key={item.level} className="flex items-center justify-between gap-3">
                          <span>{item.level}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={item.discount}
                              disabled={!canEditRules || !isEditingRules}
                              onChange={(event) => updateChannelRule(item.level, event.target.value)}
                              className="w-24 rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-blue-300 disabled:bg-slate-100"
                            />
                            <span className="text-xs text-slate-400">折</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
        ) : null}

        {activeTab === 'summary' ? (
          <section className="space-y-6">
            <section className="page-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">月度提成汇总</h2>
                  <p className="mt-2 text-sm text-slate-500">根据当前角色自动展示个人、本组或全员提成记录，并支持财务审核发放状态。</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300"
                  >
                    {COMMISSION_MONTH_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => showToast?.('提成报表已加入导出队列')}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Download size={14} />
                    导出 Excel
                  </button>
                  {canAudit ? (
                    <button
                      type="button"
                      onClick={handleBulkMarkPaid}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                    >
                      <CheckCircle2 size={14} />
                      批量标记已发放
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricCard label="本月应发提成" value={formatCurrency(totalCommission)} unit="" tone="text-slate-900" />
                <MetricCard label="已发放" value={formatCurrency(issuedCommission)} unit="" tone="text-emerald-700" />
                <MetricCard label="待发放" value={formatCurrency(pendingCommission)} unit="" tone="text-amber-700" />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="page-card p-5 sm:p-6">
                <div className="table-shell">
                  <table className="console-table min-w-full">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-400">
                        <th className="pb-3 pr-4 font-medium">姓名</th>
                        <th className="pb-3 pr-4 font-medium">角色</th>
                        <th className="pb-3 pr-4 font-medium">订单数</th>
                        <th className="pb-3 pr-4 font-medium">合同总额</th>
                        <th className="pb-3 pr-4 font-medium">提成金额</th>
                        <th className="pb-3 pr-4 font-medium">状态</th>
                        <th className="pb-3 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row) => (
                        <tr key={row.id} className={`border-b border-slate-100 ${row.id === selectedRow?.id ? 'bg-blue-50/70' : ''}`}>
                          <td className="py-4 pr-4 font-medium text-slate-900">{row.ownerName}</td>
                          <td className="py-4 pr-4">{row.roleLabel}</td>
                          <td className="py-4 pr-4">{row.orderCount} 单</td>
                          <td className="py-4 pr-4">{formatCurrency(row.contractAmount)}</td>
                          <td className="py-4 pr-4">{formatCurrency(row.commissionAmount)}</td>
                          <td className="py-4 pr-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName(row.payStatus)}`}>{row.payStatus}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRowId(row.id)}
                                className="console-table-action rounded-full px-3 py-1"
                              >
                                详情
                              </button>
                              {canAudit && row.payStatus !== '已发放' ? (
                                <button
                                  type="button"
                                  onClick={() => handleMarkPaid(row.id)}
                                  className="console-table-action rounded-full border-console-success/30 bg-console-success-soft px-3 py-1 text-console-success hover:border-console-success/40 hover:bg-console-success-soft"
                                >
                                  标记发放
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                {selectedRow ? (
                  <div className="page-card p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Wallet size={18} className="text-emerald-600" />
                      提成明细
                    </div>
                    <div className="mt-5 space-y-4 text-sm text-slate-600">
                      <div className="rounded-2xl bg-slate-50 px-4 py-4">
                        <p className="text-base font-semibold text-slate-900">{selectedRow.ownerName}</p>
                        <p className="mt-1">{selectedRow.roleLabel}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 px-4 py-4">
                          <p className="text-xs text-slate-400">合同额</p>
                          <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(selectedRow.contractAmount)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 px-4 py-4">
                          <p className="text-xs text-slate-400">提成金额</p>
                          <p className="mt-2 text-xl font-semibold text-emerald-700">{formatCurrency(selectedRow.commissionAmount)}</p>
                        </div>
                      </div>
                      <p className="rounded-2xl border border-slate-200 px-4 py-4 leading-6">本页当前用于按现有规则查看个人、本组或全员提成结果，方便业务核对与发放确认。</p>
                    </div>
                  </div>
                ) : null}

                <div className="page-card p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Bot size={18} className="text-sky-600" />
                    提成实时预览
                  </div>
                  <div className="mt-5 space-y-3">
                    {COMMISSION_PREVIEW_ROWS.map((item) => (
                      <div key={item.roleLabel} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-slate-900">{item.roleLabel}</span>
                          <span className="font-medium text-emerald-700">{formatCurrency(item.estimateAmount)}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">{item.formula}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export function DailyReportModule({ userRole, showToast }) {
  const roleType = getRoleType(userRole);
  const roleMeta = getRoleMeta(userRole);
  const ownerName = roleType === 'super-admin' ? 'admin' : roleMeta.accountName;
  const teamScope = getTeamScopeForRole(userRole);
  const canSeeAll = canViewAllReports(userRole);
  const canSeeOthers = canViewOtherReports(userRole);
  const accessibleNames = getAccessibleMemberNames(userRole);
  const reportTemplate = DAILY_REPORT_TEMPLATES[ownerName] || DAILY_REPORT_TEMPLATES.admin;
  const [activeTab, setActiveTab] = useState('today');
  const [description, setDescription] = useState(reportTemplate.description);
  const [preview, setPreview] = useState(reportTemplate.preview);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [historyRows, setHistoryRows] = useState(DAILY_REPORT_HISTORY_ROWS);
  const [editingPreview, setEditingPreview] = useState(false);

  const visibleHistoryRows = useMemo(() => {
    if (canSeeAll) {
      return historyRows;
    }

    if (canSeeOthers) {
      return historyRows.filter((item) => item.teamKey === teamScope);
    }

    return historyRows.filter((item) => item.ownerName === roleMeta.accountName);
  }, [canSeeAll, canSeeOthers, historyRows, roleMeta.accountName, teamScope]);

  const weeklySummaryKey = canSeeAll ? 'all' : canSeeOthers ? teamScope : ownerName;
  const weeklySummary = WEEKLY_REPORT_SUMMARIES[weeklySummaryKey] || WEEKLY_REPORT_SUMMARIES.all;

  function handleGeneratePreview() {
    if (description.trim().length < 10) {
      showToast?.('请至少输入 10 个字再生成日报预览', 'error');
      return;
    }

    setPreviewVisible(true);
    setEditingPreview(false);
    showToast?.('AI 已生成日报预览');
  }

  function handleSubmitReport() {
    const today = '2026-05-06';
    const historyId = `report-${today}-${roleMeta.accountName}`;

    setHistoryRows((currentRows) => {
      const exists = currentRows.some((item) => item.id === historyId);
      if (exists) {
        return currentRows.map((item) => (
          item.id === historyId
            ? { ...item, aiStatus: '已生成', submitStatus: '已提交' }
            : item
        ));
      }

      return [
        {
          id: historyId,
          ownerName: roleMeta.accountName,
          teamKey: teamScope,
          date: today,
          aiStatus: '已生成',
          submitStatus: '已提交',
        },
        ...currentRows,
      ];
    });

    showToast?.('日报已提交');
  }

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <SectionIntro
          eyebrow="WORK REPORTS"
          title="AI日报/周报"
          description={`当前账号为${roleMeta.label} ${roleMeta.accountName}。销售可录入并提交个人日报，管理层可查看${canSeeAll ? '全员' : canSeeOthers ? `${getTeamScopeLabel(teamScope)}` : '个人'}历史与周报汇总。`}
          actions={(
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 text-sm text-slate-600">
              {[
                ['today', '今日日报'],
                ['history', '历史记录'],
                ['weekly', 'AI周报'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`rounded-full px-4 py-2 font-medium transition ${activeTab === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        />

        {activeTab === 'today' ? (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.95fr]">
            <div className="page-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">今日工作描述</h2>
                  <p className="mt-2 text-sm text-slate-500">支持文字录入，语音入口已预留，AI 会自动整理为结构化日报。</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <CalendarDays size={14} />
                  2026-05-06（周二）
                </div>
              </div>
              <textarea
                value={description}
                maxLength={1000}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-5 h-48 w-full rounded-3xl border border-slate-200 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-300"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => showToast?.('语音入口已预留，当前请先使用文字录入日报内容')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Mic size={14} />
                  语音输入
                </button>
                <span>字数：{description.length}/1000</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                >
                  <Bot size={14} />
                  AI 生成日报预览
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <History size={14} />
                  查看历史
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('weekly')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <FileText size={14} />
                  查看周报
                </button>
              </div>
            </div>

            <div className="page-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Bot size={18} className="text-sky-600" />
                  AI 生成日报预览
                </div>
                {previewVisible ? (
                  <button
                    type="button"
                    onClick={() => setEditingPreview((currentValue) => !currentValue)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <PencilLine size={14} />
                    {editingPreview ? '完成编辑' : '编辑修改'}
                  </button>
                ) : null}
              </div>
              {previewVisible ? (
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="font-semibold text-slate-900">2026年5月6日 工作日报</p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">今日完成</p>
                        {editingPreview ? (
                          <textarea
                            value={preview.todayDone.join('\n')}
                            onChange={(event) => setPreview((currentPreview) => ({
                              ...currentPreview,
                              todayDone: event.target.value.split('\n').filter(Boolean),
                            }))}
                            className="mt-2 h-24 w-full rounded-2xl border border-slate-200 px-3 py-3 outline-none transition focus:border-blue-300"
                          />
                        ) : (
                          <div className="mt-2 space-y-2">
                            {preview.todayDone.map((item) => <p key={item}>• {item}</p>)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">后续计划</p>
                        {editingPreview ? (
                          <textarea
                            value={preview.nextPlan.join('\n')}
                            onChange={(event) => setPreview((currentPreview) => ({
                              ...currentPreview,
                              nextPlan: event.target.value.split('\n').filter(Boolean),
                            }))}
                            className="mt-2 h-24 w-full rounded-2xl border border-slate-200 px-3 py-3 outline-none transition focus:border-blue-300"
                          />
                        ) : (
                          <div className="mt-2 space-y-2">
                            {preview.nextPlan.map((item) => <p key={item}>• {item}</p>)}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <MetricCard label="跟进客户" value={preview.stats.followedCount} unit="家" tone="text-slate-900" />
                        <MetricCard label="新增跟进记录" value={preview.stats.newFollowCount} unit="条" tone="text-blue-700" />
                        <MetricCard label="成交" value={preview.stats.dealCount} unit="单" tone="text-emerald-700" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSubmitReport}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                    >
                      <CheckCircle2 size={14} />
                      确认并提交
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                  输入今日工作内容后，点击“AI 生成日报预览”即可看到结构化日报草稿。
                </div>
              )}
            </div>
          </section>
        ) : null}

        {activeTab === 'history' ? (
          <section className="page-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">日报历史列表</h2>
                <p className="mt-2 text-sm text-slate-500">{canSeeAll ? '当前展示全员日报提交情况。' : canSeeOthers ? '当前展示本组日报提交情况。' : '当前展示个人日报历史。'}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                <Users size={14} />
                覆盖成员 {canSeeAll ? '全员' : canSeeOthers ? accessibleNames.join(' / ') : roleMeta.accountName}
              </div>
            </div>
            <div className="mt-5 table-shell">
              <table className="console-table min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-400">
                    {canSeeAll || canSeeOthers ? <th className="pb-3 pr-4 font-medium">姓名</th> : null}
                    <th className="pb-3 pr-4 font-medium">日期</th>
                    <th className="pb-3 pr-4 font-medium">AI生成状态</th>
                    <th className="pb-3 pr-4 font-medium">提交状态</th>
                    <th className="pb-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHistoryRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      {canSeeAll || canSeeOthers ? <td className="py-4 pr-4 font-medium text-slate-900">{row.ownerName}</td> : null}
                      <td className="py-4 pr-4">{row.date}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName(row.aiStatus)}`}>{row.aiStatus}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName(row.submitStatus)}`}>{row.submitStatus}</span>
                      </td>
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => showToast?.(row.submitStatus === '已提交' ? `已打开 ${row.ownerName} 的日报详情` : '当前原型保留补录入口，后续接入真实日期态')}
                          className="console-table-action rounded-full px-3 py-1"
                        >
                          {row.submitStatus === '已提交' ? '查看' : '补录'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {activeTab === 'weekly' ? (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="page-card p-5 sm:p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FileText size={18} className="text-blue-600" />
                AI 周报
              </div>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-900">{weeklySummary.weekLabel}</p>
                <p className="mt-3 text-sm text-slate-600">{weeklySummary.metrics}</p>
                <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">本周工作总结</p>
                    <p className="mt-2">{weeklySummary.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">下周计划</p>
                    <div className="mt-2 space-y-2">
                      {weeklySummary.nextPlan.map((item) => <p key={item}>• {item}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="page-card p-5 sm:p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Bot size={18} className="text-sky-600" />
                周报动作
              </div>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-200 px-4 py-4">
                  <p className="font-medium text-slate-900">可见范围</p>
                  <p className="mt-2">{canSeeAll ? '全员周报汇总' : canSeeOthers ? `${getTeamScopeLabel(teamScope)}周报汇总` : `${roleMeta.accountName}个人周报`}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-4">
                  <p className="font-medium text-slate-900">AI 聚合说明</p>
                  <p className="mt-2">系统会根据近 7 天日报与跟进记录自动聚合总结，当前为原型态静态预览，后续可接入真实接口。</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPreview(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <PencilLine size={14} />
                    编辑周报
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast?.('周报已提交')}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    <Save size={14} />
                    提交周报
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
import React from 'react';
import { ClipboardList, Link2, Settings2, ShieldAlert, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPathForModule } from '../app/moduleRegistry';
import { canAccessPersonalDashboard, canAccessTeamDashboard } from '../constants/roles';

export default function HomeDashboard({ userRole }) {
  const navigate = useNavigate();

  const homeQuickLinks = [
    canAccessPersonalDashboard(userRole) && {
      key: 'home-personal-dashboard',
      title: '我的工作台',
      description: '查看 AI 今日待办、客户概况、转化漏斗和个人提成预估。',
      icon: ClipboardList,
      tone: 'bg-console-primary-soft text-console-primary',
    },
    canAccessTeamDashboard(userRole) && {
      key: 'home-team-dashboard',
      title: '团队作战图',
      description: '查看团队目标进度、成员排行、预警信息和督促日志。',
      icon: ShieldAlert,
      tone: 'bg-console-surface-alt text-console-text',
    },
    {
      key: 'home-performance',
      title: '业绩目标',
      description: '维护公司月度成交金额与新增客户目标。',
      icon: Target,
      tone: 'bg-console-surface-alt text-console-text',
    },
    {
      key: 'home-order-binding',
      title: '订单关联',
      description: '配置 OA 客户与企业订单之间的分成归属关系。',
      icon: Link2,
      tone: 'bg-console-primary-soft text-console-primary',
    },
    {
      key: 'home-divided-config',
      title: '分成配置',
      description: '统一查看系统服务费与供应链的分成标准。',
      icon: Settings2,
      tone: 'bg-console-surface-alt text-console-text',
    },
  ].filter(Boolean);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold text-console-text">首页入口</h1>
              <p className="mt-2 text-sm text-console-muted">从这里进入常用业务页面。数据简报已统一放入我的工作台，团队经营数据请查看团队作战图。</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {homeQuickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(getPathForModule(item.key))}
                  className="console-card-link"
                >
                  <div className={`console-icon-badge ${item.tone}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-console-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-console-muted">{item.description}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
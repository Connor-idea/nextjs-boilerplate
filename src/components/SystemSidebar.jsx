/**
 * SystemSidebar.jsx
 * 左侧导航栏组件
 * 提供可折叠的多级导航菜单，用于在系统各模块间切换。
 * 遵循组合组件模式（Compound Component Pattern）：
 *   NavItem      - 一级导航项（可点击激活）
 *   SubNavItem   - 二级导航项（缩进显示，带左侧蓝色激活条）
 *   SectionGroup - 带折叠功能的一级菜单分组
 */

import React, { useState } from 'react';
import { Home, Users, Briefcase, TrendingUp, Users2, BarChart3, User, X, FileText, Settings2, ChevronDown } from 'lucide-react';
import {
  canAccessPersonalDashboard,
  canAccessReminderSettings,
  canAccessTeamDashboard,
  canAccessWorkReports,
  getDefaultHomeModuleKey,
} from '../constants/roles';

/**
 * 一级导航项
 * @param {Object} props
 * @param {string} props.moduleKey - 对应 activeModule 的标识符
 * @param {string} props.activeModule - 当前激活的模块标识符
 * @param {Function} props.setActiveModule - 切换模块的回调
 * @param {React.ElementType} props.icon - 菜单图标组件
 * @param {string} props.label - 菜单文字
 */
function NavItem({ moduleKey, activeModule, setActiveModule, icon: Icon, label, onSelect }) {
  const isActive = activeModule === moduleKey;
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setActiveModule(moduleKey);
          onSelect?.();
        }}
        className={`console-nav-item ${isActive ? 'console-nav-item-active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={18} className={isActive ? 'text-console-primary' : 'text-console-subtle'} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    </li>
  );
}

/**
 * 二级导航项（嵌套在折叠区域内）
 * @param {Object} props
 * @param {string} props.moduleKey - 对应 activeModule 的标识符
 * @param {string} props.activeModule - 当前激活的模块标识符
 * @param {Function} props.setActiveModule - 切换模块的回调
 * @param {string} props.label - 菜单文字
 */
function SubNavItem({ moduleKey, activeModule, setActiveModule, label, onSelect }) {
  const isActive = activeModule === moduleKey;
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setActiveModule(moduleKey);
          onSelect?.();
        }}
        className={`console-subnav-item ${isActive ? 'console-subnav-item-active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-console-primary' : 'bg-console-neutral'}`} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    </li>
  );
}

/**
 * 可折叠的一级菜单分组
 * @param {Object} props
 * @param {React.ElementType} props.icon - 分组图标组件
 * @param {string} props.label - 分组标题
 * @param {boolean} props.expanded - 是否展开
 * @param {Function} props.onToggle - 切换折叠状态的回调
 * @param {React.ReactNode} props.children - 二级菜单内容
 */
function SectionGroup({ icon: Icon, label, expanded, onToggle, children }) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="console-nav-group"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-console-subtle" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <ChevronDown size={16} className={`text-console-muted transition-transform ${expanded ? '' : '-rotate-90'}`} />
      </button>
      {expanded ? <ul className="mt-1 space-y-1 py-1">{children}</ul> : null}
    </li>
  );
}

/**
 * 系统左侧导航栏
 * @param {Object} props
 * @param {string} props.activeModule - 当前激活的模块标识符
 * @param {Function} props.setActiveModule - 切换模块的回调
 */
export default function SystemSidebar({ activeModule, setActiveModule, userRole, isOpen = false, onClose }) {
  const [homeExpanded, setHomeExpanded] = useState(true);
  const [staffExpanded, setStaffExpanded] = useState(true);
  const [leadsExpanded, setLeadsExpanded] = useState(true);
  const [reportsExpanded, setReportsExpanded] = useState(true);
  const [financeExpanded, setFinanceExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const showPersonalDashboard = canAccessPersonalDashboard(userRole);
  const showTeamDashboard = canAccessTeamDashboard(userRole);
  const showReports = canAccessWorkReports(userRole);
  const showSettings = canAccessReminderSettings(userRole);
  const prioritizeTeamDashboard = getDefaultHomeModuleKey(userRole) === 'home-team-dashboard';
  const homeNavItems = (
    prioritizeTeamDashboard
      ? [
          showTeamDashboard && { moduleKey: 'home-team-dashboard', label: '团队作战图' },
          showPersonalDashboard && { moduleKey: 'home-personal-dashboard', label: '我的工作台' },
        ]
      : [
          showPersonalDashboard && { moduleKey: 'home-personal-dashboard', label: '我的工作台' },
          showTeamDashboard && { moduleKey: 'home-team-dashboard', label: '团队作战图' },
        ]
  ).filter(Boolean);

  return (
    <aside
      className={`console-sidebar ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      aria-label="系统导航"
    >
      {/* Logo 区域 */}
      <div className="console-sidebar-brand">
        <div className="flex items-center gap-3">
          <div className="console-icon-badge h-8 w-8">
            <Briefcase size={14} />
          </div>
          <span className="text-[15px] font-semibold text-console-text">靠铺OA系统</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="console-icon-button h-8 w-8 lg:hidden"
          aria-label="关闭侧边栏"
        >
          <X size={18} />
        </button>
      </div>

      {/* 导航菜单 */}
      <div className="console-sidebar-body custom-scrollbar">
        <ul className="space-y-1 px-2.5">
          <SectionGroup
            icon={Home}
            label="首页"
            expanded={homeExpanded}
            onToggle={() => setHomeExpanded(!homeExpanded)}
          >
            {homeNavItems.map((item) => (
              <SubNavItem
                key={item.moduleKey}
                moduleKey={item.moduleKey}
                activeModule={activeModule}
                setActiveModule={setActiveModule}
                label={item.label}
                onSelect={onClose}
              />
            ))}
            <SubNavItem moduleKey="home-performance" activeModule={activeModule} setActiveModule={setActiveModule} label="业绩目标" onSelect={onClose} />
            <SubNavItem moduleKey="home-order-binding" activeModule={activeModule} setActiveModule={setActiveModule} label="订单关联" onSelect={onClose} />
            <SubNavItem moduleKey="home-divided-config" activeModule={activeModule} setActiveModule={setActiveModule} label="分成配置" onSelect={onClose} />
          </SectionGroup>

          <SectionGroup
            icon={Users}
            label="员工管理"
            expanded={staffExpanded}
            onToggle={() => setStaffExpanded(!staffExpanded)}
          >
            <SubNavItem moduleKey="people-all" activeModule={activeModule} setActiveModule={setActiveModule} label="全部员工" onSelect={onClose} />
            <SubNavItem moduleKey="people-direct" activeModule={activeModule} setActiveModule={setActiveModule} label="直属员工" onSelect={onClose} />
            <SubNavItem moduleKey="profile" activeModule={activeModule} setActiveModule={setActiveModule} label="销售画像" onSelect={onClose} />
          </SectionGroup>

          <NavItem moduleKey="channel" activeModule={activeModule} setActiveModule={setActiveModule} icon={Briefcase} label="渠道管理" onSelect={onClose} />

          <NavItem moduleKey="customer" activeModule={activeModule} setActiveModule={setActiveModule} icon={Users2} label="客户管理" onSelect={onClose} />

          <SectionGroup
            icon={TrendingUp}
            label="销售线索"
            expanded={leadsExpanded}
            onToggle={() => setLeadsExpanded(!leadsExpanded)}
          >
            <SubNavItem moduleKey="leads" activeModule={activeModule} setActiveModule={setActiveModule} label="线索管理" onSelect={onClose} />
            <SubNavItem moduleKey="pitch" activeModule={activeModule} setActiveModule={setActiveModule} label="AI推客" onSelect={onClose} />
          </SectionGroup>

          {showReports ? (
            <SectionGroup
              icon={FileText}
              label="工作报告"
              expanded={reportsExpanded}
              onToggle={() => setReportsExpanded(!reportsExpanded)}
            >
              <SubNavItem moduleKey="reports-daily" activeModule={activeModule} setActiveModule={setActiveModule} label="AI日报/周报" onSelect={onClose} />
            </SectionGroup>
          ) : null}

          <SectionGroup
            icon={BarChart3}
            label="财务管理"
            expanded={financeExpanded}
            onToggle={() => setFinanceExpanded(!financeExpanded)}
          >
            <SubNavItem moduleKey="finance-supplier" activeModule={activeModule} setActiveModule={setActiveModule} label="供应商对账款" onSelect={onClose} />
            <SubNavItem moduleKey="finance-commission" activeModule={activeModule} setActiveModule={setActiveModule} label="提成管理" onSelect={onClose} />
            <SubNavItem moduleKey="finance-system-fee" activeModule={activeModule} setActiveModule={setActiveModule} label="系统服务费" onSelect={onClose} />
            <SubNavItem moduleKey="finance-staff-bill" activeModule={activeModule} setActiveModule={setActiveModule} label="员工对账单" onSelect={onClose} />
            <SubNavItem moduleKey="finance-staff-correct" activeModule={activeModule} setActiveModule={setActiveModule} label="员工账单校正" onSelect={onClose} />
            <SubNavItem moduleKey="finance-channel-bill" activeModule={activeModule} setActiveModule={setActiveModule} label="渠道对账单" onSelect={onClose} />
            <SubNavItem moduleKey="finance-channel-correct" activeModule={activeModule} setActiveModule={setActiveModule} label="渠道账单校正" onSelect={onClose} />
            <SubNavItem moduleKey="finance-customer-correct" activeModule={activeModule} setActiveModule={setActiveModule} label="客户账单校正" onSelect={onClose} />
            <SubNavItem moduleKey="finance-settle-list" activeModule={activeModule} setActiveModule={setActiveModule} label="结算订单列表" onSelect={onClose} />
          </SectionGroup>

          {showSettings ? (
            <SectionGroup
              icon={Settings2}
              label="系统设置"
              expanded={settingsExpanded}
              onToggle={() => setSettingsExpanded(!settingsExpanded)}
            >
              <SubNavItem moduleKey="settings-reminders" activeModule={activeModule} setActiveModule={setActiveModule} label="督促规则配置" onSelect={onClose} />
            </SectionGroup>
          ) : null}

          <NavItem moduleKey="personal" activeModule={activeModule} setActiveModule={setActiveModule} icon={User} label="个人中心" onSelect={onClose} />
        </ul>
      </div>
    </aside>
  );
}

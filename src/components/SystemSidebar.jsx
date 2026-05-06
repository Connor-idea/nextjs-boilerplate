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
import { Home, Users, Briefcase, TrendingUp, Users2, BarChart3, User, X } from 'lucide-react';

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
        className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${
          isActive
            ? 'text-blue-400 bg-slate-700/60 font-bold'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={18} />
        <span className="text-sm">{label}</span>
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
        className={`flex w-full items-center border-l-4 pl-12 pr-6 py-2.5 text-left transition-colors ${
          isActive
            ? 'text-blue-400 bg-[#2f3542] border-blue-500 font-bold'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border-transparent'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="text-sm">{label}</span>
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
        className="flex w-full items-center justify-between px-6 py-3 text-left text-slate-300 transition-colors hover:bg-slate-700/50"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span className="text-sm">{label}</span>
        </div>
      </button>
      {expanded && (
        <ul className="bg-[#242833] py-1">
          {children}
        </ul>
      )}
    </li>
  );
}

/**
 * 系统左侧导航栏
 * @param {Object} props
 * @param {string} props.activeModule - 当前激活的模块标识符
 * @param {Function} props.setActiveModule - 切换模块的回调
 */
export default function SystemSidebar({ activeModule, setActiveModule, isOpen = false, onClose }) {
  const [staffExpanded, setStaffExpanded] = useState(true);
  const [leadsExpanded, setLeadsExpanded] = useState(true);
  const [financeExpanded, setFinanceExpanded] = useState(true);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-[280px] max-w-[84vw] flex-col bg-[#2B303B] text-slate-300 shadow-2xl transition-transform duration-300 lg:static lg:z-20 lg:w-[240px] lg:max-w-none lg:flex-shrink-0 lg:translate-x-0 lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="系统导航"
    >
      {/* Logo 区域 */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-5 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-500 flex items-center justify-center mr-3">
            <Briefcase size={14} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">靠铺OA系统</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white lg:hidden"
          aria-label="关闭侧边栏"
        >
          <X size={18} />
        </button>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5">
          <NavItem moduleKey="home" activeModule={activeModule} setActiveModule={setActiveModule} icon={Home} label="首页" onSelect={onClose} />

          <SectionGroup
            icon={Users}
            label="员工管理"
            expanded={staffExpanded}
            onToggle={() => setStaffExpanded(!staffExpanded)}
          >
            <SubNavItem moduleKey="profile" activeModule={activeModule} setActiveModule={setActiveModule} label="销售画像" onSelect={onClose} />
          </SectionGroup>

          <NavItem moduleKey="customer" activeModule={activeModule} setActiveModule={setActiveModule} icon={Users2}   label="客户管理" onSelect={onClose} />

          <SectionGroup
            icon={BarChart3}
            label="财务管理"
            expanded={financeExpanded}
            onToggle={() => setFinanceExpanded(!financeExpanded)}
          >
            <SubNavItem moduleKey="finance-supplier" activeModule={activeModule} setActiveModule={setActiveModule} label="供应商对账款" onSelect={onClose} />
            <SubNavItem moduleKey="finance-system-fee" activeModule={activeModule} setActiveModule={setActiveModule} label="系统服务费" onSelect={onClose} />
            <SubNavItem moduleKey="finance-staff-bill" activeModule={activeModule} setActiveModule={setActiveModule} label="员工对账单" onSelect={onClose} />
            <SubNavItem moduleKey="finance-staff-correct" activeModule={activeModule} setActiveModule={setActiveModule} label="员工账单校正" onSelect={onClose} />
            <SubNavItem moduleKey="finance-channel-bill" activeModule={activeModule} setActiveModule={setActiveModule} label="渠道对账单" onSelect={onClose} />
            <SubNavItem moduleKey="finance-channel-correct" activeModule={activeModule} setActiveModule={setActiveModule} label="渠道账单校正" onSelect={onClose} />
            <SubNavItem moduleKey="finance-customer-correct" activeModule={activeModule} setActiveModule={setActiveModule} label="客户账单校正" onSelect={onClose} />
            <SubNavItem moduleKey="finance-settle-list" activeModule={activeModule} setActiveModule={setActiveModule} label="结算订单列表" onSelect={onClose} />
          </SectionGroup>

          <NavItem moduleKey="channel"  activeModule={activeModule} setActiveModule={setActiveModule} icon={Briefcase} label="渠道管理" onSelect={onClose} />

          <SectionGroup
            icon={TrendingUp}
            label="销售线索"
            expanded={leadsExpanded}
            onToggle={() => setLeadsExpanded(!leadsExpanded)}
          >
            <SubNavItem moduleKey="leads" activeModule={activeModule} setActiveModule={setActiveModule} label="线索管理" onSelect={onClose} />
            <SubNavItem moduleKey="pitch" activeModule={activeModule} setActiveModule={setActiveModule} label="AI推客" onSelect={onClose} />
          </SectionGroup>

          <NavItem moduleKey="personal" activeModule={activeModule} setActiveModule={setActiveModule} icon={User} label="个人中心" onSelect={onClose} />
        </ul>
      </div>
    </aside>
  );
}

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
import { Home, Users, Briefcase, TrendingUp, Users2, BarChart3, User } from 'lucide-react';

/**
 * 一级导航项
 * @param {Object} props
 * @param {string} props.moduleKey - 对应 activeModule 的标识符
 * @param {string} props.activeModule - 当前激活的模块标识符
 * @param {Function} props.setActiveModule - 切换模块的回调
 * @param {React.ElementType} props.icon - 菜单图标组件
 * @param {string} props.label - 菜单文字
 */
function NavItem({ moduleKey, activeModule, setActiveModule, icon: Icon, label }) {
  const isActive = activeModule === moduleKey;
  return (
    <li>
      <div
        onClick={() => setActiveModule(moduleKey)}
        className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
          isActive
            ? 'text-blue-400 bg-slate-700/60 font-bold'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
        }`}
      >
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </div>
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
function SubNavItem({ moduleKey, activeModule, setActiveModule, label }) {
  const isActive = activeModule === moduleKey;
  return (
    <li>
      <div
        onClick={() => setActiveModule(moduleKey)}
        className={`flex items-center pl-12 pr-6 py-2.5 cursor-pointer transition-colors border-l-4 ${
          isActive
            ? 'text-blue-400 bg-[#2f3542] border-blue-500 font-bold'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border-transparent'
        }`}
      >
        <span className="text-sm">{label}</span>
      </div>
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
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-6 py-3 hover:bg-slate-700/50 text-slate-300 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span className="text-sm">{label}</span>
        </div>
      </div>
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
export default function SystemSidebar({ activeModule, setActiveModule }) {
  const [staffExpanded, setStaffExpanded] = useState(true);
  const [leadsExpanded, setLeadsExpanded] = useState(true);

  return (
    <div className="w-[240px] bg-[#2B303B] flex flex-col h-full z-20 flex-shrink-0 text-slate-300">
      {/* Logo 区域 */}
      <div className="h-16 flex items-center px-5 border-b border-slate-700 flex-shrink-0">
        <div className="w-6 h-6 bg-blue-500 flex items-center justify-center mr-3">
          <Briefcase size={14} className="text-white" />
        </div>
        <span className="text-white font-bold text-sm">靠铺OA系统</span>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5">
          <NavItem moduleKey="home" activeModule={activeModule} setActiveModule={setActiveModule} icon={Home} label="首页" />

          <SectionGroup
            icon={Users}
            label="员工管理"
            expanded={staffExpanded}
            onToggle={() => setStaffExpanded(!staffExpanded)}
          >
            <SubNavItem moduleKey="profile" activeModule={activeModule} setActiveModule={setActiveModule} label="销售画像" />
          </SectionGroup>

          <NavItem moduleKey="customer" activeModule={activeModule} setActiveModule={setActiveModule} icon={Users2}   label="客户管理" />
          <NavItem moduleKey="finance"  activeModule={activeModule} setActiveModule={setActiveModule} icon={BarChart3} label="财务管理" />
          <NavItem moduleKey="channel"  activeModule={activeModule} setActiveModule={setActiveModule} icon={Briefcase} label="渠道管理" />

          <SectionGroup
            icon={TrendingUp}
            label="销售线索"
            expanded={leadsExpanded}
            onToggle={() => setLeadsExpanded(!leadsExpanded)}
          >
            <SubNavItem moduleKey="leads" activeModule={activeModule} setActiveModule={setActiveModule} label="线索管理" />
            <SubNavItem moduleKey="pitch" activeModule={activeModule} setActiveModule={setActiveModule} label="AI推客" />
          </SectionGroup>

          <NavItem moduleKey="personal" activeModule={activeModule} setActiveModule={setActiveModule} icon={User} label="个人中心" />
        </ul>
      </div>
    </div>
  );
}

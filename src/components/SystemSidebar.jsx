import React, { useState } from 'react';
import { Home, Users, Briefcase, TrendingUp, Users2, BarChart3, User, ChevronDown } from 'lucide-react';

export default function SystemSidebar({ activeModule, setActiveModule }) {
  const [staffExpanded, setStaffExpanded] = useState(true);
  const [leadsExpanded, setLeadsExpanded] = useState(true);

  return (
    <div className="w-[240px] bg-[#2B303B] flex flex-col h-full z-20 flex-shrink-0 text-slate-300">
      <div className="h-16 flex items-center px-5 border-b border-slate-700 flex-shrink-0">
        <div className="w-6 h-6 bg-blue-500 flex items-center justify-center mr-3">
          <Briefcase size={14} className="text-white" />
        </div>
        <span className="text-white font-bold text-sm">靠铺OA系统</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5">
          {/* 首页 */}
          <li>
            <div
              onClick={() => setActiveModule('home')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                activeModule === 'home'
                  ? 'text-blue-400 bg-slate-700/60 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <Home size={18} />
              <span className="text-sm">首页</span>
            </div>
          </li>

          {/* 员工管理 - 有二级菜单 */}
          <li>
            <div
              onClick={() => setStaffExpanded(!staffExpanded)}
              className="flex items-center justify-between px-6 py-3 hover:bg-slate-700/50 text-slate-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users size={18} />
                <span className="text-sm">员工管理</span>
              </div>
            </div>
            {staffExpanded && (
              <ul className="bg-[#242833] py-1">
                <li>
                  <div
                    onClick={() => setActiveModule('profile')}
                    className={`flex items-center pl-12 pr-6 py-2.5 cursor-pointer transition-colors border-l-4 ${
                      activeModule === 'profile'
                        ? 'text-blue-400 bg-[#2f3542] border-blue-500 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border-transparent'
                    }`}
                  >
                    <span className="text-sm">销售画像</span>
                  </div>
                </li>
              </ul>
            )}
          </li>

          {/* 客户管理 - 无二级 */}
          <li>
            <div
              onClick={() => setActiveModule('customer')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                activeModule === 'customer'
                  ? 'text-blue-400 bg-slate-700/60 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <Users2 size={18} />
              <span className="text-sm">客户管理</span>
            </div>
          </li>

          {/* 财务管理 - 无二级 */}
          <li>
            <div
              onClick={() => setActiveModule('finance')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                activeModule === 'finance'
                  ? 'text-blue-400 bg-slate-700/60 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <BarChart3 size={18} />
              <span className="text-sm">财务管理</span>
            </div>
          </li>

          {/* 渠道管理 - 无二级 */}
          <li>
            <div
              onClick={() => setActiveModule('channel')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                activeModule === 'channel'
                  ? 'text-blue-400 bg-slate-700/60 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <Briefcase size={18} />
              <span className="text-sm">渠道管理</span>
            </div>
          </li>

          {/* 销售线索 - 有二级菜单 */}
          <li>
            <div
              onClick={() => setLeadsExpanded(!leadsExpanded)}
              className="flex items-center justify-between px-6 py-3 hover:bg-slate-700/50 text-slate-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp size={18} />
                <span className="text-sm">销售线索</span>
              </div>
            </div>
            {leadsExpanded && (
              <ul className="bg-[#242833] py-1">
                <li>
                  <div
                    onClick={() => setActiveModule('leads')}
                    className={`flex items-center pl-12 pr-6 py-2.5 cursor-pointer transition-colors border-l-4 ${
                      activeModule === 'leads'
                        ? 'text-blue-400 bg-[#2f3542] border-blue-500 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border-transparent'
                    }`}
                  >
                    <span className="text-sm">线索管理</span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => setActiveModule('pitch')}
                    className={`flex items-center pl-12 pr-6 py-2.5 cursor-pointer transition-colors border-l-4 ${
                      activeModule === 'pitch'
                        ? 'text-blue-400 bg-[#2f3542] border-blue-500 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/30 border-transparent'
                    }`}
                  >
                    <span className="text-sm">AI推客</span>
                  </div>
                </li>

              </ul>
            )}
          </li>

          {/* 个人中心 */}
          <li>
            <div
              onClick={() => setActiveModule('personal')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                activeModule === 'personal'
                  ? 'text-blue-400 bg-slate-700/60 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <User size={18} />
              <span className="text-sm">个人中心</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

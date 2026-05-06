import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useSubpageNav } from './SubpageNavContext';

/**
 * 系统顶部导航栏组件
 * 包含角色切换下拉菜单和系统通知提醒功能。
 * @param {Object} props
 * @param {'manager'|'sales'} props.userRole - 当前登录用户的角色
 * @param {Function} props.setUserRole - 更新用户角色的回调函数
 * @param {Array<Object>} props.notifications - 系统通知数组
 * @param {Function} props.onOpenNotifications - 打开通知面板时的回调（通常用于标记已读）
 */
export default function SystemHeader({ userRole, setUserRole, notifications = [], onOpenNotifications, onToggleSidebar, currentModule }) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const roleMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const { subpageNav } = useSubpageNav();

  const unreadCount = notifications.filter((n) => n.unread).length;
  const showSubpageNav = Boolean(subpageNav?.onBack && subpageNav?.moduleLabel && subpageNav?.pageLabel);

  /**
   * 切换当前登录角色并关闭角色菜单
   * @param {'manager'|'sales'} role - 目标角色
   */
  const handleRoleChange = (role) => {
    setUserRole(role);
    setShowRoleMenu(false);
  };

  /**
   * 返回当前角色对应的显示文字和头像首字
   * @returns {{ label: string, initial: string }}
   */
  const getRoleDisplay = () => {
    if (userRole === 'manager') {
      return { label: '销售主管', initial: '主' };
    } else {
      return { label: '销售员 (张三)', initial: '张' };
    }
  };

  const roleInfo = getRoleDisplay();

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setShowNotificationMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowRoleMenu(false);
        setShowNotificationMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-20 flex-shrink-0 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 ${showSubpageNav ? 'py-2.5' : 'h-16'}`.trim()}>
      <div className={`flex items-center justify-between gap-4 ${showSubpageNav ? 'min-h-[40px]' : 'h-full'}`.trim()}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 lg:hidden"
            aria-label="打开导航菜单"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700 sm:text-base">{currentModule?.label || '靠铺OA系统'}</p>
            {!showSubpageNav && (
              <p className="truncate text-[11px] text-slate-400">{currentModule?.description || '多端工作台'}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
        <div className="relative" ref={notificationMenuRef}>
          <button
            onClick={() => {
              const next = !showNotificationMenu;
              setShowRoleMenu(false);
              setShowNotificationMenu(next);
              if (next) onOpenNotifications?.();
            }}
            className="text-slate-400 relative hover:text-slate-600 transition-colors"
            aria-label="打开系统通知"
            aria-expanded={showNotificationMenu}
            aria-haspopup="dialog"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 border-2 border-white" />}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] bg-white border border-slate-200 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">系统通知</span>
                <span className="text-xs text-slate-500">未读 {unreadCount}</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-slate-400 text-center">暂无通知</div>
                ) : (
                  notifications.slice(0, 12).map((item) => (
                    <div key={item.id} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <p className="text-sm font-semibold text-slate-700">{item.title || '系统消息'}</p>
                      <p className="text-xs text-slate-600 mt-1">{item.message || ''}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{item.targetUser ? `接收人：${item.targetUser}` : '接收人：全部'}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => {
              setShowNotificationMenu(false);
              setShowRoleMenu((prev) => !prev);
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 transition-colors"
            aria-label="切换当前角色"
            aria-expanded={showRoleMenu}
            aria-haspopup="menu"
          >
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {roleInfo.initial}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">{roleInfo.label}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-slate-200 z-50 overflow-hidden" role="menu">
              <button
                onClick={() => handleRoleChange('manager')}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                  userRole === 'manager'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  主
                </div>
                销售主管 (Manager)
                {userRole === 'manager' && <span className="ml-auto text-blue-600">✓</span>}
              </button>
              <button
                onClick={() => handleRoleChange('sales')}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-3 border-t border-slate-100 ${
                  userRole === 'sales'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  张
                </div>
                销售员 (张三)
                {userRole === 'sales' && <span className="ml-auto text-blue-600">✓</span>}
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
      {showSubpageNav && (
        <div className="mt-1.5 flex min-w-0 items-center gap-2 text-xs leading-5 text-slate-500">
          <button
            type="button"
            onClick={subpageNav.onBack}
            className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <span aria-hidden="true">&lt;</span>
            <span>{subpageNav.backLabel || '返回上一级'}</span>
          </button>
          <span className="shrink-0 text-slate-300"> ｜ </span>
          <div className="min-w-0 truncate">
            <span className="font-medium text-slate-500">{subpageNav.moduleLabel}</span>
            <span className="px-1 text-slate-300"> &gt; </span>
            <span className="font-semibold text-slate-700">{subpageNav.pageLabel}</span>
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useSubpageNav } from './SubpageNavContext';
import { getRoleMeta, ROLE_OPTIONS } from '../constants/roles';

/**
 * 系统顶部导航栏组件
 * 包含角色切换下拉菜单和系统通知提醒功能。
 * @param {Object} props
 * @param {string} props.userRole - 当前登录用户的角色
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
   * @param {string} role - 目标角色
   */
  const handleRoleChange = (role) => {
    setUserRole(role);
    setShowRoleMenu(false);
  };

  const roleInfo = getRoleMeta(userRole);

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
    <header className={`console-header ${showSubpageNav ? 'py-2' : 'h-14'}`.trim()}>
      <div className={`flex items-center justify-between gap-4 ${showSubpageNav ? 'min-h-[40px]' : 'h-full'}`.trim()}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="console-icon-button lg:hidden"
            aria-label="打开导航菜单"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-console-text sm:text-base">{currentModule?.label || '靠铺OA系统'}</p>
            {!showSubpageNav && (
              <p className="truncate text-[11px] text-console-muted">{currentModule?.description || '多端工作台'}</p>
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
            className="console-icon-button relative"
            aria-label="打开系统通知"
            aria-expanded={showNotificationMenu}
            aria-haspopup="dialog"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 border-2 border-white" />}
          </button>

          {showNotificationMenu && (
            <div className="console-popover absolute right-0 mt-2 z-50 w-[min(24rem,calc(100vw-2rem))]">
              <div className="console-popover-header">
                <span className="text-sm font-semibold text-console-text">系统通知</span>
                <span className="text-xs text-console-muted">未读 {unreadCount}</span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-console-muted">暂无通知</div>
                ) : (
                  notifications.slice(0, 12).map((item) => (
                    <div key={item.id} className="border-b border-console-border px-4 py-3 transition-colors hover:bg-console-surface-alt">
                      <p className="text-sm font-semibold text-console-text">{item.title || '系统消息'}</p>
                      <p className="mt-1 text-xs text-console-muted">{item.message || ''}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-console-muted">
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
            className="console-account-trigger"
            aria-label="切换当前账号"
            aria-expanded={showRoleMenu}
            aria-haspopup="menu"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-md font-bold text-sm ${roleInfo.avatarClassName}`}>
              {roleInfo.initial}
            </div>
            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-sm font-medium text-console-text">{roleInfo.label}</p>
              <p className="truncate text-[11px] text-console-muted">{roleInfo.accountName}</p>
            </div>
            <ChevronDown size={14} className={`text-console-muted transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
          </button>

          {showRoleMenu && (
            <div className="console-popover absolute right-0 mt-2 z-50 w-80" role="menu">
              <div className="border-b border-console-border bg-console-surface-alt px-4 py-3">
                <p className="text-sm font-semibold text-console-text">切换账号</p>
                <p className="mt-1 text-xs text-console-muted">当前项目默认以超级管理员视角展示，可随时切换业务角色。</p>
              </div>
              {ROLE_OPTIONS.map((role, index) => {
                const isActive = userRole === role.key;

                return (
                  <button
                    key={role.key}
                    onClick={() => handleRoleChange(role.key)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-console-primary-soft text-console-text'
                        : 'text-console-text hover:bg-console-surface-alt'
                    } ${index > 0 ? 'border-t border-console-border' : ''}`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${role.avatarClassName}`}>
                      {role.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-console-muted">{role.accountName}</span>
                      </div>
                      <p className={`mt-1 text-xs ${isActive ? 'text-console-primary' : 'text-console-muted'}`}>{role.description}</p>
                    </div>
                    {isActive && <span className="mt-0.5 text-console-primary">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>
      {showSubpageNav && (
        <div className="mt-1.5 flex min-w-0 items-center gap-2 text-xs leading-5 text-console-muted">
          <button
            type="button"
            onClick={subpageNav.onBack}
            className="console-btn-secondary shrink-0 px-3 py-1 text-xs"
          >
            <span aria-hidden="true">&lt;</span>
            <span>{subpageNav.backLabel || '返回上一级'}</span>
          </button>
          <span className="shrink-0 text-console-neutral"> ｜ </span>
          <div className="min-w-0 truncate">
            <span className="font-medium text-console-muted">{subpageNav.moduleLabel}</span>
            <span className="px-1 text-console-neutral"> &gt; </span>
            <span className="font-semibold text-console-text">{subpageNav.pageLabel}</span>
          </div>
        </div>
      )}
    </header>
  );
}

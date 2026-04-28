import React, { useState } from 'react';
import SystemSidebar from './components/SystemSidebar';
import SystemHeader from './components/SystemHeader';
import LeadsModule from './modules/LeadsModule';
import AITuigkeApp from './modules/AITuigke';
import ProfileModule from './modules/ProfileModule';
import AIAssignPage from './modules/AIAssignPage';
import Placeholder from './modules/Placeholder';
import SupplierReconciliation from './modules/SupplierReconciliation';
import Toast from './components/Toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/** 应用根组件，负责全局路由、角色状态、Toast 通知及系统消息管理 */
export default function App() {
  const [activeModule, setActiveModule] = useState('leads');
  const [userRole, setUserRole] = useState('manager');
  const [aiAssignLeads, setAiAssignLeads] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [systemNotifications, setSystemNotifications] = useState([]);

  /**
   * 跳转至 AI 智能分配页面，并传入待分配线索列表
   * @param {Array<Object>} leads - 待分配的线索数组
   */
  const navigateToAIAssign = (leads) => {
    setAiAssignLeads(leads);
    setActiveModule('ai-assign');
  };

  /**
   * 显示全局 Toast 提示，3 秒后自动消失
   * @param {string} message - 提示内容
   * @param {'success'|'error'} [type='success'] - 提示类型
   */
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  /**
   * 向系统通知列表追加一条新通知，最多保留 100 条
   * @param {Object} notification - 通知对象（title、message、targetUser 等）
   */
  const pushSystemNotification = (notification) => {
    const record = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      time: new Date().toLocaleString(),
      unread: true,
      ...notification
    };
    setSystemNotifications((prev) => [record, ...prev].slice(0, 100));
  };

  /** 将所有未读通知标记为已读 */
  const markAllNotificationsRead = () => {
    setSystemNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <SystemSidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SystemHeader
          userRole={userRole}
          setUserRole={setUserRole}
          notifications={systemNotifications}
          onOpenNotifications={markAllNotificationsRead}
        />
        <div className="flex-1 overflow-y-auto">
          {activeModule === 'home' && <Placeholder title="首页" description="欢迎使用靠铺OA系统" />}
          {activeModule === 'customer' && <Placeholder title="客户管理" description="客户管理页面开发中..." />}
          {activeModule === 'finance-supplier' && <SupplierReconciliation />}
          {activeModule === 'finance-system-fee' && <Placeholder title="系统服务费" description="系统服务费页面开发中..." />}
          {activeModule === 'finance-staff-bill' && <Placeholder title="员工对账单" description="员工对账单页面开发中..." />}
          {activeModule === 'finance-staff-correct' && <Placeholder title="员工账单校正" description="员工账单校正页面开发中..." />}
          {activeModule === 'finance-channel-bill' && <Placeholder title="渠道对账单" description="渠道对账单页面开发中..." />}
          {activeModule === 'finance-channel-correct' && <Placeholder title="渠道账单校正" description="渠道账单校正页面开发中..." />}
          {activeModule === 'finance-customer-correct' && <Placeholder title="客户账单校正" description="客户账单校正页面开发中..." />}
          {activeModule === 'finance-settle-list' && <Placeholder title="结算订单列表" description="结算订单列表页面开发中..." />}
          {activeModule === 'channel' && <Placeholder title="渠道管理" description="渠道管理页面开发中..." />}
          {activeModule === 'leads' && (
            <LeadsModule
              userRole={userRole}
              showToast={showToast}
              onSystemNotify={pushSystemNotification}
              onNavigateToAIAssign={navigateToAIAssign}
            />
          )}
          {activeModule === 'profile' && <ProfileModule userRole={userRole} />}
          {activeModule === 'pitch' && <AITuigkeApp userRole={userRole} />}
          {activeModule === 'ai-assign' && <AIAssignPage showToast={showToast} initialLeads={aiAssignLeads} onBack={() => setActiveModule('leads')} />}
          {activeModule === 'personal' && <Placeholder title="个人中心" description="个人中心页面开发中..." />}
        </div>
      </div>
      <Toast message={toastMessage} type={toastType} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

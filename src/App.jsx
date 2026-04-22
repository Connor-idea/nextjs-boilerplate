import React, { useState } from 'react';
import { Bell, ChevronDown, Building2, Menu } from 'lucide-react';
import SystemSidebar from './components/SystemSidebar';
import SystemHeader from './components/SystemHeader';
import LeadsModule from './modules/LeadsModule';
import AITuigkeApp from './modules/AITuigke';
import ProfileModule from './modules/ProfileModule';
import AIAssignPage from './modules/AIAssignPage';
import Placeholder from './modules/Placeholder';
import Toast from './components/Toast';

export default function App() {
  const [activeModule, setActiveModule] = useState('leads');
  const [userRole, setUserRole] = useState('manager');
  const [aiAssignLeads, setAiAssignLeads] = useState([]);

  const navigateToAIAssign = (leads) => {
    setAiAssignLeads(leads);
    setActiveModule('ai-assign');
  };
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [systemNotifications, setSystemNotifications] = useState([]);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const pushSystemNotification = (notification) => {
    const record = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      time: new Date().toLocaleString(),
      unread: true,
      ...notification
    };
    setSystemNotifications((prev) => [record, ...prev].slice(0, 100));
  };

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
          {activeModule === 'finance' && <Placeholder title="财务管理" description="财务管理页面开发中..." />}
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
    </div>
  );
}

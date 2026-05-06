import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SystemSidebar from './components/SystemSidebar';
import SystemHeader from './components/SystemHeader';
import { SubpageNavProvider } from './components/SubpageNavContext';
import Placeholder from './modules/Placeholder';
import Toast from './components/Toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { getCurrentModule, getPathForModule, getSidebarModuleKey } from './app/moduleRegistry';
import { useRealtimeSync } from './app/useRealtimeSync';
import HomeDashboard from './pages/HomeDashboard';
import LeadsRoutePage from './pages/LeadsRoutePage';
import AIAssignRoutePage from './pages/AIAssignRoutePage';
import PitchRoutePage from './pages/PitchRoutePage';
import SupplierRoutePage from './pages/SupplierRoutePage';
import ProfileInsightsPage from './pages/ProfileInsightsPage';
import { fetchBootstrapData, markNotificationsRead } from './store/thunks';
import {
  clearToast,
  closeSidebar,
  setUserRole,
  showToast as pushToast,
  toggleSidebar,
} from './store/uiSlice';

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.ui.userRole);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const toast = useSelector((state) => state.ui.toast);
  const notifications = useSelector((state) => state.ui.notifications);
  const currentModule = getCurrentModule(location.pathname);
  const activeModule = getSidebarModuleKey(location.pathname);

  useRealtimeSync();

  useEffect(() => {
    dispatch(fetchBootstrapData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(closeSidebar());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, toast.message]);

  const showToast = useCallback((message, type = 'success') => {
    dispatch(pushToast({ message, type }));
  }, [dispatch]);

  const handleNavigateModule = useCallback((moduleKey) => {
    navigate(getPathForModule(moduleKey));
  }, [navigate]);

  const handleOpenNotifications = useCallback(() => {
    dispatch(markNotificationsRead());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans lg:h-screen">
      <SystemSidebar
        activeModule={activeModule}
        setActiveModule={handleNavigateModule}
        isOpen={sidebarOpen}
        onClose={() => dispatch(closeSidebar())}
      />

      <button
        type="button"
        aria-label="关闭导航菜单"
        onClick={() => dispatch(closeSidebar())}
        className={`fixed inset-0 z-30 bg-slate-950/35 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <SubpageNavProvider>
        <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
          <SystemHeader
            userRole={userRole}
            setUserRole={(role) => dispatch(setUserRole(role))}
            notifications={notifications}
            onOpenNotifications={handleOpenNotifications}
            onToggleSidebar={() => dispatch(toggleSidebar())}
            currentModule={currentModule}
          />
          <div className="flex-1 min-w-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/customer" element={<Placeholder title="客户管理" description="客户管理页面开发中..." />} />
              <Route path="/channel" element={<Placeholder title="渠道管理" description="渠道管理页面开发中..." />} />
              <Route path="/personal" element={<Placeholder title="个人中心" description="个人中心页面开发中..." />} />
              <Route path="/sales/leads" element={<LeadsRoutePage userRole={userRole} showToast={showToast} />} />
              <Route path="/sales/leads/ai-assign" element={<AIAssignRoutePage showToast={showToast} />} />
              <Route path="/sales/pitch" element={<PitchRoutePage userRole={userRole} />} />
              <Route path="/people/profile" element={<ProfileInsightsPage />} />
              <Route path="/finance/supplier" element={<SupplierRoutePage />} />
              <Route path="/finance/system-fee" element={<Placeholder title="系统服务费" description="系统服务费页面开发中..." />} />
              <Route path="/finance/staff-bill" element={<Placeholder title="员工对账单" description="员工对账单页面开发中..." />} />
              <Route path="/finance/staff-correct" element={<Placeholder title="员工账单校正" description="员工账单校正页面开发中..." />} />
              <Route path="/finance/channel-bill" element={<Placeholder title="渠道对账单" description="渠道对账单页面开发中..." />} />
              <Route path="/finance/channel-correct" element={<Placeholder title="渠道账单校正" description="渠道账单校正页面开发中..." />} />
              <Route path="/finance/customer-correct" element={<Placeholder title="客户账单校正" description="客户账单校正页面开发中..." />} />
              <Route path="/finance/settle-list" element={<Placeholder title="结算订单列表" description="结算订单列表页面开发中..." />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </SubpageNavProvider>
      <Toast message={toast.message} type={toast.type} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

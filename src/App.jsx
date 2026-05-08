import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SystemSidebar from './components/SystemSidebar';
import SystemHeader from './components/SystemHeader';
import { SubpageNavProvider } from './components/SubpageNavContext';
import Toast from './components/Toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { getCurrentModule, getPathForModule, getSidebarModuleKey } from './app/moduleRegistry';
import { useRealtimeSync } from './app/useRealtimeSync';
import HomeDashboard from './pages/HomeDashboard';
import CustomerRoutePage from './pages/CustomerRoutePage';
import LeadsRoutePage from './pages/LeadsRoutePage';
import AIAssignRoutePage from './pages/AIAssignRoutePage';
import PitchRoutePage from './pages/PitchRoutePage';
import SupplierRoutePage from './pages/SupplierRoutePage';
import ProfileInsightsPage from './pages/ProfileInsightsPage';
import ChannelManagementModule from './modules/ChannelManagementModule';
import { AllEmployeesModule, DirectEmployeesModule } from './modules/EmployeeManagementModules';
import PersonalCenterModule from './modules/PersonalCenterModule';
import {
  ChannelCorrectionModule,
  ChannelStatementModule,
  CustomerCorrectionModule,
  EmployeeCorrectionModule,
  EmployeeStatementModule,
  SettlementOrderModule,
  SystemServiceFeeModule,
} from './modules/FinanceModules';
import {
  DividedConfigModule,
  OrderBindingModule,
  PerformanceTargetModule,
} from './modules/HomeSupplementModules';
import {
  CommissionManagementModule,
  DailyReportModule,
  PersonalDashboardModule,
  ReminderSettingsModule,
  TeamDashboardModule,
} from './modules/RoleWorkbenchModules';
import {
  canAccessPersonalDashboard,
  canAccessReminderSettings,
  canAccessTeamDashboard,
  canAccessWorkReports,
  getDefaultHomeModuleKey,
} from './constants/roles';
import { fetchBootstrapData, markNotificationsRead } from './store/thunks';
import {
  clearToast,
  closeSidebar,
  setUserRole,
  showToast as pushToast,
  toggleSidebar,
} from './store/uiSlice';

function RoleRoute({ allowed, children }) {
  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

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
    const defaultHomeModuleKey = getDefaultHomeModuleKey(userRole);

    if (location.pathname === '/' && defaultHomeModuleKey !== 'home') {
      navigate(getPathForModule(defaultHomeModuleKey), { replace: true });
    }
  }, [location.pathname, navigate, userRole]);

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

  const handleChangeUserRole = useCallback((role) => {
    dispatch(setUserRole(role));

    navigate(getPathForModule(getDefaultHomeModuleKey(role)), { replace: true });
  }, [dispatch, navigate]);

  const handleOpenNotifications = useCallback(() => {
    dispatch(markNotificationsRead());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-console-bg font-sans text-console-text lg:h-screen">
      <SystemSidebar
        activeModule={activeModule}
        setActiveModule={handleNavigateModule}
        userRole={userRole}
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
            setUserRole={handleChangeUserRole}
            notifications={notifications}
            onOpenNotifications={handleOpenNotifications}
            onToggleSidebar={() => dispatch(toggleSidebar())}
            currentModule={currentModule}
          />
          <div className="flex-1 min-w-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomeDashboard userRole={userRole} />} />
              <Route
                path="/dashboard/personal"
                element={(
                  <RoleRoute allowed={canAccessPersonalDashboard(userRole)}>
                    <PersonalDashboardModule userRole={userRole} />
                  </RoleRoute>
                )}
              />
              <Route
                path="/dashboard/team"
                element={(
                  <RoleRoute allowed={canAccessTeamDashboard(userRole)}>
                    <TeamDashboardModule userRole={userRole} showToast={showToast} />
                  </RoleRoute>
                )}
              />
              <Route path="/home/performance-target" element={<PerformanceTargetModule />} />
              <Route path="/home/order-binding" element={<OrderBindingModule />} />
              <Route path="/home/divided-config" element={<DividedConfigModule />} />
              <Route path="/customer" element={<CustomerRoutePage />} />
              <Route path="/channel" element={<ChannelManagementModule />} />
              <Route path="/personal" element={<PersonalCenterModule />} />
              <Route path="/sales/leads" element={<LeadsRoutePage userRole={userRole} showToast={showToast} />} />
              <Route path="/sales/leads/ai-assign" element={<AIAssignRoutePage showToast={showToast} />} />
              <Route path="/sales/pitch" element={<PitchRoutePage userRole={userRole} />} />
              <Route path="/people/all" element={<AllEmployeesModule />} />
              <Route path="/people/direct" element={<DirectEmployeesModule />} />
              <Route path="/people/profile" element={<ProfileInsightsPage />} />
              <Route path="/finance/supplier" element={<SupplierRoutePage />} />
              <Route path="/finance/system-fee" element={<SystemServiceFeeModule />} />
              <Route path="/finance/staff-bill" element={<EmployeeStatementModule />} />
              <Route path="/finance/staff-correct" element={<EmployeeCorrectionModule />} />
              <Route path="/finance/channel-bill" element={<ChannelStatementModule />} />
              <Route path="/finance/channel-correct" element={<ChannelCorrectionModule />} />
              <Route path="/finance/customer-correct" element={<CustomerCorrectionModule />} />
              <Route path="/finance/settle-list" element={<SettlementOrderModule />} />
              <Route path="/finance/commission" element={<CommissionManagementModule userRole={userRole} showToast={showToast} />} />
              <Route
                path="/settings/reminders"
                element={(
                  <RoleRoute allowed={canAccessReminderSettings(userRole)}>
                    <ReminderSettingsModule showToast={showToast} />
                  </RoleRoute>
                )}
              />
              <Route
                path="/reports/daily"
                element={(
                  <RoleRoute allowed={canAccessWorkReports(userRole)}>
                    <DailyReportModule userRole={userRole} showToast={showToast} />
                  </RoleRoute>
                )}
              />
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

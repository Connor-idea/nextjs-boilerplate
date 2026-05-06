import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LeadsModule from '../modules/LeadsModule';
import { getPathForModule } from '../app/moduleRegistry';
import { setAIAssignSelection, setLeadWorkspace } from '../store/crmSlice';
import { syncLeadSnapshot } from '../store/thunks';

export default function LeadsRoutePage({ userRole, showToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leads = useSelector((state) => state.crm.leads);
  const assignLogs = useSelector((state) => state.crm.assignLogs);

  const persistLeadWorkspace = useCallback((nextLeads, nextAssignLogs, reason) => {
    dispatch(setLeadWorkspace({ leads: nextLeads, assignLogs: nextAssignLogs }));
    dispatch(syncLeadSnapshot({ leads: nextLeads, assignLogs: nextAssignLogs, reason }));
  }, [dispatch]);

  const handleLeadsChange = useCallback((nextLeads) => {
    persistLeadWorkspace(nextLeads, assignLogs, '线索管理模块已同步最新线索状态');
  }, [assignLogs, persistLeadWorkspace]);

  const handleAssignLogsChange = useCallback((nextAssignLogs) => {
    persistLeadWorkspace(leads, nextAssignLogs, '线索管理模块已同步分配日志');
  }, [leads, persistLeadWorkspace]);

  const handleNavigateToAIAssign = useCallback((selectedLeads) => {
    dispatch(setAIAssignSelection(selectedLeads.map((lead) => lead.id)));
    navigate(getPathForModule('ai-assign'));
  }, [dispatch, navigate]);

  return (
    <LeadsModule
      userRole={userRole}
      showToast={showToast}
      onNavigateToAIAssign={handleNavigateToAIAssign}
      initialLeadsData={leads}
      initialAssignLogsData={assignLogs}
      onLeadsChange={handleLeadsChange}
      onAssignLogsChange={handleAssignLogsChange}
    />
  );
}
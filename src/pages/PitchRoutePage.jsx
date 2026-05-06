import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AITuigkeApp from '../modules/AITuigke';
import { buildPitchTasksFromLeads, mergePitchTasksIntoLeads } from '../lib/crmAdapters';
import { setLeadWorkspace } from '../store/crmSlice';
import { syncLeadSnapshot } from '../store/thunks';

export default function PitchRoutePage({ userRole }) {
  const dispatch = useDispatch();
  const leads = useSelector((state) => state.crm.leads);
  const assignLogs = useSelector((state) => state.crm.assignLogs);

  const taskLeads = useMemo(() => buildPitchTasksFromLeads(leads), [leads]);

  const handleTaskLeadsChange = useCallback((nextTaskLeads) => {
    const nextLeads = mergePitchTasksIntoLeads(leads, nextTaskLeads);
    dispatch(setLeadWorkspace({ leads: nextLeads, assignLogs }));
    dispatch(syncLeadSnapshot({
      leads: nextLeads,
      assignLogs,
      reason: 'AI 推客模块已同步跟进状态与历史记录',
    }));
  }, [assignLogs, dispatch, leads]);

  return <AITuigkeApp userRole={userRole} initialLeadsData={taskLeads} onLeadsChange={handleTaskLeadsChange} />;
}
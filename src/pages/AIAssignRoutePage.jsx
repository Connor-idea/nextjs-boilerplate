import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AIAssignPage from '../modules/AIAssignPage';
import { getPathForModule } from '../app/moduleRegistry';
import { setAIAssignSelection } from '../store/crmSlice';
import { confirmAssignments } from '../store/thunks';

export default function AIAssignRoutePage({ showToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leads = useSelector((state) => state.crm.leads);
  const selectedIds = useSelector((state) => state.crm.aiAssignSelectionIds);

  const selectedLeads = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return leads.filter((lead) => selectedSet.has(lead.id));
  }, [leads, selectedIds]);

  const handleConfirmAssignments = useCallback(async (previewAssignments) => {
    try {
      await dispatch(confirmAssignments(previewAssignments)).unwrap();
      dispatch(setAIAssignSelection([]));
      showToast('✅ AI 分配结果已保存，负责人已更新', 'success');
      return true;
    } catch (error) {
      showToast(`❌ AI 分配保存失败：${error.message}`, 'error');
      return false;
    }
  }, [dispatch, showToast]);

  return (
    <AIAssignPage
      showToast={showToast}
      initialLeads={selectedLeads}
      onBack={() => navigate(getPathForModule('leads'))}
      onConfirmAssignments={handleConfirmAssignments}
    />
  );
}
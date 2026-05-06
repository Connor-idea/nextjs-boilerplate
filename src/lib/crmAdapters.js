function isBrowserFile(value) {
  return typeof File !== 'undefined' && value instanceof File;
}

function isImageAttachment(name = '') {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes((name.split('.').pop() || '').toLowerCase());
}

function normalizeHistoryRecord(record = {}) {
  if (record.date) {
    return record;
  }

  if (record.time) {
    return {
      id: record.id || `${record.time}-${record.type || 'history'}`,
      date: record.time,
      sales: record.to || record.sales || '系统',
      type: record.type || '系统更新',
      contact: record.contact || record.to || '--',
      note: record.note || `线索处理状态发生变化，当前负责人：${record.to || '未指定'}`,
      tag: record.reasonCategory || '状态同步',
    };
  }

  return {
    id: record.id || `${Date.now()}-${Math.random()}`,
    date: new Date().toLocaleString(),
    sales: record.sales || '系统',
    type: record.type || '状态同步',
    contact: record.contact || '--',
    note: record.note || '线索状态已同步更新',
    tag: record.tag || '同步',
  };
}

export function buildPitchTasksFromLeads(leads = []) {
  return leads
    .filter((lead) => lead.owner && lead.owner !== '未分配')
    .map((lead) => ({
      id: `TASK-${lead.id}`,
      sourceLeadId: lead.id,
      name: lead.company || lead.name,
      status: lead.trackStatus || 'pending',
      score: lead.score || 80,
      time: lead.date || '09:00',
      daysUncontacted: lead.daysUncontacted || 0,
      source: lead.source || '线索管理同步',
      companyNotes: lead.companyNotes || (lead.companyNote ? [{ id: `NOTE-${lead.id}`, text: lead.companyNote, date: lead.date || '今天' }] : []),
      history: (lead.history || []).map(normalizeHistoryRecord),
      contacts: lead.contacts || [],
      owner: lead.owner,
    }))
    .sort((left, right) => (right.score || 0) - (left.score || 0));
}

export function mergePitchTasksIntoLeads(baseLeads = [], taskLeads = []) {
  const taskMap = new Map(taskLeads.map((task) => [String(task.sourceLeadId || task.id), task]));

  return baseLeads.map((lead) => {
    const task = taskMap.get(String(lead.id));
    if (!task) {
      return lead;
    }

    const latestCompanyNote = task.companyNotes?.[task.companyNotes.length - 1]?.text || lead.companyNote || '';

    return {
      ...lead,
      trackStatus: task.status,
      companyNotes: task.companyNotes || [],
      companyNote: latestCompanyNote,
      history: (task.history || []).map(normalizeHistoryRecord),
      contacts: task.contacts || lead.contacts || [],
      daysUncontacted: task.status === 'completed' ? 0 : task.daysUncontacted || lead.daysUncontacted || 0,
    };
  });
}

export function applyAssignmentsToLeads(leads = [], assignments = []) {
  const assignmentMap = new Map(assignments.map((item) => [item.id, item]));
  const operationTime = new Date().toLocaleString();

  return leads.map((lead) => {
    const assignment = assignmentMap.get(lead.id);
    if (!assignment) {
      return lead;
    }

    const previousOwner = lead.owner || '未分配';
    const isReassigned = previousOwner !== '未分配' && previousOwner !== assignment.owner;
    const history = [
      ...(lead.history || []),
      {
        id: `${lead.id}-${assignment.owner}-${operationTime}`,
        time: operationTime,
        type: isReassigned ? '改派' : '分配',
        from: previousOwner,
        to: assignment.owner,
        reason: assignment.reason || 'AI智能分配',
        reasonCategory: 'AI智能分配',
        reasonNote: '',
      },
    ];

    return {
      ...lead,
      owner: assignment.owner,
      status: lead.status === '新线索' ? '二次分配线索' : lead.status,
      isSelfAdded: false,
      history,
    };
  });
}

function sanitizeAttachment(attachment) {
  if (!attachment) {
    return attachment;
  }

  if (isBrowserFile(attachment)) {
    return {
      name: attachment.name,
      size: attachment.size,
      uploadedAt: new Date().toISOString(),
      ...(isImageAttachment(attachment.name)
        ? { previewType: 'image', previewLabel: attachment.name }
        : {}),
    };
  }

  return attachment;
}

export function sanitizeSupplierBillsForTransport(bills = []) {
  return bills.map((bill) => ({
    ...bill,
    supplierInvoiceVouchers: (bill.supplierInvoiceVouchers || []).map(sanitizeAttachment),
    supplierSettleVouchers: (bill.supplierSettleVouchers || []).map(sanitizeAttachment),
    accountInvoiceAttachments: (bill.accountInvoiceAttachments || []).map(sanitizeAttachment),
    accountSettlementAttachments: (bill.accountSettlementAttachments || []).map(sanitizeAttachment),
    serviceFeeInvoiceAttachments: (bill.serviceFeeInvoiceAttachments || []).map(sanitizeAttachment),
    feeInvoiceAttachments: (bill.feeInvoiceAttachments || []).map(sanitizeAttachment),
    feeSettleAttachments: (bill.feeSettleAttachments || []).map(sanitizeAttachment),
  }));
}

export function summarizeDashboardMetrics(leads = [], supplierBills = [], notifications = []) {
  return {
    totalLeads: leads.length,
    assignedLeads: leads.filter((lead) => lead.owner && lead.owner !== '未分配').length,
    pendingFollowUps: leads.filter((lead) => (lead.trackStatus || 'pending') !== 'completed').length,
    supplierBills: supplierBills.length,
    unreadNotifications: notifications.filter((item) => item.unread).length,
  };
}
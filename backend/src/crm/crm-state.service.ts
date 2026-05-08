import { Inject, Injectable } from '@nestjs/common';
import { CrmGateway } from './crm.gateway';
import { createInitialSnapshot, CrmSnapshot, LeadRecord, NotificationRecord, SupplierBillRecord, deriveProfilesFromLeads } from './seed-data';

interface LeadSnapshotPayload {
  leads: LeadRecord[];
  assignLogs?: Array<Record<string, unknown>>;
  reason?: string;
}

@Injectable()
export class CrmStateService {
  private state = createInitialSnapshot();

  constructor(@Inject(CrmGateway) private readonly gateway: CrmGateway) {}

  getBootstrap(): CrmSnapshot {
    return this.createSnapshot();
  }

  replaceLeadSnapshot(payload: LeadSnapshotPayload): CrmSnapshot {
    this.state.leads = JSON.parse(JSON.stringify(payload.leads || []));
    if (payload.assignLogs) {
      this.state.assignLogs = JSON.parse(JSON.stringify(payload.assignLogs));
    }

    if (payload.reason) {
      this.pushNotification('线索状态已同步', payload.reason);
    }

    return this.emitSnapshot();
  }

  confirmAssignments(assignments: Array<Record<string, unknown>>): CrmSnapshot {
    const assignmentMap = new Map(assignments.map((item) => [Number(item.id), item]));
    const operationTime = new Date().toLocaleString('zh-CN');

    this.state.leads = this.state.leads.map((lead) => {
      const assignment = assignmentMap.get(lead.id) as { owner?: string; reason?: string } | undefined;
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
        owner: assignment.owner || lead.owner,
        status: lead.status === '新线索' ? '二次分配线索' : lead.status,
        history,
      };
    });

    const detailsMap = new Map<string, number>();
    assignments.forEach((item) => {
      const owner = String(item.owner || '未指定');
      detailsMap.set(owner, (detailsMap.get(owner) || 0) + 1);
    });

    this.state.assignLogs = [
      {
        id: Date.now(),
        date: operationTime,
        type: 'AI智能分配',
        total: assignments.length,
        details: Array.from(detailsMap.entries()).map(([owner, count]) => `${owner}(${count})`).join(', '),
        status: '成功',
        assignments,
      },
      ...this.state.assignLogs,
    ].slice(0, 50);

    this.pushNotification('AI 分配已确认', `已将 ${assignments.length} 条线索回写到负责人名下。`);
    return this.emitSnapshot();
  }

  replaceSupplierBills(bills: SupplierBillRecord[]): CrmSnapshot {
    this.state.supplierBills = JSON.parse(JSON.stringify(bills || []));
    this.pushNotification('供应商账款已同步', '财务对账页的账款更新已经写入后端状态。');
    return this.emitSnapshot();
  }

  markNotificationsRead(): CrmSnapshot {
    this.state.notifications = this.state.notifications.map((item) => ({
      ...item,
      unread: false,
    }));

    return this.emitSnapshot();
  }

  private createSnapshot(): CrmSnapshot {
    return {
      ...this.state,
      profiles: deriveProfilesFromLeads(this.state.leads),
      syncedAt: new Date().toISOString(),
    };
  }

  private emitSnapshot(): CrmSnapshot {
    const snapshot = this.createSnapshot();
    this.gateway.emitStateUpdated(snapshot);
    return snapshot;
  }

  private pushNotification(title: string, message: string) {
    const notification: NotificationRecord = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title,
      message,
      targetUser: '全部',
      unread: true,
      time: new Date().toLocaleString('zh-CN'),
    };

    this.state.notifications = [notification, ...this.state.notifications].slice(0, 100);
    this.gateway.emitNotificationCreated(notification);
  }
}
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CrmStateService } from './crm-state.service';
import { initialAssignLogs, initialLeads, initialSupplierBills } from './seed-data';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createGatewayStub() {
  return {
    emitStateUpdated: vi.fn(),
    emitNotificationCreated: vi.fn(),
  };
}

describe('CrmStateService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-06T10:00:00+08:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('confirms AI assignments and appends assign logs with realtime notifications', () => {
    const gateway = createGatewayStub();
    const service = new CrmStateService(gateway as never);

    const snapshot = service.confirmAssignments([
      { id: 5, owner: '蔡文嘉', reason: '联调验证' },
    ]);

    const updatedLead = snapshot.leads.find((lead) => lead.id === 5);

    expect(updatedLead).toMatchObject({
      owner: '蔡文嘉',
      status: '二次分配线索',
    });
    expect(updatedLead?.history.at(-1)).toMatchObject({
      type: '分配',
      to: '蔡文嘉',
      reason: '联调验证',
    });
    expect(snapshot.assignLogs[0]).toMatchObject({
      type: 'AI智能分配',
      total: 1,
      status: '成功',
    });
    expect(snapshot.notifications[0]).toMatchObject({
      title: 'AI 分配已确认',
      unread: true,
    });
    expect(gateway.emitNotificationCreated).toHaveBeenCalledOnce();
    expect(gateway.emitStateUpdated).toHaveBeenCalledOnce();
  });

  it('replaces lead snapshots and recomputes profiles after pitch follow-up updates', () => {
    const gateway = createGatewayStub();
    const service = new CrmStateService(gateway as never);
    const nextLeads = clone(initialLeads);
    const targetLead = nextLeads.find((lead) => lead.id === 1);

    if (!targetLead) {
      throw new Error('Expected lead 1 to exist in seed data');
    }

    targetLead.trackStatus = 'completed';
    targetLead.daysUncontacted = 0;
    targetLead.companyNote = '已推进到报价阶段';
    targetLead.companyNotes = [{ id: 'note-1b', text: '已推进到报价阶段', date: '2026-05-06 10:00' }];
    targetLead.history.push({
      id: 'follow-1',
      date: '2026-05-06 10:00',
      sales: '戴贤亮',
      type: '提交跟进',
      contact: '张一鸣',
      note: '已与客户确认报价窗口。',
      tag: '报价推进',
    });

    const snapshot = service.replaceLeadSnapshot({
      leads: nextLeads,
      assignLogs: clone(initialAssignLogs),
      reason: 'AI 推客模块已同步跟进状态与历史记录',
    });

    const updatedLead = snapshot.leads.find((lead) => lead.id === 1);
  const profile = snapshot.profiles.find((item) => item.name === '戴贤亮');

    expect(updatedLead).toMatchObject({
      trackStatus: 'completed',
      companyNote: '已推进到报价阶段',
    });
    expect(updatedLead?.history.at(-1)).toMatchObject({
      type: '提交跟进',
      tag: '报价推进',
    });
    expect(profile).toBeDefined();
    expect(profile?.completedTasks).toBeGreaterThan(0);
    expect(snapshot.notifications[0]).toMatchObject({
      title: '线索状态已同步',
      unread: true,
    });
    expect(gateway.emitNotificationCreated).toHaveBeenCalledOnce();
    expect(gateway.emitStateUpdated).toHaveBeenCalledOnce();
  });

  it('replaces supplier bills and supports notification readback', () => {
    const gateway = createGatewayStub();
    const service = new CrmStateService(gateway as never);
    const nextBills = clone(initialSupplierBills).slice(0, 1);

    nextBills[0].remark = '财务已复核并锁定本期结算';

    const supplierSnapshot = service.replaceSupplierBills(nextBills);
    const readSnapshot = service.markNotificationsRead();

    expect(supplierSnapshot.supplierBills).toHaveLength(1);
    expect(supplierSnapshot.supplierBills[0]).toMatchObject({
      remark: '财务已复核并锁定本期结算',
    });
    expect(supplierSnapshot.notifications[0]).toMatchObject({
      title: '供应商账款已同步',
      unread: true,
    });
    expect(readSnapshot.notifications.every((item) => item.unread === false)).toBe(true);
    expect(gateway.emitNotificationCreated).toHaveBeenCalledOnce();
    expect(gateway.emitStateUpdated).toHaveBeenCalledTimes(2);
  });
});
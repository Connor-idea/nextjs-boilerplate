import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildPitchTasksFromLeads,
  mergePitchTasksIntoLeads,
  sanitizeSupplierBillsForTransport,
} from './crmAdapters';

const OriginalFile = globalThis.File;

class MockFile {
  constructor(parts, name) {
    this.name = name;
    this.size = parts.reduce((total, part) => total + String(part).length, 0);
  }
}

describe('crmAdapters', () => {
  beforeEach(() => {
    if (typeof globalThis.File === 'undefined') {
      globalThis.File = MockFile;
    }
  });

  afterEach(() => {
    if (OriginalFile) {
      globalThis.File = OriginalFile;
      return;
    }

    delete globalThis.File;
  });

  it('buildPitchTasksFromLeads filters unassigned leads and normalizes pitch tasks', () => {
    const leads = [
      {
        id: 11,
        name: '林晓',
        company: '北京字节跳动科技有限公司',
        owner: '张三',
        score: 96,
        trackStatus: 'pending',
        source: '抖音',
        date: '2024-04-18',
        daysUncontacted: 3,
        companyNote: '重点推进二期升级',
        history: [
          {
            id: 'history-1',
            time: '2024-04-18 10:00',
            to: '张三',
            type: '分配',
          },
        ],
        contacts: [{ id: 'contact-1', name: '张一鸣' }],
      },
      {
        id: 12,
        name: '周杰',
        company: '北京百度网讯科技有限公司',
        owner: '未分配',
        score: 99,
        trackStatus: 'pending',
        source: '广告线索',
        date: '2024-04-19',
        daysUncontacted: 1,
        companyNote: '',
        history: [],
        contacts: [],
      },
      {
        id: 13,
        name: '吴磊',
        company: '小米科技有限责任公司',
        owner: '李四',
        score: 88,
        trackStatus: 'completed',
        source: '批量导入',
        date: '2024-04-20',
        daysUncontacted: 0,
        companyNotes: [{ id: 'note-13', text: '已签订试用', date: '2024-04-20 09:00' }],
        history: [
          {
            id: 'history-13',
            date: '2024-04-20 09:30',
            sales: '李四',
            type: '提交跟进',
            contact: '采购负责人',
            note: '已进入试用阶段',
            tag: '推进中',
          },
        ],
        contacts: [],
      },
    ];

    const tasks = buildPitchTasksFromLeads(leads);

    expect(tasks).toHaveLength(2);
    expect(tasks.map((item) => item.sourceLeadId)).toEqual([11, 13]);
    expect(tasks[0]).toMatchObject({
      id: 'TASK-11',
      name: '北京字节跳动科技有限公司',
      owner: '张三',
      status: 'pending',
    });
    expect(tasks[0].companyNotes).toEqual([
      { id: 'NOTE-11', text: '重点推进二期升级', date: '2024-04-18' },
    ]);
    expect(tasks[0].history[0]).toMatchObject({
      date: '2024-04-18 10:00',
      sales: '张三',
      type: '分配',
      contact: '张三',
    });
  });

  it('mergePitchTasksIntoLeads folds pitch updates back into canonical leads', () => {
    const baseLeads = [
      {
        id: 21,
        company: '上海腾讯企点科技有限公司',
        trackStatus: 'pending',
        daysUncontacted: 5,
        companyNote: '待首次联系',
        companyNotes: [],
        history: [],
        contacts: [{ id: 'contact-21', name: '李娜' }],
      },
      {
        id: 22,
        company: '京东集团',
        trackStatus: 'pending',
        daysUncontacted: 2,
        companyNote: '',
        companyNotes: [],
        history: [],
        contacts: [],
      },
    ];

    const taskLeads = [
      {
        sourceLeadId: 21,
        status: 'completed',
        daysUncontacted: 1,
        companyNotes: [{ id: 'note-21', text: '已推进到报价阶段', date: '2026-05-06 10:00' }],
        history: [
          {
            id: 'follow-21',
            time: '2026-05-06 10:00',
            to: '张三',
            type: '提交跟进',
          },
        ],
        contacts: [{ id: 'contact-21-b', name: '采购负责人' }],
      },
    ];

    const merged = mergePitchTasksIntoLeads(baseLeads, taskLeads);

    expect(merged[0]).toMatchObject({
      trackStatus: 'completed',
      companyNote: '已推进到报价阶段',
      daysUncontacted: 0,
      contacts: [{ id: 'contact-21-b', name: '采购负责人' }],
    });
    expect(merged[0].history[0]).toMatchObject({
      date: '2026-05-06 10:00',
      type: '提交跟进',
      sales: '张三',
    });
    expect(merged[1]).toEqual(baseLeads[1]);
  });

  it('sanitizeSupplierBillsForTransport strips File objects into serializable metadata', () => {
    const imageFile = new globalThis.File(['image-binary'], 'voucher.png');
    const pdfFile = new globalThis.File(['pdf-binary'], 'settlement.pdf');
    const bills = [
      {
        id: 31,
        supplierInvoiceVouchers: [imageFile],
        supplierSettleVouchers: [{ name: 'existing.pdf', size: 9 }],
        accountInvoiceAttachments: [pdfFile],
        accountSettlementAttachments: [],
        serviceFeeInvoiceAttachments: [],
        feeInvoiceAttachments: [],
        feeSettleAttachments: [],
      },
    ];

    const sanitized = sanitizeSupplierBillsForTransport(bills);

    expect(sanitized[0].supplierInvoiceVouchers[0]).toMatchObject({
      name: 'voucher.png',
      size: imageFile.size,
      previewType: 'image',
      previewLabel: 'voucher.png',
    });
    expect(sanitized[0].accountInvoiceAttachments[0]).toMatchObject({
      name: 'settlement.pdf',
      size: pdfFile.size,
    });
    expect(sanitized[0].supplierSettleVouchers[0]).toEqual({ name: 'existing.pdf', size: 9 });
  });
});
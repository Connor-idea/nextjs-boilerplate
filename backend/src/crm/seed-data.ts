export interface LeadRecord {
  id: number;
  name: string;
  company: string;
  industry: string;
  phone: string;
  email: string;
  status: string;
  source: string;
  date: string;
  owner: string;
  isSelfAdded: boolean;
  score: number | null;
  daysUncontacted: number;
  trackStatus: 'pending' | 'draft' | 'completed';
  contacts: Array<Record<string, unknown>>;
  history: Array<Record<string, unknown>>;
  companyNote: string;
  companyNotes?: Array<Record<string, unknown>>;
}

export interface SupplierBillRecord {
  id: number;
  billNo: string;
  billType: string;
  receivable: number;
  payable: number;
  invoiceStatus: string;
  settlementStatus: string;
  feeInvoiceStatus: string;
  feeSettlementStatus: string;
  supplierCode: string;
  supplierName: string;
  supplierFullName: string;
  totalAmount: number;
  actualCostTotal: number;
  serviceFeeTotal: number;
  orderCount: number;
  createTime: string;
  invoiceTime: string;
  settleTime: string;
  feeInvoiceTime: string;
  feeSettleTime: string;
  supplierInvoiceVouchers: Array<Record<string, unknown>>;
  supplierSettleVouchers: Array<Record<string, unknown>>;
  ourInvoiceStatus: string;
  ourInvoiceTime: string;
  ourSettleStatus: string;
  ourSettleTime: string;
  settleInitiated: boolean;
  remark: string;
  orders: Array<Record<string, unknown>>;
}

export interface NotificationRecord {
  id: number;
  title: string;
  message: string;
  targetUser: string;
  unread: boolean;
  time: string;
}

export interface ProfileRecord {
  id: string;
  name: string;
  role: string;
  industries: string[];
  openLeads: number;
  completedTasks: number;
  highValueLeads: number;
  avgScore: number;
  momentum: 'busy' | 'stable' | 'ready';
  momentumLabel: string;
  insight: string;
}

export interface CrmSnapshot {
  leads: LeadRecord[];
  assignLogs: Array<Record<string, unknown>>;
  profiles: ProfileRecord[];
  supplierBills: SupplierBillRecord[];
  notifications: NotificationRecord[];
  syncedAt: string;
}

function createOrders(seed: number) {
  return Array.from({ length: 3 }, (_, index) => ({
    id: `ORD-${seed}-${index + 1}`,
    productName: ['企业会员年卡', 'SaaS 定制实施服务', '客服外呼坐席包'][index],
    totalAmount: 1200 + seed * 40 + index * 120,
    costAmount: 1000 + seed * 35 + index * 100,
    feeAmount: 200 + seed * 5 + index * 20,
    finishTime: `2025-10-${String(10 + seed + index).padStart(2, '0')} 14:00:00`,
    payTime: `2025-10-${String(8 + seed + index).padStart(2, '0')} 09:30:00`,
    company: ['北京字节跳动科技有限公司', '上海腾讯企点科技有限公司', '深圳大疆创新科技有限公司'][index],
    mallName: ['靠铺第一商城', '人人商城', '美好福利平台'][index],
    brandSpec: ['企业版', '标准实施包', '呼叫中心 50 坐席'][index],
    unitPrice: 300 + index * 50,
    qty: 2 + index,
    buyerInfo: `ID:buyer-${seed}-${index + 1}\n手机：1380000${seed}${index}`,
  }));
}

export const initialLeads: LeadRecord[] = [
  {
    id: 1,
    name: '林晓',
    company: '北京字节跳动科技有限公司',
    industry: '人工智能',
    phone: '138-0013-8000',
    email: 'linx@company.com',
    status: '二次分配线索',
    source: '抖音',
    date: '2024-02-10',
    owner: '张三',
    isSelfAdded: false,
    score: 99,
    daysUncontacted: 3,
    trackStatus: 'pending',
    contacts: [
      {
        id: 1001,
        name: '张一鸣',
        position: '销售副总裁',
        companyName: '北京字节跳动科技有限公司',
        phones: ['138-0013-8888'],
        wechat: 'zhang_sales_vp',
        email: 'zym@company.com',
        social: '抖音: 商业张sir',
      },
    ],
    history: [
      {
        id: 1,
        date: '2024-04-18 10:00',
        sales: '张三',
        type: '电话拜访',
        contact: '张一鸣',
        note: '客户已明确提出二期 CRM 替换需求，待补充演示计划。',
        tag: '需求确认',
      },
    ],
    companyNote: '重点跟进二期项目',
    companyNotes: [
      {
        id: 'note-1',
        text: '重点跟进二期项目',
        date: '2024-04-18 10:00',
      },
    ],
  },
  {
    id: 2,
    name: '李娜',
    company: '上海腾讯企点科技有限公司',
    industry: '企业服务',
    phone: '139-1234-5678',
    email: 'lina@example.com',
    status: '新线索',
    source: '名片录入',
    date: '2024-02-26',
    owner: '李四',
    isSelfAdded: true,
    score: 95,
    daysUncontacted: 0,
    trackStatus: 'completed',
    contacts: [],
    history: [],
    companyNote: '',
    companyNotes: [],
  },
  {
    id: 5,
    name: '钱伟',
    company: '京东集团',
    industry: '电子商务',
    phone: '131-2222-3333',
    email: 'qianw@example.com',
    status: '新线索',
    source: '网络搜索',
    date: '2024-03-01',
    owner: '未分配',
    isSelfAdded: false,
    score: 88,
    daysUncontacted: 2,
    trackStatus: 'pending',
    contacts: [],
    history: [],
    companyNote: '待主管确认归属人',
    companyNotes: [],
  },
  {
    id: 6,
    name: '周杰',
    company: '北京百度网讯科技有限公司',
    industry: '人工智能',
    phone: '138-6666-5555',
    email: 'zhoujie@example.com',
    status: '退回待分配',
    source: '信息流广告',
    date: '2024-03-05',
    owner: '未分配',
    isSelfAdded: false,
    score: 91,
    daysUncontacted: 1,
    trackStatus: 'pending',
    contacts: [],
    history: [],
    companyNote: '',
    companyNotes: [],
  },
  {
    id: 7,
    name: '刘涛',
    company: '华为技术有限公司',
    industry: '通信电子',
    phone: '139-6666-0000',
    email: 'liutao@example.com',
    status: '退回待分配',
    source: '网络搜索',
    date: '2024-03-06',
    owner: '未分配',
    isSelfAdded: false,
    score: 92,
    daysUncontacted: 5,
    trackStatus: 'draft',
    contacts: [],
    history: [],
    companyNote: '',
    companyNotes: [],
  },
  {
    id: 8,
    name: '吴磊',
    company: '小米科技有限责任公司',
    industry: '智能硬件',
    phone: '131-5555-4444',
    email: 'wulei@example.com',
    status: '三次分配线索',
    source: '批量导入',
    date: '2024-03-07',
    owner: '王五',
    isSelfAdded: false,
    score: 78,
    daysUncontacted: 0,
    trackStatus: 'pending',
    contacts: [],
    history: [],
    companyNote: '',
    companyNotes: [],
  },
];

export const initialAssignLogs = [
  {
    id: 101,
    date: '2024-04-07 09:00:00',
    type: '智能负载均衡',
    total: 3,
    details: '张三(1), 李四(1), 王五(1)',
    status: '成功',
    assignments: [],
  },
];

export const initialSupplierBills: SupplierBillRecord[] = [
  {
    id: 1,
    billNo: '1894652380029520001',
    billType: '订单账单',
    receivable: 260,
    payable: -2300,
    invoiceStatus: '已开票',
    settlementStatus: '已结算',
    feeInvoiceStatus: '已开票',
    feeSettlementStatus: '已结算',
    supplierCode: '3123123123',
    supplierName: '诚信酒类超市',
    supplierFullName: '深圳市亿惠科技有限公司',
    totalAmount: 2560,
    actualCostTotal: 2300,
    serviceFeeTotal: 260,
    orderCount: 3,
    createTime: '2025-10-12',
    invoiceTime: '2025-10-14',
    settleTime: '2025-10-17',
    feeInvoiceTime: '2025-10-13',
    feeSettleTime: '2025-10-18',
    supplierInvoiceVouchers: [{ name: '开票凭证_20001.pdf', size: 524288 }],
    supplierSettleVouchers: [{ name: '结算凭证_20001.pdf', size: 786432 }],
    ourInvoiceStatus: '已开票',
    ourInvoiceTime: '2025-10-15',
    ourSettleStatus: '已结算',
    ourSettleTime: '2025-10-18',
    settleInitiated: true,
    remark: '供应商已确认金额，待下月发起下一轮结算。',
    orders: createOrders(1),
  },
  {
    id: 2,
    billNo: '1894652380029520002',
    billType: '服务费账单',
    receivable: 320,
    payable: -2800,
    invoiceStatus: '未开票',
    settlementStatus: '未结算',
    feeInvoiceStatus: '未开票',
    feeSettlementStatus: '未结算',
    supplierCode: '4124124124',
    supplierName: '云码数联',
    supplierFullName: '广州数联软件技术有限公司',
    totalAmount: 3120,
    actualCostTotal: 2800,
    serviceFeeTotal: 320,
    orderCount: 3,
    createTime: '2025-10-16',
    invoiceTime: '',
    settleTime: '',
    feeInvoiceTime: '',
    feeSettleTime: '',
    supplierInvoiceVouchers: [],
    supplierSettleVouchers: [],
    ourInvoiceStatus: '未开票',
    ourInvoiceTime: '',
    ourSettleStatus: '未结算',
    ourSettleTime: '',
    settleInitiated: false,
    remark: '等待供应商补齐开票材料。',
    orders: createOrders(2),
  },
  {
    id: 3,
    billNo: '1894652380029520003',
    billType: '订单账单',
    receivable: 410,
    payable: -3600,
    invoiceStatus: '已开票',
    settlementStatus: '未结算',
    feeInvoiceStatus: '已开票',
    feeSettlementStatus: '未结算',
    supplierCode: '5125125125',
    supplierName: '优科网络',
    supplierFullName: '北京优科网络科技有限公司',
    totalAmount: 4010,
    actualCostTotal: 3600,
    serviceFeeTotal: 410,
    orderCount: 3,
    createTime: '2025-10-18',
    invoiceTime: '2025-10-20',
    settleTime: '',
    feeInvoiceTime: '2025-10-20',
    feeSettleTime: '',
    supplierInvoiceVouchers: [{ name: '开票凭证_20003.pdf', size: 612000 }],
    supplierSettleVouchers: [],
    ourInvoiceStatus: '已开票',
    ourInvoiceTime: '2025-10-21',
    ourSettleStatus: '未结算',
    ourSettleTime: '',
    settleInitiated: true,
    remark: '我方已开票，等待供应商回款。',
    orders: createOrders(3),
  },
];

export const initialNotifications: NotificationRecord[] = [
  {
    id: 1,
    title: '系统已切换到实时闭环模式',
    message: '前端路由、Redux 状态和 NestJS 实时服务已经接管当前工作台的共享数据流。',
    targetUser: '全部',
    unread: true,
    time: new Date().toLocaleString('zh-CN'),
  },
];

export function deriveProfilesFromLeads(leads: LeadRecord[]): ProfileRecord[] {
  const people = [
    { name: '张三', role: '销售主管' },
    { name: '李四', role: '销售顾问' },
    { name: '王五', role: '销售顾问' },
    { name: '孙琦', role: '销售顾问' },
  ];

  return people.map((person) => {
    const ownedLeads = leads.filter((lead) => lead.owner === person.name);
    const openLeads = ownedLeads.filter((lead) => lead.trackStatus !== 'completed').length;
    const completedTasks = ownedLeads.filter((lead) => lead.trackStatus === 'completed').length;
    const highValueLeads = ownedLeads.filter((lead) => (lead.score || 0) >= 90).length;
    const avgScore = ownedLeads.length > 0
      ? Math.round(ownedLeads.reduce((total, lead) => total + (lead.score || 0), 0) / ownedLeads.length)
      : 0;
    const industries = [...new Set(ownedLeads.map((lead) => lead.industry).filter(Boolean))].slice(0, 3);
    const momentum = openLeads >= 3 ? 'busy' : openLeads === 0 ? 'ready' : 'stable';
    const momentumLabel = momentum === 'busy' ? '高负载' : momentum === 'ready' ? '可接新线索' : '稳定推进';

    return {
      id: person.name,
      name: person.name,
      role: person.role,
      industries,
      openLeads,
      completedTasks,
      highValueLeads,
      avgScore,
      momentum,
      momentumLabel,
      insight:
        momentum === 'busy'
          ? '当前名下待跟进线索偏多，适合优先完成高分线索闭环。'
          : momentum === 'ready'
            ? '当前负荷较低，可优先承接新的高价值线索。'
            : '当前节奏稳定，适合继续推进现有商机。',
    };
  });
}

export function createInitialSnapshot(): CrmSnapshot {
  return {
    leads: JSON.parse(JSON.stringify(initialLeads)),
    assignLogs: JSON.parse(JSON.stringify(initialAssignLogs)),
    profiles: deriveProfilesFromLeads(initialLeads),
    supplierBills: JSON.parse(JSON.stringify(initialSupplierBills)),
    notifications: JSON.parse(JSON.stringify(initialNotifications)),
    syncedAt: new Date().toISOString(),
  };
}
export const MODULE_REGISTRY = {
  home: {
    key: 'home',
    section: '工作台',
    label: '首页',
    description: '查看系统总览与实时同步状态',
    path: '/',
    sidebarKey: 'home',
  },
  customer: {
    key: 'customer',
    section: '客户管理',
    label: '客户管理',
    description: '客户管理页面原型占位中',
    path: '/customer',
    sidebarKey: 'customer',
  },
  channel: {
    key: 'channel',
    section: '渠道管理',
    label: '渠道管理',
    description: '渠道管理页面原型占位中',
    path: '/channel',
    sidebarKey: 'channel',
  },
  leads: {
    key: 'leads',
    section: '销售线索',
    label: '线索管理',
    description: '筛选、分配、清洗并维护销售线索',
    path: '/sales/leads',
    sidebarKey: 'leads',
  },
  'ai-assign': {
    key: 'ai-assign',
    section: '销售线索',
    label: 'AI智能分配',
    description: '审阅 AI 预分配结果并回写业务闭环',
    path: '/sales/leads/ai-assign',
    sidebarKey: 'leads',
  },
  pitch: {
    key: 'pitch',
    section: '销售线索',
    label: 'AI推客',
    description: '按线索节奏跟进并实时回写处理结果',
    path: '/sales/pitch',
    sidebarKey: 'pitch',
  },
  profile: {
    key: 'profile',
    section: '员工管理',
    label: '销售画像',
    description: '基于实时线索与跟进结果刷新团队画像',
    path: '/people/profile',
    sidebarKey: 'profile',
  },
  'finance-supplier': {
    key: 'finance-supplier',
    section: '财务管理',
    label: '供应商对账款',
    description: '处理账款筛选、对账明细与凭证信息',
    path: '/finance/supplier',
    sidebarKey: 'finance-supplier',
  },
  'finance-system-fee': {
    key: 'finance-system-fee',
    section: '财务管理',
    label: '系统服务费',
    description: '系统服务费页面原型占位中',
    path: '/finance/system-fee',
    sidebarKey: 'finance-system-fee',
  },
  'finance-staff-bill': {
    key: 'finance-staff-bill',
    section: '财务管理',
    label: '员工对账单',
    description: '员工对账单页面原型占位中',
    path: '/finance/staff-bill',
    sidebarKey: 'finance-staff-bill',
  },
  'finance-staff-correct': {
    key: 'finance-staff-correct',
    section: '财务管理',
    label: '员工账单校正',
    description: '员工账单校正页面原型占位中',
    path: '/finance/staff-correct',
    sidebarKey: 'finance-staff-correct',
  },
  'finance-channel-bill': {
    key: 'finance-channel-bill',
    section: '财务管理',
    label: '渠道对账单',
    description: '渠道对账单页面原型占位中',
    path: '/finance/channel-bill',
    sidebarKey: 'finance-channel-bill',
  },
  'finance-channel-correct': {
    key: 'finance-channel-correct',
    section: '财务管理',
    label: '渠道账单校正',
    description: '渠道账单校正页面原型占位中',
    path: '/finance/channel-correct',
    sidebarKey: 'finance-channel-correct',
  },
  'finance-customer-correct': {
    key: 'finance-customer-correct',
    section: '财务管理',
    label: '客户账单校正',
    description: '客户账单校正页面原型占位中',
    path: '/finance/customer-correct',
    sidebarKey: 'finance-customer-correct',
  },
  'finance-settle-list': {
    key: 'finance-settle-list',
    section: '财务管理',
    label: '结算订单列表',
    description: '结算订单列表页面原型占位中',
    path: '/finance/settle-list',
    sidebarKey: 'finance-settle-list',
  },
  personal: {
    key: 'personal',
    section: '个人中心',
    label: '个人中心',
    description: '个人中心页面原型占位中',
    path: '/personal',
    sidebarKey: 'personal',
  },
};

const MATCH_ORDER = [
  'ai-assign',
  'finance-system-fee',
  'finance-staff-bill',
  'finance-staff-correct',
  'finance-channel-bill',
  'finance-channel-correct',
  'finance-customer-correct',
  'finance-settle-list',
  'finance-supplier',
  'profile',
  'pitch',
  'leads',
  'customer',
  'channel',
  'personal',
  'home',
];

export function getPathForModule(moduleKey) {
  return MODULE_REGISTRY[moduleKey]?.path || '/';
}

export function getCurrentModule(pathname) {
  const matchedKey = MATCH_ORDER.find((key) => {
    const module = MODULE_REGISTRY[key];
    if (!module) return false;
    if (module.path === '/') return pathname === '/';
    return pathname.startsWith(module.path);
  });

  return MODULE_REGISTRY[matchedKey || 'home'];
}

export function getSidebarModuleKey(pathname) {
  return getCurrentModule(pathname).sidebarKey || 'home';
}
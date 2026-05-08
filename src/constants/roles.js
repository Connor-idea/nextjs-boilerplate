export const DEFAULT_USER_ROLE = 'super-admin';

export const ROLE_OPTIONS = [
  {
    key: 'super-admin',
    roleType: 'super-admin',
    teamKey: 'all',
    label: '超级管理员',
    accountName: 'admin',
    initial: '超',
    description: '拥有全部权限和全部业务视图',
    leadOwnerName: 'admin',
    avatarClassName: 'bg-violet-100 text-violet-700',
  },
  {
    key: 'sales-director-zhaole',
    roleType: 'sales-director',
    teamKey: 'all',
    label: '销售总监',
    accountName: '赵乐',
    initial: '总',
    description: '统筹销售团队并执行总监级管理操作',
    leadOwnerName: '赵乐',
    avatarClassName: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'sales-leader-daixianliang',
    roleType: 'sales-leader',
    teamKey: 'team-daixianliang',
    label: '销售组长',
    accountName: '戴贤亮',
    initial: '戴',
    description: '负责戴贤亮组：戴贤亮、蔡文嘉',
    leadOwnerName: '戴贤亮',
    avatarClassName: 'bg-cyan-100 text-cyan-700',
  },
  {
    key: 'sales-leader-qiuxin',
    roleType: 'sales-leader',
    teamKey: 'team-qiuxin',
    label: '销售组长',
    accountName: '邱鑫',
    initial: '邱',
    description: '负责邱鑫组：邱鑫、邵岩',
    leadOwnerName: '邱鑫',
    avatarClassName: 'bg-sky-100 text-sky-700',
  },
  {
    key: 'sales-specialist-caiwenjia',
    roleType: 'sales-specialist',
    teamKey: 'team-daixianliang',
    label: '销售专员',
    accountName: '蔡文嘉',
    initial: '蔡',
    description: '隶属戴贤亮组，跟进本人线索并支持退回',
    leadOwnerName: '蔡文嘉',
    avatarClassName: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'sales-specialist-shaoyan',
    roleType: 'sales-specialist',
    teamKey: 'team-qiuxin',
    label: '销售专员',
    accountName: '邵岩',
    initial: '邵',
    description: '隶属邱鑫组，跟进本人线索并支持退回',
    leadOwnerName: '邵岩',
    avatarClassName: 'bg-lime-100 text-lime-700',
  },
  {
    key: 'finance-wangshuang',
    roleType: 'finance',
    teamKey: 'all',
    label: '财务',
    accountName: '王双',
    initial: '财',
    description: '负责财务对账和结算复核，线索模块为只读',
    leadOwnerName: '王双',
    avatarClassName: 'bg-amber-100 text-amber-700',
  },
];

const ROLE_LOOKUP = ROLE_OPTIONS.reduce((accumulator, role) => {
  accumulator[role.key] = role;
  return accumulator;
}, {});

const LEAD_MANAGER_ROLE_TYPES = new Set(['super-admin', 'sales-director', 'sales-leader']);
const REPORTING_ROLE_TYPES = new Set(['super-admin', 'sales-director', 'sales-leader', 'sales-specialist']);

export const TEAM_SCOPE_OPTIONS = [
  { key: 'all', label: '全团队' },
  { key: 'team-daixianliang', label: '戴贤亮组' },
  { key: 'team-qiuxin', label: '邱鑫组' },
];

const TEAM_MEMBER_SCOPE = {
  all: ['赵乐', '戴贤亮', '蔡文嘉', '邱鑫', '邵岩'],
  'team-daixianliang': ['戴贤亮', '蔡文嘉'],
  'team-qiuxin': ['邱鑫', '邵岩'],
};

export function getRoleMeta(role) {
  return ROLE_LOOKUP[role] || ROLE_LOOKUP[DEFAULT_USER_ROLE];
}

export function getRoleType(role) {
  return getRoleMeta(role).roleType;
}

export function getTeamScopeForRole(role) {
  return getRoleMeta(role).teamKey || 'all';
}

export function getTeamScopeLabel(scopeKey) {
  return TEAM_SCOPE_OPTIONS.find((item) => item.key === scopeKey)?.label || '全团队';
}

export function getTeamScopeOptionsForRole(role) {
  const roleType = getRoleType(role);
  if (roleType === 'super-admin' || roleType === 'sales-director' || roleType === 'finance') {
    return TEAM_SCOPE_OPTIONS;
  }

  return TEAM_SCOPE_OPTIONS.filter((item) => item.key === getTeamScopeForRole(role));
}

export function getAccessibleMemberNames(role) {
  const roleType = getRoleType(role);
  if (roleType === 'sales-specialist') {
    return [getLeadOwnerNameForRole(role)];
  }

  return TEAM_MEMBER_SCOPE[getTeamScopeForRole(role)] || TEAM_MEMBER_SCOPE.all;
}

export function getLeadOwnerNameForRole(role) {
  return getRoleMeta(role).leadOwnerName;
}

export function canAccessPersonalDashboard(role) {
  return ['super-admin', 'sales-director', 'sales-leader', 'sales-specialist'].includes(getRoleType(role));
}

export function canAccessTeamDashboard(role) {
  return ['super-admin', 'sales-director', 'sales-leader'].includes(getRoleType(role));
}

export function getDefaultHomeModuleKey(role) {
  const roleType = getRoleType(role);

  if (['sales-director', 'sales-leader'].includes(roleType)) {
    return 'home-team-dashboard';
  }

  if (['super-admin', 'sales-specialist'].includes(roleType)) {
    return 'home-personal-dashboard';
  }

  return 'home';
}

export function canAccessReminderSettings(role) {
  return ['super-admin', 'sales-director'].includes(getRoleType(role));
}

export function canAccessCommissionPage(role) {
  return true;
}

export function canEditCommissionRules(role) {
  return ['super-admin', 'sales-director'].includes(getRoleType(role));
}

export function canAuditCommission(role) {
  return ['super-admin', 'finance'].includes(getRoleType(role));
}

export function canAccessWorkReports(role) {
  return REPORTING_ROLE_TYPES.has(getRoleType(role));
}

export function canViewOtherReports(role) {
  return ['super-admin', 'sales-director', 'sales-leader'].includes(getRoleType(role));
}

export function canViewAllReports(role) {
  return ['super-admin', 'sales-director'].includes(getRoleType(role));
}

export function canManageLeads(role) {
  return LEAD_MANAGER_ROLE_TYPES.has(getRoleType(role));
}

export function canViewAllLeads(role) {
  return canManageLeads(role) || getRoleType(role) === 'finance';
}

export function canCreateLead(role) {
  return getRoleType(role) !== 'finance';
}

export function canEditLead(role, lead) {
  return canManageLeads(role) || (getRoleType(role) === 'sales-specialist' && Boolean(lead?.isSelfAdded));
}

export function canReturnLead(role, lead) {
  return getRoleType(role) === 'sales-specialist' && !lead?.isSelfAdded && lead?.owner !== '未分配';
}
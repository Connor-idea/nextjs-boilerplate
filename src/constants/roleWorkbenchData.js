export const PERSONAL_DASHBOARD_DATA = {
  admin: {
    todoGroups: [
      {
        key: 'critical',
        label: '今日必须处理',
        accentClassName: 'border-rose-100 bg-rose-50',
        icon: '🔴',
        items: [
          { customerName: '某某科技有限公司', tag: 'A级', meta: '跨团队重点客户待指派', actionLabel: '立即查看' },
          { customerName: '恒通物流集团', tag: '续费', meta: '到期前 6 天，需管理层介入', actionLabel: '立即查看' },
        ],
      },
      {
        key: 'suggested',
        label: '本周建议跟进',
        accentClassName: 'border-amber-100 bg-amber-50',
        icon: '🟡',
        items: [
          { customerName: '明达服务公司', tag: 'B级', meta: '本周应跟未跟，建议分派戴贤亮组', actionLabel: '查看' },
          { customerName: '瑞恒电子科技', tag: 'A+', meta: '高意向客户池需总监复核', actionLabel: '查看' },
        ],
      },
    ],
    aiSuggestions: [
      { text: '公海池新增 4 条高分线索，建议按组均衡分配', actionLabel: '查看公海', target: 'leads' },
      { text: '本周签约预估偏低，建议优先推进某某科技与瑞恒电子', actionLabel: '查看线索', target: 'leads' },
    ],
    kpis: [
      { label: '总客户', value: 86, unit: '个', tone: 'text-slate-900' },
      { label: 'A+B高意向', value: 34, unit: '个', tone: 'text-blue-700' },
      { label: '本月新增', value: 11, unit: '个', tone: 'text-emerald-700' },
      { label: '逾期未跟', value: 6, unit: '个', tone: 'text-rose-700' },
      { label: '即将到期', value: 4, unit: '个', tone: 'text-amber-700' },
    ],
    funnel: [
      { label: '新增→有意向', rate: 71 },
      { label: '有意向→首次成交', rate: 42 },
      { label: '首次成交→续约', rate: 49 },
    ],
    overdueCustomers: [
      { customerName: '某某科技有限公司', days: 3 },
      { customerName: '开元贸易公司', days: 4 },
      { customerName: '恒通物流集团', days: 7 },
    ],
    performance: {
      achievedAmount: 768000,
      targetAmount: 1200000,
      newCustomers: 11,
      targetNewCustomers: 18,
      estimatedCommission: 58200,
      daysLeft: 25,
      aiAdvice: '建议优先推进 A+ 级客户池中的 3 家客户，提升月底签约概率。',
    },
  },
  赵乐: {
    todoGroups: [
      {
        key: 'critical',
        label: '今日必须处理',
        accentClassName: 'border-rose-100 bg-rose-50',
        icon: '🔴',
        items: [
          { customerName: '某某科技有限公司', tag: 'A级', meta: '超 56h 未跟进，需总监定策略', actionLabel: '立即查看' },
          { customerName: '华南战略渠道', tag: '渠道', meta: '本月无新单，建议立即复盘', actionLabel: '立即查看' },
        ],
      },
      {
        key: 'suggested',
        label: '本周建议跟进',
        accentClassName: 'border-amber-100 bg-amber-50',
        icon: '🟡',
        items: [
          { customerName: '瑞恒电子科技', tag: 'A+', meta: '待签约，建议推进合同条款', actionLabel: '查看' },
        ],
      },
    ],
    aiSuggestions: [
      { text: '戴贤亮组本周新增高意向客户 2 家，可增加签约资源投入', actionLabel: '查看团队', target: 'team-dashboard' },
      { text: '全团队逾期客户 5 家，建议先处理华东区域客户池', actionLabel: '查看线索', target: 'leads' },
    ],
    kpis: [
      { label: '总客户', value: 54, unit: '个', tone: 'text-slate-900' },
      { label: 'A+B高意向', value: 22, unit: '个', tone: 'text-blue-700' },
      { label: '本月新增', value: 6, unit: '个', tone: 'text-emerald-700' },
      { label: '逾期未跟', value: 3, unit: '个', tone: 'text-rose-700' },
      { label: '即将到期', value: 3, unit: '个', tone: 'text-amber-700' },
    ],
    funnel: [
      { label: '新增→有意向', rate: 69 },
      { label: '有意向→首次成交', rate: 37 },
      { label: '首次成交→续约', rate: 51 },
    ],
    overdueCustomers: [
      { customerName: '某某科技有限公司', days: 2 },
      { customerName: '明达服务公司', days: 4 },
      { customerName: '恒通物流集团', days: 5 },
    ],
    performance: {
      achievedAmount: 208000,
      targetAmount: 260000,
      newCustomers: 6,
      targetNewCustomers: 8,
      estimatedCommission: 10400,
      daysLeft: 25,
      aiAdvice: '团队缺口仍集中在高客单客户推进，建议本周增加签约复盘。',
    },
  },
  戴贤亮: {
    todoGroups: [
      {
        key: 'critical',
        label: '今日必须处理',
        accentClassName: 'border-rose-100 bg-rose-50',
        icon: '🔴',
        items: [
          { customerName: '某某科技有限公司', tag: 'B级', meta: '超 52h 未跟进', actionLabel: '立即跟进' },
          { customerName: '开元贸易公司', tag: '续费', meta: '到期前 5 天', actionLabel: '立即跟进' },
          { customerName: '瑞航物流', tag: '主管指定', meta: '今日需完成报价确认', actionLabel: '立即跟进' },
        ],
      },
      {
        key: 'suggested',
        label: '本周建议跟进',
        accentClassName: 'border-amber-100 bg-amber-50',
        icon: '🟡',
        items: [
          { customerName: '明达服务公司', tag: 'A级', meta: '本周应跟未跟', actionLabel: '查看' },
          { customerName: '申越实业', tag: 'B级', meta: '方案已发出待确认', actionLabel: '查看' },
        ],
      },
    ],
    aiSuggestions: [
      { text: '公海池新增 2 条适合仓配场景的线索，建议蔡文嘉优先认领', actionLabel: '查看公海', target: 'leads' },
      { text: '本组本周成单节奏稳定，可增加老客户续费推进', actionLabel: '查看本组', target: 'team-dashboard' },
    ],
    kpis: [
      { label: '总客户', value: 32, unit: '个', tone: 'text-slate-900' },
      { label: 'A+B高意向', value: 15, unit: '个', tone: 'text-blue-700' },
      { label: '本月新增', value: 4, unit: '个', tone: 'text-emerald-700' },
      { label: '逾期未跟', value: 3, unit: '个', tone: 'text-rose-700' },
      { label: '即将到期', value: 2, unit: '个', tone: 'text-amber-700' },
    ],
    funnel: [
      { label: '新增→有意向', rate: 67 },
      { label: '有意向→首次成交', rate: 30 },
      { label: '首次成交→续约', rate: 45 },
    ],
    overdueCustomers: [
      { customerName: '某某科技有限公司', days: 3 },
      { customerName: '开元贸易公司', days: 5 },
      { customerName: '恒通物流集团', days: 7 },
    ],
    performance: {
      achievedAmount: 186000,
      targetAmount: 200000,
      newCustomers: 4,
      targetNewCustomers: 8,
      estimatedCommission: 11280,
      daysLeft: 25,
      aiAdvice: '高意向客户池中有 2 家客户接近签约，建议今天完成报价确认。',
    },
  },
  邱鑫: {
    todoGroups: [
      {
        key: 'critical',
        label: '今日必须处理',
        accentClassName: 'border-rose-100 bg-rose-50',
        icon: '🔴',
        items: [
          { customerName: '辰星供应链', tag: 'A级', meta: '超 48h 未跟进', actionLabel: '立即跟进' },
          { customerName: '北辰制造', tag: '续费', meta: '续费前 7 天', actionLabel: '立即跟进' },
        ],
      },
      {
        key: 'suggested',
        label: '本周建议跟进',
        accentClassName: 'border-amber-100 bg-amber-50',
        icon: '🟡',
        items: [
          { customerName: '宏川商贸', tag: 'B级', meta: '本周应跟未跟', actionLabel: '查看' },
          { customerName: '世联设备', tag: 'A级', meta: '待推进签约条款', actionLabel: '查看' },
        ],
      },
    ],
    aiSuggestions: [
      { text: '邵岩名下有 1 家客户处于临签状态，建议今天安排二次拜访', actionLabel: '查看本组', target: 'team-dashboard' },
      { text: '本组公海推荐客户与快消行业匹配度高，可优先认领', actionLabel: '查看公海', target: 'leads' },
    ],
    kpis: [
      { label: '总客户', value: 28, unit: '个', tone: 'text-slate-900' },
      { label: 'A+B高意向', value: 12, unit: '个', tone: 'text-blue-700' },
      { label: '本月新增', value: 3, unit: '个', tone: 'text-emerald-700' },
      { label: '逾期未跟', value: 2, unit: '个', tone: 'text-rose-700' },
      { label: '即将到期', value: 2, unit: '个', tone: 'text-amber-700' },
    ],
    funnel: [
      { label: '新增→有意向', rate: 63 },
      { label: '有意向→首次成交', rate: 32 },
      { label: '首次成交→续约', rate: 41 },
    ],
    overdueCustomers: [
      { customerName: '辰星供应链', days: 2 },
      { customerName: '北辰制造', days: 4 },
    ],
    performance: {
      achievedAmount: 142000,
      targetAmount: 190000,
      newCustomers: 3,
      targetNewCustomers: 6,
      estimatedCommission: 8940,
      daysLeft: 25,
      aiAdvice: '邱鑫组线下拜访效率较高，建议把资源继续集中在快消与制造业客户。',
    },
  },
  蔡文嘉: {
    todoGroups: [
      {
        key: 'critical',
        label: '今日必须处理',
        accentClassName: 'border-rose-100 bg-rose-50',
        icon: '🔴',
        items: [
          { customerName: '某某科技有限公司', tag: 'B级', meta: '超 52h 未跟进', actionLabel: '立即跟进' },
          { customerName: '开元贸易公司', tag: '续费', meta: '到期前 5 天', actionLabel: '立即跟进' },
        ],
      },
      {
        key: 'suggested',
        label: '本周建议跟进',
        accentClassName: 'border-amber-100 bg-amber-50',
        icon: '🟡',
        items: [
          { customerName: '瑞恒电子科技', tag: 'A级', meta: '本周应跟未跟', actionLabel: '查看' },
          { customerName: '明达服务公司', tag: 'A级', meta: '待发送详细方案', actionLabel: '查看' },
        ],
      },
    ],
    aiSuggestions: [
      { text: '公海池新增 3 条高分线索，建议认领仓配服务相关客户', actionLabel: '查看公海', target: 'leads' },
      { text: '话术提醒：某某科技王总本周生日，可从续费方案切入', actionLabel: '查看话术', target: 'customer' },
    ],
    kpis: [
      { label: '总客户', value: 24, unit: '个', tone: 'text-slate-900' },
      { label: 'A+B高意向', value: 11, unit: '个', tone: 'text-blue-700' },
      { label: '本月新增', value: 4, unit: '个', tone: 'text-emerald-700' },
      { label: '逾期未跟', value: 2, unit: '个', tone: 'text-rose-700' },
      { label: '即将到期', value: 1, unit: '个', tone: 'text-amber-700' },
    ],
    funnel: [
      { label: '新增→有意向', rate: 67 },
      { label: '有意向→首次成交', rate: 30 },
      { label: '首次成交→续约', rate: 45 },
    ],
    overdueCustomers: [
      { customerName: '某某科技有限公司', days: 3 },
      { customerName: '开元贸易公司', days: 5 },
      { customerName: '恒通物流集团', days: 7 },
    ],
    performance: {
      achievedAmount: 128000,
      targetAmount: 200000,
      newCustomers: 4,
      targetNewCustomers: 8,
      estimatedCommission: 9800,
      daysLeft: 25,
      aiAdvice: '高意向客户池中有 3 家可尝试推进签约，建议明天优先处理某某科技。',
    },
  },
  邵岩: {
    todoGroups: [
      {
        key: 'critical',
        label: '今日必须处理',
        accentClassName: 'border-rose-100 bg-rose-50',
        icon: '🔴',
        items: [
          { customerName: '辰星供应链', tag: 'A级', meta: '超 49h 未跟进', actionLabel: '立即跟进' },
          { customerName: '北辰制造', tag: 'B级', meta: '本周需二次报价', actionLabel: '立即跟进' },
        ],
      },
      {
        key: 'suggested',
        label: '本周建议跟进',
        accentClassName: 'border-amber-100 bg-amber-50',
        icon: '🟡',
        items: [
          { customerName: '宏川商贸', tag: 'B级', meta: '本周应跟未跟', actionLabel: '查看' },
        ],
      },
    ],
    aiSuggestions: [
      { text: 'AI 识别到快消行业公海客户 2 条，适合邱鑫组继续推进', actionLabel: '查看公海', target: 'leads' },
      { text: '本周拜访转化率高于组内均值，建议复制当前话术模板', actionLabel: '查看话术', target: 'customer' },
    ],
    kpis: [
      { label: '总客户', value: 19, unit: '个', tone: 'text-slate-900' },
      { label: 'A+B高意向', value: 8, unit: '个', tone: 'text-blue-700' },
      { label: '本月新增', value: 2, unit: '个', tone: 'text-emerald-700' },
      { label: '逾期未跟', value: 1, unit: '个', tone: 'text-rose-700' },
      { label: '即将到期', value: 1, unit: '个', tone: 'text-amber-700' },
    ],
    funnel: [
      { label: '新增→有意向', rate: 61 },
      { label: '有意向→首次成交', rate: 35 },
      { label: '首次成交→续约', rate: 39 },
    ],
    overdueCustomers: [
      { customerName: '辰星供应链', days: 2 },
      { customerName: '宏川商贸', days: 4 },
    ],
    performance: {
      achievedAmount: 98000,
      targetAmount: 160000,
      newCustomers: 2,
      targetNewCustomers: 6,
      estimatedCommission: 7600,
      daysLeft: 25,
      aiAdvice: '本周建议增加 1 次面对面拜访，把高意向客户推到签约阶段。',
    },
  },
};

export const TEAM_DASHBOARD_DATA = {
  all: {
    label: '全团队',
    targetAmount: 1200000,
    achievedAmount: 768000,
    daysLeft: 25,
    highIntentPool: 38,
    ranking: [
      { name: '赵乐', roleLabel: '销售总监', achievedAmount: 208000, targetAmount: 260000, badge: '优秀', highIntentCount: 8, overdueCount: 1, focusCustomer: '某某科技有限公司' },
      { name: '戴贤亮', roleLabel: '销售组长', achievedAmount: 186000, targetAmount: 200000, badge: '优秀', highIntentCount: 6, overdueCount: 1, focusCustomer: '开元贸易公司' },
      { name: '蔡文嘉', roleLabel: '销售专员', achievedAmount: 128000, targetAmount: 200000, badge: '稳定', highIntentCount: 5, overdueCount: 2, focusCustomer: '瑞恒电子科技' },
      { name: '邱鑫', roleLabel: '销售组长', achievedAmount: 142000, targetAmount: 190000, badge: '稳定', highIntentCount: 4, overdueCount: 1, focusCustomer: '辰星供应链' },
      { name: '邵岩', roleLabel: '销售专员', achievedAmount: 98000, targetAmount: 160000, badge: '关注', highIntentCount: 3, overdueCount: 1, focusCustomer: '北辰制造' },
    ],
    alerts: [
      { type: '成员异常', items: ['邵岩 本月新增客户仅 2 家，低于目标节奏', '蔡文嘉 有 2 条客户超过 48h 未跟进'] },
      { type: '超期未跟进', items: ['全团队共有 5 条 A/B 级客户超 48h 未跟进'] },
      { type: '渠道预警', items: ['华南渠道本月无新单，建议本周安排渠道复盘'] },
    ],
    suggestions: [
      { customerName: '某某科技有限公司', level: 'A+', contractAmount: 120000 },
      { customerName: '恒通物流集团', level: 'B', contractAmount: 80000 },
      { customerName: '瑞恒电子科技', level: 'A', contractAmount: 150000 },
    ],
    reminderLogs: [
      { triggerTime: '今日 09:05', triggerType: '系统自动提醒', target: '蔡文嘉', customer: '某某科技有限公司' },
      { triggerTime: '今日 09:05', triggerType: '系统自动提醒', target: '邵岩', customer: '北辰制造' },
      { triggerTime: '昨日 09:00', triggerType: '升级抄送主管', target: '戴贤亮', customer: '开元贸易公司' },
    ],
  },
  'team-daixianliang': {
    label: '戴贤亮组',
    targetAmount: 400000,
    achievedAmount: 314000,
    daysLeft: 25,
    highIntentPool: 16,
    ranking: [
      { name: '戴贤亮', roleLabel: '销售组长', achievedAmount: 186000, targetAmount: 200000, badge: '优秀', highIntentCount: 6, overdueCount: 1, focusCustomer: '开元贸易公司' },
      { name: '蔡文嘉', roleLabel: '销售专员', achievedAmount: 128000, targetAmount: 200000, badge: '稳定', highIntentCount: 5, overdueCount: 2, focusCustomer: '某某科技有限公司' },
    ],
    alerts: [
      { type: '成员异常', items: ['蔡文嘉 本周仍有 2 条客户未完成二次跟进'] },
      { type: '超期未跟进', items: ['本组共有 3 条客户超过 48h 未跟进'] },
      { type: '渠道预警', items: ['华东仓配渠道询盘下降，建议加强拜访'] },
    ],
    suggestions: [
      { customerName: '某某科技有限公司', level: 'A', contractAmount: 120000 },
      { customerName: '申越实业', level: 'B+', contractAmount: 90000 },
    ],
    reminderLogs: [
      { triggerTime: '今日 09:05', triggerType: '系统自动提醒', target: '蔡文嘉', customer: '某某科技有限公司' },
      { triggerTime: '昨日 09:00', triggerType: '主管介入', target: '戴贤亮', customer: '开元贸易公司' },
    ],
  },
  'team-qiuxin': {
    label: '邱鑫组',
    targetAmount: 350000,
    achievedAmount: 240000,
    daysLeft: 25,
    highIntentPool: 12,
    ranking: [
      { name: '邱鑫', roleLabel: '销售组长', achievedAmount: 142000, targetAmount: 190000, badge: '稳定', highIntentCount: 4, overdueCount: 1, focusCustomer: '辰星供应链' },
      { name: '邵岩', roleLabel: '销售专员', achievedAmount: 98000, targetAmount: 160000, badge: '关注', highIntentCount: 3, overdueCount: 1, focusCustomer: '北辰制造' },
    ],
    alerts: [
      { type: '成员异常', items: ['邵岩 本月新增客户仅 2 家，低于目标节奏'] },
      { type: '超期未跟进', items: ['本组共有 2 条客户超过 48h 未跟进'] },
      { type: '渠道预警', items: ['快消行业渠道询盘下降，建议跟进老客转介绍'] },
    ],
    suggestions: [
      { customerName: '辰星供应链', level: 'A', contractAmount: 110000 },
      { customerName: '北辰制造', level: 'B+', contractAmount: 86000 },
    ],
    reminderLogs: [
      { triggerTime: '今日 09:05', triggerType: '系统自动提醒', target: '邵岩', customer: '北辰制造' },
      { triggerTime: '昨日 09:10', triggerType: '升级抄送主管', target: '邱鑫', customer: '辰星供应链' },
    ],
  },
};

export const REMINDER_RULE_DEFAULTS = {
  escalationRules: [
    {
      id: 'level-1',
      title: '第一级规则',
      triggerDays: 3,
      enabled: true,
      mode: 'notify',
      options: ['负责销售', '组长', '主管'],
      selectedOptions: ['负责销售'],
      template: '您负责的{客户名}已{未跟进天数}天未跟进，请尽快联系。',
    },
    {
      id: 'level-2',
      title: '第二级规则',
      triggerDays: 7,
      enabled: true,
      mode: 'notify',
      options: ['负责销售', '组长', '主管'],
      selectedOptions: ['负责销售', '组长'],
      template: '{客户名}已{未跟进天数}天未跟进，情况升级，请立即处理。',
    },
    {
      id: 'level-3',
      title: '第三级规则',
      triggerDays: 15,
      enabled: true,
      mode: 'notify',
      options: ['负责销售', '组长', '主管'],
      selectedOptions: ['负责销售', '组长', '主管'],
      template: '红色预警：{客户名}超{未跟进天数}天未跟进，主管必须介入。',
    },
    {
      id: 'level-4',
      title: '第四级规则（自动释放）',
      triggerDays: 30,
      enabled: true,
      mode: 'release',
      options: ['自动释放至公海池', '通知原负责人', '通知主管'],
      selectedOptions: ['自动释放至公海池', '通知原负责人', '通知主管'],
      template: '{客户名}因超期自动释放至公海，原负责人为{销售名}。',
    },
  ],
  specialRules: [
    {
      id: 'goal-alert',
      label: '月目标完成率低于',
      value: 50,
      unit: '%',
      enabled: true,
      options: ['当事销售', '主管'],
      selectedOptions: ['当事销售', '主管'],
    },
    {
      id: 'new-customer-follow',
      label: '新客户首次跟进时限',
      value: 3,
      unit: '天',
      enabled: true,
      options: ['负责销售', '组长'],
      selectedOptions: ['负责销售', '组长'],
    },
    {
      id: 'renewal-reminder',
      label: '续费客户提前提醒',
      value: 30,
      unit: '天',
      enabled: true,
      options: ['负责销售', '组长'],
      selectedOptions: ['负责销售', '组长'],
    },
  ],
  logs: [
    { triggerTime: '2026-05-06 09:05', level: '第一级', target: '蔡文嘉', customer: '某某科技有限公司', result: '已通知销售' },
    { triggerTime: '2026-05-06 09:05', level: '第一级', target: '邵岩', customer: '北辰制造', result: '已通知销售' },
    { triggerTime: '2026-05-05 09:00', level: '第二级', target: '戴贤亮', customer: '开元贸易公司', result: '已通知销售+组长' },
    { triggerTime: '2026-05-04 09:00', level: '第三级', target: '邱鑫', customer: '辰星供应链', result: '已通知销售+组长+主管' },
  ],
};

export const COMMISSION_RULE_DEFAULTS = {
  calcBase: '合同金额',
  employee: {
    pioneering: 15,
    low: 8,
    mid: 10,
    high: 12,
  },
  leader: {
    base: 5,
    bonus: 7,
    pioneeringBonus: 2,
  },
  director: {
    fixed: 5,
  },
  customerSuccess: {
    base: 2,
    satisfactionBonus: 0.5,
  },
  channelRules: [
    { level: '认证渠道', discount: 7.5, note: '标准认证合作伙伴' },
    { level: '金牌渠道', discount: 7.0, note: '年度业绩达标' },
    { level: '钻石渠道', discount: 6.5, note: '顶级战略合作伙伴' },
  ],
};

export const COMMISSION_MONTH_OPTIONS = [
  { value: '2026-05', label: '2026年05月' },
  { value: '2026-04', label: '2026年04月' },
];

export const COMMISSION_SUMMARY_ROWS = [
  {
    id: 'summary-2026-05-zhaole',
    month: '2026-05',
    ownerName: '赵乐',
    teamKey: 'all',
    roleType: 'sales-director',
    roleLabel: '销售总监',
    orderCount: 5,
    contractAmount: 208000,
    commissionAmount: 10400,
    payStatus: '待发放',
  },
  {
    id: 'summary-2026-05-daixianliang',
    month: '2026-05',
    ownerName: '戴贤亮',
    teamKey: 'team-daixianliang',
    roleType: 'sales-leader',
    roleLabel: '销售组长',
    orderCount: 3,
    contractAmount: 186000,
    commissionAmount: 11280,
    payStatus: '待发放',
  },
  {
    id: 'summary-2026-05-caiwenjia',
    month: '2026-05',
    ownerName: '蔡文嘉',
    teamKey: 'team-daixianliang',
    roleType: 'sales-specialist',
    roleLabel: '销售专员',
    orderCount: 4,
    contractAmount: 128000,
    commissionAmount: 9800,
    payStatus: '待发放',
  },
  {
    id: 'summary-2026-05-qiuxin',
    month: '2026-05',
    ownerName: '邱鑫',
    teamKey: 'team-qiuxin',
    roleType: 'sales-leader',
    roleLabel: '销售组长',
    orderCount: 3,
    contractAmount: 142000,
    commissionAmount: 8940,
    payStatus: '待发放',
  },
  {
    id: 'summary-2026-05-shaoyan',
    month: '2026-05',
    ownerName: '邵岩',
    teamKey: 'team-qiuxin',
    roleType: 'sales-specialist',
    roleLabel: '销售专员',
    orderCount: 2,
    contractAmount: 98000,
    commissionAmount: 7600,
    payStatus: '待发放',
  },
  {
    id: 'summary-2026-05-channel',
    month: '2026-05',
    ownerName: '华南渠道',
    teamKey: 'all',
    roleType: 'channel',
    roleLabel: '金牌渠道',
    orderCount: 2,
    contractAmount: 120000,
    commissionAmount: 5880,
    payStatus: '待发放',
  },
  {
    id: 'summary-2026-04-caiwenjia',
    month: '2026-04',
    ownerName: '蔡文嘉',
    teamKey: 'team-daixianliang',
    roleType: 'sales-specialist',
    roleLabel: '销售专员',
    orderCount: 3,
    contractAmount: 96000,
    commissionAmount: 8200,
    payStatus: '已发放',
  },
  {
    id: 'summary-2026-04-shaoyan',
    month: '2026-04',
    ownerName: '邵岩',
    teamKey: 'team-qiuxin',
    roleType: 'sales-specialist',
    roleLabel: '销售专员',
    orderCount: 2,
    contractAmount: 76000,
    commissionAmount: 6100,
    payStatus: '已发放',
  },
];

export const COMMISSION_PREVIEW_ROWS = [
  { roleLabel: '负责销售', formula: '¥120,000 × 12%', estimateAmount: 14400 },
  { roleLabel: '所属主管', formula: '利润 × 5%（约 ¥20,000）', estimateAmount: 1000 },
  { roleLabel: '渠道（金牌）', formula: '¥120,000 × 7 折 × 差价', estimateAmount: 5040 },
];

export const DAILY_REPORT_TEMPLATES = {
  admin: {
    description: '今天完成了各模块巡检，重点跟进了看板、提成与线索权限联动，确认当前异常集中在逾期客户和月度提成待审核。',
    preview: {
      todayDone: [
        '完成角色化工作台与团队作战图巡检，确认高优客户待分派情况。',
        '复核财务提成待发放记录，并同步督促规则最新执行情况。',
      ],
      nextPlan: [
        '继续跟进逾期客户释放规则是否按 30 天阈值执行。',
        '安排销售总监查看团队周报草稿。',
      ],
      stats: { followedCount: 5, newFollowCount: 6, dealCount: 2 },
    },
  },
  赵乐: {
    description: '今天复盘了团队高意向客户池，重点推进某某科技签约，并确认两组的本周待签客户分工。',
    preview: {
      todayDone: [
        '复盘全团队高意向客户池，确认某某科技进入签约推进阶段。',
        '对戴贤亮组和邱鑫组的逾期客户进行督促与资源再分配。',
      ],
      nextPlan: [
        '安排华南渠道复盘会议，补齐无新单原因。',
        '确认本周团队周报摘要并给出签约建议。',
      ],
      stats: { followedCount: 4, newFollowCount: 5, dealCount: 1 },
    },
  },
  戴贤亮: {
    description: '今天重点推进某某科技和开元贸易，上午确认了报价，下午协助蔡文嘉处理续费客户。',
    preview: {
      todayDone: [
        '推进某某科技报价确认，客户反馈积极。',
        '协助蔡文嘉复盘开元贸易续费沟通方案。',
      ],
      nextPlan: [
        '跟进某某科技合同条款。',
        '检查本组逾期客户是否全部回访。',
      ],
      stats: { followedCount: 3, newFollowCount: 4, dealCount: 1 },
    },
  },
  邱鑫: {
    description: '今天完成了辰星供应链二次拜访，并复核了邵岩本周的快消行业客户池。',
    preview: {
      todayDone: [
        '完成辰星供应链二次拜访，客户进入方案评估。',
        '复核邵岩快消行业客户池，确认 2 条高意向客户。',
      ],
      nextPlan: [
        '安排北辰制造报价推进。',
        '准备本组周报摘要。',
      ],
      stats: { followedCount: 3, newFollowCount: 3, dealCount: 0 },
    },
  },
  蔡文嘉: {
    description: '今天拜访了某某科技张总，他们对仓配服务有兴趣，需要我明天发送详细方案。下午跟进了开元贸易，客户暂时观望。',
    preview: {
      todayDone: [
        '拜访某某科技（张总），展示仓配服务方案，客户意向积极。',
        '跟进开元贸易，客户暂无采购计划，调整为低频跟进。',
      ],
      nextPlan: [
        '向某某科技发送详细方案并预约二次沟通。',
        '下周再次联系开元贸易，确认预算窗口。',
      ],
      stats: { followedCount: 2, newFollowCount: 2, dealCount: 0 },
    },
  },
  邵岩: {
    description: '今天重点联系了辰星供应链和北辰制造，快消行业客户反馈比预期积极，计划明天补充方案细节。',
    preview: {
      todayDone: [
        '联系辰星供应链，确认客户对快消仓配需求。',
        '推进北辰制造二次报价，客户要求补充交付周期说明。',
      ],
      nextPlan: [
        '补充北辰制造方案细节。',
        '继续跟进宏川商贸的首次拜访安排。',
      ],
      stats: { followedCount: 2, newFollowCount: 2, dealCount: 0 },
    },
  },
};

export const DAILY_REPORT_HISTORY_ROWS = [
  { id: 'report-2026-05-06-caiwenjia', ownerName: '蔡文嘉', teamKey: 'team-daixianliang', date: '2026-05-06', aiStatus: '已生成', submitStatus: '已提交' },
  { id: 'report-2026-05-05-caiwenjia', ownerName: '蔡文嘉', teamKey: 'team-daixianliang', date: '2026-05-05', aiStatus: '已生成', submitStatus: '已提交' },
  { id: 'report-2026-05-04-caiwenjia', ownerName: '蔡文嘉', teamKey: 'team-daixianliang', date: '2026-05-04', aiStatus: '未生成', submitStatus: '未提交' },
  { id: 'report-2026-05-06-shaoyan', ownerName: '邵岩', teamKey: 'team-qiuxin', date: '2026-05-06', aiStatus: '已生成', submitStatus: '已提交' },
  { id: 'report-2026-05-05-shaoyan', ownerName: '邵岩', teamKey: 'team-qiuxin', date: '2026-05-05', aiStatus: '已生成', submitStatus: '已提交' },
  { id: 'report-2026-05-06-daixianliang', ownerName: '戴贤亮', teamKey: 'team-daixianliang', date: '2026-05-06', aiStatus: '已生成', submitStatus: '已提交' },
  { id: 'report-2026-05-06-qiuxin', ownerName: '邱鑫', teamKey: 'team-qiuxin', date: '2026-05-06', aiStatus: '已生成', submitStatus: '已提交' },
  { id: 'report-2026-05-06-zhaole', ownerName: '赵乐', teamKey: 'all', date: '2026-05-06', aiStatus: '已生成', submitStatus: '已提交' },
];

export const WEEKLY_REPORT_SUMMARIES = {
  all: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：24 家  ·  新增跟进记录：31 条  ·  成交：3 单（¥38 万）',
    summary: '本周重点推进了某某科技、恒通物流和辰星供应链三条签约链路，戴贤亮组在续费推进上节奏较快，邱鑫组在线下拜访上转化更高。',
    nextPlan: ['推进某某科技合同签署', '安排华南渠道复盘', '清理超 48h 未跟进客户'],
  },
  'team-daixianliang': {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：12 家  ·  新增跟进记录：15 条  ·  成交：2 单（¥18.6 万）',
    summary: '本周戴贤亮组重点推进了某某科技和开元贸易，续费与方案推进节奏稳定，蔡文嘉新增 2 条高意向客户。',
    nextPlan: ['推进某某科技签约', '完成开元贸易续费确认', '补齐本组逾期客户回访'],
  },
  'team-qiuxin': {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：9 家  ·  新增跟进记录：11 条  ·  成交：1 单（¥9.8 万）',
    summary: '本周邱鑫组在快消与制造业客户推进上保持稳定，邵岩的线下拜访带来了较好的转化线索。',
    nextPlan: ['推进辰星供应链二次报价', '安排北辰制造方案说明会', '补录本周历史日报'],
  },
  admin: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '系统巡检：5 项模块完成联调  ·  待发提成：¥58,200  ·  督促规则执行：18 次',
    summary: '本周核心工作是联通角色化看板、提成管理与督促规则，整体业务链路闭合，但仍需关注逾期客户释放与提成发放节奏。',
    nextPlan: ['复核 30 天自动释放规则', '安排销售总监查看周报草稿', '继续巡检角色权限边界'],
  },
  赵乐: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：8 家  ·  新增跟进记录：10 条  ·  成交：1 单（¥20.8 万）',
    summary: '本周完成了团队高意向客户池复盘，并推动某某科技进入签约阶段。',
    nextPlan: ['推进团队合同签约', '复盘华南渠道', '确认月中团队资源分配'],
  },
  戴贤亮: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：6 家  ·  新增跟进记录：8 条  ·  成交：1 单（¥18.6 万）',
    summary: '本周戴贤亮重点推进某某科技与开元贸易，续费跟进明显提速。',
    nextPlan: ['完成某某科技合同确认', '补齐逾期客户回访'],
  },
  邱鑫: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：5 家  ·  新增跟进记录：6 条  ·  成交：0 单',
    summary: '本周重点完成辰星供应链和北辰制造的方案推进，组内客户节奏平稳。',
    nextPlan: ['推进北辰制造报价', '整理组内周报摘要'],
  },
  蔡文嘉: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：12 家  ·  新增跟进记录：15 条  ·  成交：1 单（¥12.8 万）',
    summary: '本周重点推进了某某科技和恒通物流的方案跟进，某某科技已进入签约阶段。',
    nextPlan: ['推进某某科技合同签署', '安排明达服务首次拜访', '继续跟进开元贸易'],
  },
  邵岩: {
    weekLabel: '第18周（2026.04.28-05.04）',
    metrics: '跟进客户总数：9 家  ·  新增跟进记录：11 条  ·  成交：0 单',
    summary: '本周快消行业客户反馈较好，辰星供应链与北辰制造进入重点跟进阶段。',
    nextPlan: ['补充北辰制造方案细节', '安排宏川商贸首次拜访'],
  },
};
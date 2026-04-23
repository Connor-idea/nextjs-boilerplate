import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Briefcase, Clock, Users, Target, 
  ChevronLeft, Save, X, Plus, Sparkles, TrendingUp,
  AlertCircle, Lightbulb, CheckCircle2, ChevronRight, AlertTriangle, Flag,
  Settings, User, Calendar, BarChart2, Activity, Bot, Edit2, Building2, Sliders, Check,
  ChevronDown, CalendarDays, Phone, MessageSquare, Star, Loader2, TrendingDown,
  FileText, MonitorPlay, List, ArrowUpDown, Clock3, Ban, Archive, ShieldAlert, Inbox
} from 'lucide-react';

// --- Mock Data ---
const initialSalesData = [
  {
    id: '1',
    name: '张梓涵',
    gender: '女', age: 28,
    birthDate: '1996-05-12', hireDate: '2020-02-15',
    avatar: 'https://i.pravatar.cc/150?u=11',
    location: '北京市怀柔区某街道',
    industries: ['互联网', '高新制造'],
    position: '高级大客户经理', tenure: '4年2个月',
    skills: ['SaaS解决方案', '政企采购', '高管谈判'],
    aiSuggestedTags: ['成交周期短', '方案撰写专家'], 
    targets: { targetAmount: '150万', targetNewCustomers: 30, targetConversionRate: '5%' },
    taskLoad: { weeklyFollowUps: 45, pendingVisits: 2, status: '正常', weight: 100, dailyCapacity: { leads: 60, customers: 15 } },
    followUpCount: 156, visitedCount: 32, intentCustomers: 14,
    metrics: {
      cumulativeCustomers: 320,
      cumulativeAmount: '1250万',
      monthlyNewCustomers: 24,
      monthlyClosedCount: 8,
      monthlyClosedAmount: '168',
      monthlyConversionRate: '2.5',
      warnings: [],
      intentList: [
        { name: '字节跳动-企业效能部', level: 'A级', budget: '100万', estimatedClose: '下周三', daysFollowedUp: 4, content: '客户对SaaS定制化方案表示认可，要求下周出具正式的商务报价。', followUp: '4天前' },
        { name: '京东物流-华北区', level: 'B级', budget: '50万', estimatedClose: '本月底', daysFollowedUp: 2, content: '确认法务合同已走完内部审批流程，提醒并催促对方尽快完成盖章。', followUp: '前天' },
        { name: '小红书', level: 'C级', budget: '评估中', estimatedClose: '评估中', daysFollowedUp: 10, content: '发送了初步的产品介绍白皮书，客户表示内部正在收集各部门需求，月底再定。', followUp: '上周三' },
        { name: '美团-商业化中心', level: 'B级', budget: '80万', estimatedClose: '下个月', daysFollowedUp: 8, content: '完成了第二轮系统演示，客户技术团队就数据隐私安全提出了几个疑问，已发邮件解答。', followUp: '上周一' }
      ],
      contractList: [
        { name: '腾讯云', amount: '85万', product: 'SaaS私有化部署', date: '10月12日' },
        { name: '百度智能云', amount: '60万', product: '积分商城SaaS 1年订阅', date: '10月08日' },
        { name: '快手科技', amount: '23万', product: '综合产品包', date: '10月02日' }
      ],
      abnormalCases: [
        { name: '滴滴出行-本地生活', type: '流失客户', reason: '竞品低价抢标，未能体现差异化价值', date: '今天 10:00' },
        { name: '河北某制造厂', type: '无效线索', reason: '核心对接人已离职，无新负责人接洽', date: '10月15日' },
        { name: '天津某物流公司', type: '退回线索池', reason: '项目预算严重不足，不符合大客准入标准', date: '10月10日' }
      ]
    },
    funnelData: { 
      '累计': { leads: 1250, customers: 320, closed: 65, amount: '1250万' },
      '当月': { leads: 120, customers: 24, closed: 8, amount: '168万' },
      '行业': { leads: 85, customers: 15, closed: 6, amount: '120万' },
      'AI推荐': { leads: 60, customers: 12, closed: 5, amount: '95万' }
    },
    burndown: {
      labels: ['0天', '1天', '2天', '3天', '4天', '5天', '7天+'],
      overdueLeads: [15, 10, 5, 2, 0, 0, 0], 
      levelA: [8, 2, 0, 0, 0, 0, 0],
      levelB: [12, 8, 4, 1, 0, 0, 0],
      levelC: [20, 15, 10, 5, 2, 0, 0],
      levelD: [30, 25, 20, 15, 10, 5, 2]
    },
    records: [
      { date: '今天 14:30', type: '线下拜访', location: '客户北京总部3层会议室', client: '字节跳动-企业效能部', contact: '王总 (CTO), 刘经理 (采购)', purpose: 'POC测试复盘与商务预热', content: '详细演示了POC测试报告，客户对SaaS定制化方案的各项性能指标表示认可。进一步沟通了部署周期，客户明确要求我方下周三前出具正式商务报价及实施排期表。', status: 'A级客户' },
      { date: '昨天 10:15', type: '预约产品演示demo', location: '线上会议室', client: '新浪微博', contact: '张总监 (IT部)', purpose: '系统扩容规划演示', content: '为客户IT团队进行了新版权限管理模块的产品演示Demo，客户对坐席分配逻辑很满意，预计新增坐席500个。', status: 'B级客户' },
      { date: '本周一 16:00', type: '发送报价单', location: '企业邮箱', client: '京东物流-华北区', contact: '李经理 (业务侧)', purpose: '发送年度框架报价', content: '根据前期沟通的实施细则，已向客户发送正式的商务报价单，包含基础版+增值服务包，等待对方内部比价反馈。', status: 'A级客户' }
    ],
    analysis: {
      successBehaviors: '善于在早期识别决策链，通过定制化方案快速锁定预算。',
      errorAreas: '在合同法务审核阶段跟进不够紧密。',
      touchpoints: 'POC阶段结束后的第一次复盘会议。',
      optimization: '建议法务流程提前介入。'
    }
  },
  {
    id: '2',
    name: '李宇轩',
    gender: '男', age: 26,
    birthDate: '1998-03-08', hireDate: '2022-04-10',
    avatar: 'https://i.pravatar.cc/150?u=22',
    location: '上海市浦东新区',
    industries: ['快消品', '零售餐饮'],
    position: '销售经理', tenure: '2年',
    skills: ['快消行业', '地推能力', '抗压能力强'],
    aiSuggestedTags: ['客情维护极佳', '高频拜访型'],
    targets: { targetAmount: '80万', targetNewCustomers: 50, targetConversionRate: '4%' },
    taskLoad: { weeklyFollowUps: 82, pendingVisits: 6, status: '饱满', weight: 80, dailyCapacity: { leads: 100, customers: 20 } },
    followUpCount: 204, visitedCount: 59, intentCustomers: 21,
    metrics: {
      cumulativeCustomers: 580,
      cumulativeAmount: '860万',
      monthlyNewCustomers: 45,
      monthlyClosedCount: 12,
      monthlyClosedAmount: '76',
      monthlyConversionRate: '2.0',
      warnings: ['当月转换率 (2.0%) 低于组内均线，客户盘子大但收口转化较弱'],
      intentList: [
        { name: '百联集团', level: 'B级', budget: '30万', estimatedClose: '本周五', daysFollowedUp: 7, content: '送去中秋礼盒并介绍下半年的最新促销活动政策。', followUp: '7天前' }, 
        { name: '光明乳业', level: 'C级', budget: '20万', estimatedClose: '评估中', daysFollowedUp: 12, content: '发送了重新核算后的产品组合报价单，客户表示单价偏高。', followUp: '12天前' },
        { name: '全家便利店', level: 'C级', budget: '30万', estimatedClose: '评估中', daysFollowedUp: 16, content: '初步互换名片，了解了对方今年的拓店计划。', followUp: '16天前' },
        { name: '来伊份', level: 'D级', budget: '未知', estimatedClose: '评估中', daysFollowedUp: 45, content: '拨打电话未接通，后续再尝试联系。', followUp: '45天前' }
      ],
      contractList: [
        { name: '大润发', amount: '45万', product: '综合产品包', date: '10月15日' }, 
        { name: '盒马鲜生', amount: '31万', product: '积分商城SaaS 1年订阅', date: '10月05日' }
      ],
      abnormalCases: [
        { name: '喜茶(某大区)', type: '暂停合作', reason: '客户内部组织架构大调整，业务全部暂停', date: '昨天 16:30' },
        { name: '某夫妻便利店', type: '无效线索', reason: '单店模式，无系统化管理需求', date: '10月18日' },
        { name: '联华超市(加盟商)', type: '退回线索池', reason: '加盟商无自主采购权，需从集团统采切入', date: '10月12日' }
      ]
    },
    funnelData: { 
      '累计': { leads: 2500, customers: 580, closed: 85, amount: '860万' },
      '当月': { leads: 250, customers: 45, closed: 12, amount: '76万' },
      '行业': { leads: 180, customers: 30, closed: 8, amount: '50万' },
      'AI推荐': { leads: 120, customers: 22, closed: 7, amount: '45万' }
    },
    burndown: {
      labels: ['0天', '1天', '2天', '3天', '4天', '5天', '7天+'],
      overdueLeads: [45, 35, 25, 15, 10, 5, 2],
      levelA: [2, 1, 0, 0, 0, 0, 0],
      levelB: [15, 10, 5, 2, 1, 0, 0],
      levelC: [40, 30, 20, 10, 5, 2, 0],
      levelD: [80, 70, 60, 40, 20, 10, 5]
    },
    records: [
      { date: '今天 09:30', type: '线下拜访', location: '百联集团总部大楼', client: '百联集团', contact: '陈总 (市场部)', purpose: '中秋客情维护及新政策宣发', content: '送去中秋礼盒，并在闲聊中介绍下半年的最新促销活动政策，客户表示对满减组合有一定兴趣，约定后续再细聊。', status: 'C级客户' },
      { date: '昨天 15:40', type: '发送报价单', location: '微信发送', client: '光明乳业', contact: '赵经理 (采购部)', purpose: '跟进产品组合方案反馈', content: '发送了重新核算后的产品组合报价单，客户表示整体单价依然偏高，且目前正在对接两家竞品比价，推进遇到一定阻力。', status: 'C级客户' }
    ],
    analysis: {
      successBehaviors: '极高的拜访频次和极强的客情维护能力，客户信任度高。',
      errorAreas: '对复杂产品组合的方案价值传递不足，多以单产品切入。',
      touchpoints: '线下的业务聚会和非正式交流场合。',
      optimization: '主管需定期介入指导其制作整合营销方案。'
    }
  },
  {
    id: '3',
    name: '王诗语',
    gender: '女', age: 31,
    birthDate: '1993-11-20', hireDate: '2019-03-01',
    avatar: 'https://i.pravatar.cc/150?u=33',
    location: '深圳市南山区',
    industries: ['金融', '保险'],
    position: '解决方案销售', tenure: '5年',
    skills: ['金融科技', '技术背景', '招投标'],
    aiSuggestedTags: ['合规把控', 'CTO对话级'],
    targets: { targetAmount: '300万', targetNewCustomers: 15, targetConversionRate: '2%' },
    taskLoad: { weeklyFollowUps: 30, pendingVisits: 1, status: '空闲', weight: 120, dailyCapacity: { leads: 30, customers: 10 } },
    followUpCount: 98, visitedCount: 14, intentCustomers: 8,
    metrics: {
      cumulativeCustomers: 85,
      cumulativeAmount: '2400万',
      monthlyNewCustomers: 12,
      monthlyClosedCount: 2,
      monthlyClosedAmount: '405',
      monthlyConversionRate: '2.3',
      warnings: [],
      intentList: [
        { name: '招商银行', level: 'A级', budget: '500万', estimatedClose: '下个月', daysFollowedUp: 1, content: '提供了全私有化部署架构演示，彻底打消了合规顾虑，准备推进招投标。', followUp: '昨天' }, 
        { name: '平安保险', level: 'A级', budget: '350万', estimatedClose: '本月底', daysFollowedUp: 4, content: '整理并发送了最新的招投标文件初稿、实施明细以及项目整体报价单。', followUp: '4天前' },
        { name: '微众银行(二期)', level: 'B级', budget: '120万', estimatedClose: '下个月', daysFollowedUp: 6, content: '跟进二期扩容进度，客户反馈预算审批延后到下个月。', followUp: '6天前' }
      ],
      contractList: [
        { name: '微众银行', amount: '260万', product: 'SaaS私有化部署', date: '10月18日' }, 
        { name: '南方基金', amount: '145万', product: '综合产品包', date: '10月11日' }
      ],
      abnormalCases: [
        { name: '某城商行', type: '流失客户', reason: '合规评审未通过，客户最终转向本地具备国企背景的供应商', date: '10月25日' },
        { name: '某地方农商行', type: '暂停合作', reason: '因行内架构调整，项目预算遭冻结，建议明年Q2再议', date: '10月20日' }
      ]
    },
    funnelData: { 
      '累计': { leads: 350, customers: 85, closed: 18, amount: '2400万' },
      '当月': { leads: 80, customers: 12, closed: 2, amount: '405万' },
      '行业': { leads: 60, customers: 8, closed: 2, amount: '405万' },
      'AI推荐': { leads: 40, customers: 5, closed: 1, amount: '180万' }
    },
    burndown: {
      labels: ['0天', '1天', '2天', '3天', '4天', '5天', '7天+'],
      overdueLeads: [5, 2, 0, 0, 0, 0, 0],
      levelA: [10, 5, 1, 0, 0, 0, 0],
      levelB: [8, 4, 2, 0, 0, 0, 0],
      levelC: [5, 3, 1, 0, 0, 0, 0],
      levelD: [10, 8, 5, 3, 1, 0, 0]
    },
    records: [
      { date: '今天 11:00', type: '线下拜访', location: '招商银行科技大楼', client: '招商银行', contact: '周总 (数据架构师)', purpose: '项目架构评审与合规答疑', content: '参与项目架构深度评审，针对客户重点关注的数据合规性和安全性问题，提供了全私有化部署架构演示，彻底打消了客户顾虑。', status: 'A级客户' },
      { date: '上周五 14:00', type: '发送报价单', location: '企业邮箱', client: '平安保险', contact: '孙经理 (招投标办)', purpose: '发送预审文件与报价', content: '整理并发送了最新的招投标文件初稿、实施明细以及项目整体报价单供客户预审，等待反馈修改意见。', status: 'B级客户' }
    ],
    analysis: {
      successBehaviors: '技术底子深厚，能直接与客户CTO对话。',
      errorAreas: '对于小预算的短平快项目缺乏耐心。',
      touchpoints: '架构评审会和安全合规答疑环节。',
      optimization: '建议将其定位为纯大客打猎型销售。'
    }
  },
  {
    id: '4',
    name: '吴优',
    gender: '女', age: 23,
    birthDate: '2001-07-05', hireDate: '2023-08-01',
    avatar: 'https://i.pravatar.cc/150?u=77',
    location: '武汉市洪山区',
    industries: ['电子商务', '教育培训'],
    position: 'SDR/电话销售', tenure: '8个月',
    skills: ['高频外呼', '情绪管理'],
    aiSuggestedTags: ['线索挖掘机', '破冰留存高'],
    targets: { targetAmount: '15万', targetNewCustomers: 150, targetConversionRate: '0.8%' },
    taskLoad: { weeklyFollowUps: 200, pendingVisits: 5, status: '超负荷', weight: 50, dailyCapacity: { leads: 150, customers: 30 } },
    followUpCount: 850, visitedCount: 18, intentCustomers: 45,
    metrics: {
      cumulativeCustomers: 1520,
      cumulativeAmount: '86万',
      monthlyNewCustomers: 120,
      monthlyClosedCount: 10,
      monthlyClosedAmount: '15.3',
      monthlyConversionRate: '0.6',
      warnings: ['由于客户基数过大，当月转换率(0.6%)触底，建议系统进行死海回收清洗'],
      intentList: [
        { name: '良品铺子', level: 'C级', budget: '5万', estimatedClose: '本周', daysFollowedUp: 1, content: '成功邀约了明天的线上产品演示Demo，预计30分钟。', followUp: '昨天' }, 
        { name: '斗鱼直播', level: 'B级', budget: '8万', estimatedClose: '下周', daysFollowedUp: 2, content: '安排了售前技术支持进行专属的线上Demo演示与答疑。', followUp: '前天' },
        { name: '三只松鼠', level: 'D级', budget: '3万', estimatedClose: '评估中', daysFollowedUp: 14, content: '对方反馈需要和领导确认，让下周再联系。', followUp: '14天前' },
        { name: '完美日记', level: 'D级', budget: '2万', estimatedClose: '评估中', daysFollowedUp: 26, content: '发送了系统使用手册，对方一直未回复。', followUp: '26天前' },
        { name: '周黑鸭', level: 'C级', budget: '未知', estimatedClose: '评估中', daysFollowedUp: 38, content: '发送了单门店版的基础报价单，客户反馈预算已收紧。', followUp: '38天前' }
      ],
      contractList: [
        { name: '卓尔控股', amount: '10万', product: '积分商城SaaS 1年订阅', date: '10月20日' }, 
        { name: '九州通医药', amount: '5.3万', product: '综合产品包', date: '10月04日' }
      ],
      abnormalCases: [
        { name: '未知线索A', type: '无效线索', reason: '空号 / 接通后对方直接挂断', date: '今天 11:45' },
        { name: '周黑鸭', type: '退回线索池', reason: '今年门店预算收紧，近期无相关计划', date: '昨天 14:20' },
        { name: '某初创微商', type: '无效线索', reason: '非目标客群，组织规模太小', date: '上周五' },
        { name: '小王个人创业', type: '无效线索', reason: '个人性质无预算，白嫖资料', date: '本周三' },
        { name: '同行探盘', type: '无效线索', reason: '测试发现对方是某竞品的销售假冒', date: '本周一' }
      ]
    },
    funnelData: { 
      '累计': { leads: 8500, customers: 1520, closed: 85, amount: '86万' },
      '当月': { leads: 850, customers: 120, closed: 10, amount: '15.3万' },
      '行业': { leads: 500, customers: 80, closed: 6, amount: '9万' },
      'AI推荐': { leads: 300, customers: 45, closed: 5, amount: '8万' }
    },
    burndown: {
      labels: ['0天', '1天', '2天', '3天', '4天', '5天', '7天+'],
      overdueLeads: [150, 120, 90, 60, 40, 20, 10],
      levelA: [5, 2, 0, 0, 0, 0, 0],
      levelB: [20, 15, 10, 5, 2, 0, 0],
      levelC: [80, 60, 40, 20, 10, 5, 0],
      levelD: [120, 100, 80, 60, 40, 20, 10]
    },
    records: [
      { date: '今天 16:30', type: '预约产品演示demo', location: '线上会议室', client: '良品铺子', contact: '吴经理 (电商运营)', purpose: '初步展示系统功能', content: '客户对营销活动案例很感兴趣，已成功为其预约了明天的线上产品演示Demo，预计30分钟。', status: 'B级客户' },
      { date: '今天 15:10', type: '预约产品演示demo', location: '线上会议室', client: '斗鱼直播', contact: '郑主管 (技术运维)', purpose: '技术答疑与实操演示', content: '针对客户的具体API对接疑问，安排了售前技术支持进行专属的线上Demo演示与答疑，建立信任。', status: 'B级客户' },
      { date: '昨天 14:20', type: '发送报价单', location: '微信发送', client: '周黑鸭', contact: '王店长', purpose: '跟进门店采购意向', content: '发送了单门店版的基础报价单，但客户明确表示今年门店预算已收紧，近期无相关采购计划，转入沉睡池。', status: 'C级客户' }
    ],
    analysis: {
      successBehaviors: '抗压能力极强，前30秒破冰留存率极高。',
      errorAreas: '面对复杂问题时容易卡壳。',
      touchpoints: '首次接通电话的前30秒。',
      optimization: '加强核心产品价值主张培训。'
    }
  }
];

// SLA 预警天数阈值配置
const SLA_LIMITS = { 'A级': 3, 'B级': 7, 'C级': 14, 'D级': 30 };

// 根据SLA判定健康状态
const getSlaStatus = (level, days) => {
  const limit = SLA_LIMITS[level] || 30;
  if (days > limit) return 'overdue';     
  if (days === limit || days === limit - 1) return 'warning'; 
  return 'healthy';                       
};

/**
 * 解析中文时间字符串为排序权重，数值越大表示越接近现在
 * @param {string} dateStr - 中文时间字符串（如“今天”、“昨天”、“3月兔15日”）
 * @returns {number} 排序权重
 */
const parseDateWeight = (dateStr) => {
  if (!dateStr) return 0;
  if (dateStr.includes('今天')) return 10000 + (parseInt(dateStr.match(/\d+/)) || 0); 
  if (dateStr.includes('刚刚')) return 10000;
  if (dateStr.includes('昨天')) return 9000;
  if (dateStr.includes('前天')) return 8000;
  if (dateStr.includes('本周')) return 7000;
  if (dateStr.includes('上周')) return 6000;
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (match) {
    return parseInt(match[1]) * 100 + parseInt(match[2]);
  }
  return 0;
};

// --- 通用空状态组件 ---
const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-slate-400 w-full h-full min-h-[200px]">
    <Icon className="w-10 h-10 mb-3 text-slate-200" strokeWidth={1.5} />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

/** 销售画像管理主模块
 * @param {Object} props
 * @param {'manager'|'sales'} props.userRole - 当前登录用户角色
 */
export default function ProfileModule({ userRole = 'manager' }) {
  const [view, setView] = useState('list');
  const [salesList, setSalesList] = useState(initialSalesData);
  const [selectedUser, setSelectedUser] = useState(null);

  /**
   * 跳转至指定销售人的详情页
   * @param {Object} user - 销售人数据对象
   */
  const handleViewDetail = (user) => { 
    setSelectedUser(user); 
    setView('detail'); 
    window.scrollTo(0, 0); 
  };
  
  /** 返回销售列表页 */
  const handleBackToList = () => { 
    setView('list'); 
    setSelectedUser(null); 
  };
  
  /**
   * 保存销售人信息更改
   * @param {Object} updatedUser - 修改后的销售人对象
   */
  const handleSaveUser = (updatedUser) => {
    setSalesList(salesList.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(updatedUser);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans">
      {/* 虽然Header使用sticky，但由于父容器overflow-y-auto，sticky会在滚动容器内工作 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center"><TrendingUp className="text-white w-5 h-5" /></div>
          <h1 className="text-xl font-bold">SalesPro CRM <span className="text-sm font-normal text-slate-500 ml-2">销售画像管理</span></h1>
        </div>
      </header>
      <main className="max-w-[1440px] mx-auto p-4 md:p-6 pb-10">
        {view === 'list' ? (
          <SalesList salesList={salesList} onViewDetail={handleViewDetail} />
        ) : (
          <SalesDetail user={selectedUser} onBack={handleBackToList} onSave={handleSaveUser} />
        )}
      </main>
    </div>
  );
}

function SalesList({ salesList, onViewDetail }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = salesList.filter(user => {
    return user.name.includes(searchTerm) || user.position.includes(searchTerm);
  });

  // 按职位进行分组聚合逻辑
  const groupedSales = filteredList.reduce((acc, user) => {
    if (!acc[user.position]) acc[user.position] = [];
    acc[user.position].push(user);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-4 shadow-sm border border-slate-100 flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="搜索姓名、职位..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" 
            onChange={(e)=>setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      
      {/* 下方：画像卡片三列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredList.map(user => (
          <div key={user.id} className="bg-white border border-slate-200 p-6 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer relative flex flex-col" onClick={() => onViewDetail(user)}>
            <div className="flex justify-between items-start mb-5">
               <div className="flex items-center gap-4">
                 <img src={user.avatar} className="w-12 h-12 object-cover border border-slate-100" />
                 <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{user.name}</h3>
                    <span className="text-xs text-slate-400 font-medium">最近活跃</span>
                 </div>
               </div>
               <button className="text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 p-1.5transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
               <span className="px-2.5 py-1.5 bg-cyan-50 text-cyan-700 text-xs border border-cyan-100 truncate flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1.5"/>{user.position}</span>
               <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs truncate flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5"/>{user.tenure}</span>
               <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs truncate flex items-center"><User className="w-3.5 h-3.5 mr-1.5"/>{user.gender} · {user.age}岁</span>
               <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs truncate flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5"/>{user.location}</span>
            </div>

            <div className="flex items-center text-xs mb-6 text-slate-600 truncate px-1">
              <span className="text-slate-400 mr-2 shrink-0 font-medium">核心技能：</span><span className="truncate">{user.skills.join('，')}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3.5">
               <div className="flex flex-col border-r border-slate-200">
                 <span className="text-slate-400 flex items-center mb-1 text-xs font-medium"><Users className="w-3.5 h-3.5 mr-1.5"/>总客户数</span>
                 <span className="font-bold text-slate-800 text-base">{user.metrics.cumulativeCustomers} <span className="text-xs font-normal text-slate-500">家</span></span>
               </div>
               <div className="flex flex-col pl-3">
                 <span className="text-slate-400 flex items-center mb-1 text-xs font-medium"><TrendingUp className="w-3.5 h-3.5 mr-1.5"/>当月成交</span>
                 <span className="font-bold text-blue-600 text-base">{user.metrics.monthlyClosedAmount} <span className="text-xs font-normal text-slate-500">万</span></span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 漏斗图面板组件
 * 以等腰梯形序列可视化展示线索转化各阶段及相邻阶段转化率。
 * @param {Object} props
 * @param {string} props.title - 面板标题
 * @param {string} props.subtitle - 面板副标题
 * @param {'blue'|'emerald'} [props.colorScheme='blue'] - 配色方案
 * @param {Array<{name:string, count:number, extra?:string}>} props.stages - 各漏斗阶段数据
 */
function FunnelPanel({ title, subtitle, stages, colorScheme = 'blue' }) {
  const schemes = {
    blue: {
      header: 'from-blue-50 to-slate-50',
      dot: 'bg-blue-600',
      colors: ['#BFDBFE', '#93C5FD', '#3B82F6', '#2563EB', '#1E40AF'],
      textDark: ['text-blue-800', 'text-blue-800'],
      textLight: ['text-white', 'text-white', 'text-white'],
    },
    emerald: {
      header: 'from-emerald-50 to-slate-50',
      dot: 'bg-emerald-500',
      colors: ['#A7F3D0', '#6EE7B7', '#10B981', '#059669', '#047857'],
      textDark: ['text-emerald-800', 'text-emerald-800'],
      textLight: ['text-white', 'text-white', 'text-white'],
    },
  };
  const s = schemes[colorScheme];

  const getTextColor = (i) =>
    i < s.textDark.length ? s.textDark[i] : s.textLight[i - s.textDark.length] || 'text-white';

  const maxW = 100, minW = 42;
  const step = stages.length > 1 ? (maxW - minW) / (stages.length - 1) : 0;

  const overallRate =
    stages.length >= 2 && stages[0].count > 0
      ? ((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(2)
      : '0.00';

  return (
    <div className="border border-slate-200 overflow-hidden shadow-sm">
      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${s.header} border-b border-slate-200`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className="text-sm font-bold text-slate-800">{title}</span>
        </div>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>

      <div className="px-6 py-5 flex flex-col items-center">
        {stages.map((stage, i) => {
          const widthPct = maxW - step * i;
          const convRate =
            i > 0 && stages[i - 1].count > 0
              ? ((stage.count / stages[i - 1].count) * 100).toFixed(1)
              : null;

          return (
            <div key={stage.name} className="w-full flex flex-col items-center">
              {/* 转化率箭头 */}
              {convRate !== null && (
                <div className="flex items-center gap-1.5 py-1.5 text-[11px] text-slate-400">
                  <div className="w-px h-2.5 bg-slate-300" />
                  <span className="font-semibold text-slate-500">{convRate}% 转化</span>
                  <div className="w-px h-2.5 bg-slate-300" />
                </div>
              )}
              {/* 梯形块 */}
              <div
                style={{
                  width: `${widthPct}%`,
                  background: s.colors[Math.min(i, s.colors.length - 1)],
                  clipPath:
                    i < stages.length - 1
                      ? 'polygon(0% 0%, 100% 0%, 93% 100%, 7% 100%)'
                      : 'none',
                  padding: '9px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'width 0.4s ease',
                }}
              >
                <span className={`text-[11px] font-semibold ${getTextColor(i)}`}>{stage.name}</span>
                <span className={`text-sm font-black ${getTextColor(i)}`}>
                  {typeof stage.count === 'number' ? stage.count.toLocaleString() : stage.count}
                </span>
                {stage.extra && (
                  <span className={`text-[10px] ${getTextColor(i)} opacity-80`}>{stage.extra}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* 总体转化率 */}
        <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
          <span className="text-slate-500">总体转化率（线索→成交）</span>
          <span className={`font-bold ${colorScheme === 'emerald' ? 'text-emerald-600' : 'text-blue-600'}`}>
            {overallRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

function SalesDetail({ user, onBack, onSave }) {
  const [formData, setFormData] = useState({ ...user });
  const [activeTab, setActiveTab] = useState('metrics'); 
  
  const [editStates, setEditStates] = useState({ 
    aiConfig: false,
  });
  
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [modalTargetData, setModalTargetData] = useState({ ...formData.targets });
  
  // 漏斗多维筛选状态
  const [funnelLeadType, setFunnelLeadType] = useState('全部');
  const [funnelCustType, setFunnelCustType] = useState('全部');
  const [funnelIndustry, setFunnelIndustry] = useState('全部');

  // 排序与筛选状态
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [abnormalFilter, setAbnormalFilter] = useState('全部');

  const [newTag, setNewTag] = useState('');
  const [newInd, setNewInd] = useState('');

  useEffect(() => { 
    try {
      if (user && user.targets && user.aiConfig !== undefined) {
        setFormData({ ...user }); 
        setModalTargetData({ ...user.targets });
        setActiveTab('metrics'); 
        setEditStates({ 
          aiConfig: false, 
        });
        setShowTargetModal(false);
        setNewTag('');
        setNewInd('');
        setFunnelLeadType('全部');
        setFunnelCustType('全部');
        setFunnelIndustry('全部');
        setSortConfig({ key: null, direction: 'asc' });
        setAbnormalFilter('全部');
      }
    } catch(err) {
      console.error('ProfileModule useEffect error:', err);
    }
  }, [user]);

  /** 各漏斗筛选维度的数量乘数 */
  const FUNNEL_LEAD_TYPE_SCALE = { '全部': 1.0, '销售线索': 0.45, '公司线索': 0.38, 'AI推客': 0.35, '再分配线索': 0.17 };
  const FUNNEL_CUST_TYPE_SCALE = { '全部': 1.0, '新客户': 0.65, '复购客户': 0.35 };
  const FUNNEL_INDUSTRY_SCALE  = { '全部': 1.0, '互联网': 0.42, '高新制造': 0.31, '金融': 0.16, '零售': 0.11 };

  const toggleEdit = (sectionKey) => {
    setEditStates(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };
  
  const saveSection = (sectionKey) => {
    toggleEdit(sectionKey);
    onSave(formData); 
  };

  const cancelSection = (sectionKey) => {
    setFormData({ ...user }); 
    toggleEdit(sectionKey);
    if (sectionKey === 'aiConfig') {
      setNewTag('');
      setNewInd('');
    }
  };

  const saveTargetModal = () => {
    const updatedData = { ...formData, targets: modalTargetData };
    setFormData(updatedData);
    onSave(updatedData);
    setShowTargetModal(false);
  };

  const updateField = (section, field, value) => {
    if (section) {
      setFormData({ ...formData, [section]: { ...formData[section], [field]: value } });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(newTag.trim())) {
        updateField(null, 'skills', [...formData.skills, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    updateField(null, 'skills', formData.skills.filter(t => t !== tag));
  };

  const addInd = (e) => {
    if (e.key === 'Enter' && newInd.trim()) {
      e.preventDefault();
      if (!formData.industries.includes(newInd.trim())) {
        updateField(null, 'industries', [...formData.industries, newInd.trim()]);
      }
      setNewInd('');
    }
  };

  const removeInd = (ind) => {
    updateField(null, 'industries', formData.industries.filter(i => i !== ind));
  };

  const getDiffText = (oldStr, newStr) => {
    const oldVal = parseFloat(oldStr) || 0;
    const newVal = parseFloat(newStr) || 0;
    const diff = newVal - oldVal;
    if (!newStr || diff === 0) return <span className="text-[10px] text-slate-400 font-medium">持平</span>;
    if (diff > 0) return <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5border border-emerald-100">↑ 上调 {diff}</span>;
    return <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5border border-rose-100">↓ 下调 {Math.abs(diff)}</span>;
  };

  // 意向表格多维排序逻辑
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedIntentList = [...formData.metrics.intentList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'level') {
      const weight = { 'A级': 4, 'B级': 3, 'C级': 2, 'D级': 1 };
      return ((weight[a.level] || 0) - (weight[b.level] || 0)) * modifier;
    }
    if (key === 'budget') {
      const valA = parseFloat(a.budget) || 0;
      const valB = parseFloat(b.budget) || 0;
      return (valA - valB) * modifier;
    }
    if (key === 'estimatedClose') {
      const getWeight = (str) => {
        if (!str || str === '评估中') return 0;
        if (str.includes('明天') || str.includes('今天')) return 100;
        if (str.includes('本周')) return 90;
        if (str.includes('下周')) return 80;
        if (str.includes('月底')) return 70;
        if (str.includes('下月')) return 60;
        return 50;
      };
      return (getWeight(a.estimatedClose) - getWeight(b.estimatedClose)) * modifier;
    }
    if (key === 'daysFollowedUp') {
      const valA = parseInt(a.daysFollowedUp) || 0;
      const valB = parseInt(b.daysFollowedUp) || 0;
      return (valA - valB) * modifier;
    }
    return 0;
  });

  const displayIntentList = sortedIntentList.slice(0, 10);

  const allAbnormalCases = formData.metrics.abnormalCases || [];

  // 异类情况清单 (按分类筛选并按照时间倒序)
  const filterAndSortAbnormalCases = (cases) => {
    if (!cases) return [];
    let filtered = cases;
    if (abnormalFilter !== '全部') {
      filtered = filtered.filter(c => c.type === abnormalFilter);
    }
    return filtered.sort((a, b) => parseDateWeight(b.date) - parseDateWeight(a.date));
  };
  const displayAbnormalCases = filterAndSortAbnormalCases(allAbnormalCases);

  const cumulativeFunnel = formData.funnelData['累计'];
  const baseFunnel = formData.funnelData['当月'];

  // 三维筛选乘数（独立相乘，非全部时才缩放）
  const funnelMulti =
    (funnelLeadType !== '全部' ? FUNNEL_LEAD_TYPE_SCALE[funnelLeadType] ?? 1 : 1) *
    (funnelCustType !== '全部' ? FUNNEL_CUST_TYPE_SCALE[funnelCustType] ?? 1 : 1) *
    (funnelIndustry !== '全部' ? FUNNEL_INDUSTRY_SCALE[funnelIndustry] ?? 1 : 1);

  /**
   * 将原始漏斗数据乘以筛选乘数，生成四阶段漏斗 stage 数组。
   * 阶段：线索获取 → 有效接触 → 转化客户 → 签约成交
   * @param {{ leads:number, customers:number, closed:number, amount:string }} data
   * @param {number} multi - 筛选乘数（1 = 不缩放）
   */
  const buildFunnelStages = (data, multi) => {
    const leads     = Math.max(1, Math.round(data.leads     * multi));
    const contacted = Math.max(1, Math.round(data.leads     * multi * 0.72));
    const customers = Math.max(1, Math.round(data.customers * multi));
    const closed    = Math.max(0, Math.round(data.closed    * multi));
    const amount    = (parseFloat(data.amount) * multi).toFixed(1) + '万';
    return [
      { name: '线索获取', count: leads },
      { name: '有效接触', count: contacted },
      { name: '转化客户', count: customers },
      { name: '签约成交', count: closed, extra: amount },
    ];
  };

  const cumulativeFunnelStages = buildFunnelStages(cumulativeFunnel, funnelMulti);
  const monthlyFunnelStages    = buildFunnelStages(baseFunnel, funnelMulti);

  return (
    <div className="bg-white min-h-[85vh] md:rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-8 duration-300 relative">
      
      {/* Header */}
      <div className="sticky top-[73px] z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-6 flex items-center gap-5 md:rounded-t-2xl">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <img src={formData.avatar} className="w-14 h-14 border border-slate-100 object-cover" />
          <div className="flex flex-col justify-center">
            <div className="flex items-end gap-3 mb-1.5">
              <h2 className="text-xl font-bold text-slate-900 leading-none">{formData.name}</h2>
              <span className="text-xs text-slate-500 font-medium">{formData.gender} · {formData.age}岁</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xsborder border-cyan-100"><Briefcase className="w-3 h-3 mr-1 text-cyan-500"/>{formData.position}</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"><Clock className="w-3 h-3 mr-1 text-slate-400"/>{formData.tenure}</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"><MapPin className="w-3 h-3 mr-1 text-slate-400"/>{formData.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8">
        {/* Tabs Navigation */}
        <div className="flex space-x-6 md:space-x-8 border-b border-slate-100 mt-4 overflow-x-auto">
          <button onClick={() => setActiveTab('metrics')} className={`flex items-center pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'metrics' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <BarChart2 className="w-4 h-4 mr-2" /> 业绩达成监控
          </button>
          <button onClick={() => setActiveTab('analysis')} className={`flex items-center pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'analysis' ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <Activity className="w-4 h-4 mr-2" /> 跟进情况分析
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex items-center pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === 'ai' ? 'border-purple-500 text-purple-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <Bot className="w-4 h-4 mr-2" /> AI推客逻辑配置
          </button>
        </div>

        {/* Tabs Content */}
        <div className="py-8 pb-16">
          
          {/* TAB 1: Metrics */}
          {activeTab === 'metrics' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                 <h4 className="text-base font-bold text-slate-800 flex items-center">
                   <div className="w-1.5 h-1.5 bg-emerald-500 mr-2.5" /> 当月目标与达成
                 </h4>
                 <button 
                   onClick={() => setShowTargetModal(true)} 
                   className="flex items-center px-4 py-1.5 bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 shadow-sm transition-all"
                 >
                   <Flag className="w-4 h-4 mr-1.5" /> 调整本月目标
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <AdvancedMetricCard 
                    title="当月达成金额" 
                    actual={parseFloat(formData.metrics.monthlyClosedAmount).toFixed(0)} 
                    target={parseFloat(formData.targets.targetAmount)} 
                    unit="万" type="progress" highlight 
                 />
                 <AdvancedMetricCard 
                    title="当月达成客户数" 
                    actual={formData.metrics.monthlyNewCustomers} 
                    target={formData.targets.targetNewCustomers} 
                    unit="家" type="gap" 
                 />
                 <AdvancedMetricCard 
                    title="当月转换率" 
                    subtitle="当月成交数 ÷ 总客户数"
                    actual={parseFloat(formData.metrics.monthlyConversionRate)} 
                    target={parseFloat(formData.targets.targetConversionRate)} 
                    unit="%" type="diff" 
                 />
              </div>

              {formData.metrics.warnings && formData.metrics.warnings.length > 0 && (
                <div className="mb-8 flex items-start bg-red-50 border border-red-200 p-4 text-red-700 text-sm shadow-sm">
                  <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-red-500"/> 
                  <div><strong className="block mb-1 text-red-800">指标异常预警</strong>{formData.metrics.warnings[0]}</div>
                </div>
              )}

              {/* 漏斗图：线索月客户流向分析 */}
              <div className="bg-white border border-slate-200 p-6 shadow-sm mt-10 border-t border-slate-100 pt-8">
                <h3 className="text-base font-bold text-slate-800 flex items-center shrink-0 mb-4">
                  <Filter className="w-5 h-5 mr-2 text-blue-500" />
                  线索月客户流向分析
                  <span className="text-xs font-normal text-slate-500 ml-2">漏斗转化 · 多维筛选</span>
                </h3>

                {/* 三行筛选器：线索类型 / 客户类型 / 行业 */}
                <div className="bg-slate-50 border border-slate-200 p-4 mb-6 space-y-3">
                  {/* 线索类型 */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-slate-600 shrink-0 w-14">线索类型</span>
                    <div className="flex gap-2 flex-wrap">
                      {['全部', '销售线索', '公司线索', 'AI推客', '再分配线索'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFunnelLeadType(opt)}
                          className={`text-xs px-3 py-1 border font-medium transition-colors ${
                            funnelLeadType === opt
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 客户类型 */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-slate-600 shrink-0 w-14">客户类型</span>
                    <div className="flex gap-2 flex-wrap">
                      {['全部', '新客户', '复购客户'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFunnelCustType(opt)}
                          className={`text-xs px-3 py-1 border font-medium transition-colors ${
                            funnelCustType === opt
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 行业 */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-slate-600 shrink-0 w-14">所属行业</span>
                    <div className="flex gap-2 flex-wrap">
                      {['全部', '互联网', '高新制造', '金融', '零售'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFunnelIndustry(opt)}
                          className={`text-xs px-3 py-1 border font-medium transition-colors ${
                            funnelIndustry === opt
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {(funnelLeadType !== '全部' || funnelCustType !== '全部' || funnelIndustry !== '全部') && (
                      <button
                        onClick={() => { setFunnelLeadType('全部'); setFunnelCustType('全部'); setFunnelIndustry('全部'); }}
                        className="ml-auto text-xs text-slate-400 hover:text-slate-700 underline"
                      >
                        重置筛选
                      </button>
                    )}
                  </div>
                </div>

                {/* 双列漏斗面板 */}
                <div className="grid grid-cols-2 gap-5">
                  <FunnelPanel
                    title="累计转化分析"
                    subtitle="历史全量数据"
                    colorScheme="blue"
                    stages={cumulativeFunnelStages}
                  />
                  <FunnelPanel
                    title="当月转化分析"
                    subtitle="本月实时数据"
                    colorScheme="emerald"
                    stages={monthlyFunnelStages}
                  />
                </div>
              </div>

              {/* 重点意向池 */}
              <div className="mt-10 border-t border-slate-100 pt-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-slate-800 flex items-center">
                    <div className="w-2 h-2 bg-amber-500 mr-2.5 shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> 
                    重点意向池 <span className="text-xs font-normal text-slate-500 ml-2">(需主管优先协助成单，关乎本月KPI)</span>
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
                  {formData.metrics.intentList.map((item, idx) => (
                    <div key={idx} className="flex flex-col p-4 bg-amber-50/40 border border-amber-200/60 hover:border-amber-400 transition-colors shadow-sm">
                      <span className="font-bold text-slate-800 text-sm mb-3 truncate" title={item.name}>{item.name}</span>
                      <div className="flex flex-col gap-1.5 mt-auto">
                        <div className="flex items-center">
                          <span className="text-[10px] text-slate-500 mr-2 font-medium w-12 shrink-0">意向等级</span>
                          <span 
                            title={
                              item.level === 'A级' ? 'A级: 75%–100% | 高意向，接近签约' :
                              item.level === 'B级' ? 'B级: 50%–75% | 中高意向' :
                              item.level === 'C级' ? 'C级: 25%–50% | 中低意向' :
                              'D级: 0%–25% | 低意向'
                            }
                            className={`text-[10px] px-2 py-0.5font-bold border cursor-help ${
                            item.level === 'A级' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            item.level === 'B级' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            item.level === 'C级' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>{item.level}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-[10px] text-slate-500 mr-2 font-medium w-12 shrink-0">预估金额</span>
                          <span className={(!item.budget || item.budget === '评估中' || item.budget === '未知') ? 'text-[10px] text-slate-400 font-medium' : 'text-[10px] text-blue-600 font-bold'}>
                            {(!item.budget || item.budget === '评估中' || item.budget === '未知') ? '评估中' : item.budget}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 当月合同明细 */}
              <div className="mt-10 border-t border-slate-100 pt-8">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-base font-bold text-slate-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-emerald-500" />
                    当月合同明细 <span className="text-xs font-normal text-slate-500 ml-2">(匹配指标：当月达成金额)</span>
                  </h4>
                </div>
                <div className="bg-white border border-slate-200 overflow-x-auto shadow-sm">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5 font-medium">客户名称</th>
                        <th className="px-5 py-3.5 font-medium">签约产品/类型</th>
                        <th className="px-5 py-3.5 font-medium">合同金额</th>
                        <th className="px-5 py-3.5 font-medium">签约日期</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.metrics.contractList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-700">{item.name}</td>
                          <td className="px-5 py-3.5 text-slate-600 font-medium">{item.product}</td>
                          <td className="px-5 py-3.5 text-emerald-600 font-black">{item.amount}</td>
                          <td className="px-5 py-3.5 text-slate-500 text-xs font-medium"><Calendar className="w-3 h-3 inline mr-1 text-slate-400"/>{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Analysis */}
          {activeTab === 'analysis' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* 第一层：全局预警与诊断 */}
              <div className="w-full">
                 <BurndownChart data={formData.burndown} capacity={formData.taskLoad.dailyCapacity} intentList={formData.metrics.intentList} />
              </div>

              {/* 第二层：推进主战场 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* 左侧：意向池明细 */}
                <div className="flex flex-col h-full bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/30">
                    <h4 className="text-base font-bold text-slate-800 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-500" />
                      当月意向客户跟进池
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">Top 10</span>
                  </div>
                  
                  <div className="overflow-x-auto flex-grow max-h-[420px] overflow-y-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-4 py-3 font-medium">客户名称</th>
                          <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => handleSort('level')}>
                            <div className="flex items-center">等级 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" /></div>
                          </th>
                          <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => handleSort('budget')}>
                            <div className="flex items-center">预估金额 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" /></div>
                          </th>
                          <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => handleSort('estimatedClose')}>
                            <div className="flex items-center">预估成单 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" /></div>
                          </th>
                          <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={() => handleSort('daysFollowedUp')}>
                            <div className="flex items-center">未跟进 <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" /></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayIntentList.length > 0 ? displayIntentList.map((item, idx) => {
                          const slaStatus = getSlaStatus(item.level, item.daysFollowedUp);
                          const isOverdue = slaStatus === 'overdue';
                          const isWarning = slaStatus === 'warning';
                          
                          return (
                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-700 truncate max-w-[140px]" title={item.name}>{item.name}</td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] px-2 py-0.5font-bold border ${
                                  item.level === 'A级' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                  item.level === 'B级' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                  item.level === 'C级' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                  'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>{item.level}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-600 font-medium">
                                <span className={(!item.budget || item.budget === '评估中' || item.budget === '未知') ? 'text-[10px] text-slate-400' : 'text-[10px] text-blue-600 font-bold'}>
                                  {(!item.budget || item.budget === '评估中' || item.budget === '未知') ? '评估中' : item.budget}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-600 font-medium">
                                <span className={(!item.estimatedClose || item.estimatedClose === '评估中') ? 'text-[10px] text-slate-400' : 'text-[10px] text-indigo-600'}>
                                  {item.estimatedClose || '评估中'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium">
                                <span className={`px-2.5 py-1text-[10px] font-bold inline-flex items-center ${
                                  isOverdue ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                  isWarning ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                  'text-slate-600 bg-slate-50 border border-slate-200'
                                }`}>
                                  {isOverdue && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {isWarning && <Clock3 className="w-3 h-3 mr-1" />}
                                  {item.daysFollowedUp} 天
                                </span>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr><td colSpan="5"><EmptyState icon={Users} message="暂无推进中的意向客户" /></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 右侧：核心跟进记录 */}
                <div className="flex flex-col h-full bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/30">
                    <h4 className="text-base font-bold text-slate-800 flex items-center">
                      <CalendarDays className="w-5 h-5 mr-2 text-indigo-500"/>
                      近期核心过程记录
                    </h4>
                  </div>
                  
                  <div className="p-5 md:p-6 flex-grow overflow-y-auto max-h-[420px]">
                    {formData.records && formData.records.length > 0 ? (
                      <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 space-y-6 pb-2">
                        {formData.records.map((record, index) => (
                          <div key={index} className="relative pl-6 md:pl-8">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-indigo-400 shadow-sm"></div>
                            <div className="bg-slate-50/70 border border-slate-100 p-4 hover:shadow-md transition-all duration-300">
                              <div className="flex flex-col gap-2 mb-2">
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-slate-800 text-sm">{record.client}</span>
                                  <span className={`text-[10px] px-2 py-0.5font-bold border ${
                                    record.status === 'A级客户' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    record.status === 'B级客户' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                    record.status === 'C级客户' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                    'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>{record.status}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1 font-medium">
                                  <span className="flex items-center text-indigo-600"><Clock className="w-3 h-3 mr-1" /> {record.date}</span>
                                  <span className="flex items-center"><Target className="w-3 h-3 mr-1" /> {record.purpose}</span>
                                </div>
                              </div>
                              <div className="text-xs text-slate-600 leading-relaxed bg-white p-3border border-slate-100 shadow-sm mt-2">
                                {record.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState icon={MessageSquare} message="最近暂无业务跟进记录" />
                    )}
                  </div>
                </div>
              </div>

              {/* 第三层：异常清单 (流失/退回/无效等统一核查项) */}
              <div className="bg-white border border-slate-200 p-5 md:p-6 shadow-sm mt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                  <h4 className="text-base font-bold text-slate-800 flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 text-rose-500" />
                    异常情况清单明细
                    <span className="text-xs font-normal text-slate-500 ml-2 hidden sm:inline-block">(包含退回线索池、流失、暂停及无效线索等)</span>
                  </h4>
                  <div className="flex bg-slate-100/80 p-1 overflow-x-auto">
                    {['全部', '退回线索池', '流失客户', '暂停合作', '无效线索'].map(type => (
                      <button key={type} onClick={() => setAbnormalFilter(type)} className={`px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${abnormalFilter === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-5 py-3 font-medium">客户/线索名称</th>
                        <th className="px-5 py-3 font-medium">分类状态</th>
                        <th className="px-5 py-3 font-medium max-w-[400px]">原因/备注解读</th>
                        <th className="px-5 py-3 font-medium">发生时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayAbnormalCases.length > 0 ? (
                        displayAbnormalCases.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-bold text-slate-700">{item.name}</td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-1text-[10px] font-bold border ${
                                item.type === '无效线索' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                item.type === '退回线索池' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                item.type === '流失客户' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                item.type === '暂停合作' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>{item.type}</span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 font-medium truncate max-w-[400px]" title={item.reason}>{item.reason}</td>
                            <td className="px-5 py-3.5 text-slate-500 text-xs font-medium"><Clock className="w-3 h-3 inline mr-1 text-slate-400"/>{item.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4"><EmptyState icon={CheckCircle2} message="当前分类下暂无异常流失或退回记录" /></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AI 推客逻辑配置 */}
          {activeTab === 'ai' && (
            <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-purple-50/50 border border-purple-100/50 p-4 flex gap-3 text-purple-700 text-sm">
                <Bot className="w-5 h-5 shrink-0" /> 
                <p>派单引擎将综合读取该销售的<strong>寻客区域</strong>、<strong>所属行业</strong>及<strong>能力标签</strong>智能匹配线索，实现高优意向线索的精准分发。</p>
              </div>

              <div className="pb-10">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold flex items-center"><Target className="w-4 h-4 mr-2 text-slate-400"/>线索定向分发规则</h3>
                    {!editStates.aiConfig && (
                      <button onClick={() => toggleEdit('aiConfig')} className="flex items-center text-cyan-600 text-xs font-bold bg-cyan-50 px-3 py-1.5 hover:bg-cyan-100 transition-colors" title="编辑配置">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> 编辑配置
                      </button>
                    )}
                 </div>

                 <div className={`p-6 -mx-6 md:mx-0 md:rounded-xl flex flex-col transition-colors ${editStates.aiConfig ? 'bg-cyan-50/20 ring-1 ring-cyan-100' : ''}`}>
                    <div className="space-y-8">
                      {/* 基础人员画像补全 */}
                      <div>
                        <label className="text-sm font-bold text-slate-700 flex items-center mb-3">
                          <User className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>基础人员信息 <span className="text-xs font-normal text-slate-400 ml-2">(用于弥补人力系统数据缺失，构建推客基础模型)</span>
                        </label>
                        {editStates.aiConfig ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="text-xs text-slate-500 mb-1 block font-medium">性别</span>
                              <select className="w-full px-3 py-2 bg-white border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none text-sm shadow-sm" value={formData.gender} onChange={(e)=>updateField(null, 'gender', e.target.value)}>
                                <option value="男">男</option>
                                <option value="女">女</option>
                              </select>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 mb-1 block font-medium">出生日期</span>
                              <input type="date" className="w-full px-3 py-2 bg-white border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none text-sm shadow-sm text-slate-700" value={formData.birthDate || ''} onChange={(e)=>updateField(null, 'birthDate', e.target.value)} />
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 mb-1 block font-medium">职位</span>
                              <input type="text" className="w-full px-3 py-2 bg-white border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none text-sm shadow-sm text-slate-700" value={formData.position} onChange={(e)=>updateField(null, 'position', e.target.value)} />
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 mb-1 block font-medium">入职日期</span>
                              <input type="date" className="w-full px-3 py-2 bg-white border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none text-sm shadow-sm text-slate-700" value={formData.hireDate || ''} onChange={(e)=>updateField(null, 'hireDate', e.target.value)} />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-3 border border-slate-100 flex flex-col">
                              <span className="text-[10px] text-slate-400 mb-1 font-medium">性别</span>
                              <span className="text-sm font-bold text-slate-800">{formData.gender || '-'}</span>
                            </div>
                            <div className="bg-slate-50 p-3 border border-slate-100 flex flex-col">
                              <span className="text-[10px] text-slate-400 mb-1 font-medium">出生日期</span>
                              <span className="text-sm font-bold text-slate-800">{formData.birthDate || '-'}</span>
                            </div>
                            <div className="bg-slate-50 p-3 border border-slate-100 flex flex-col">
                              <span className="text-[10px] text-slate-400 mb-1 font-medium">职位</span>
                              <span className="text-sm font-bold text-slate-800">{formData.position || '-'}</span>
                            </div>
                            <div className="bg-slate-50 p-3 border border-slate-100 flex flex-col">
                              <span className="text-[10px] text-slate-400 mb-1 font-medium">入职日期</span>
                              <span className="text-sm font-bold text-slate-800">{formData.hireDate || '-'}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100 border-dashed pt-6">
                        <label className="text-sm font-bold text-slate-700 flex items-center mb-3"><MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>寻客区域 (LBS优先)</label>
                        {editStates.aiConfig ? (
                          <input className="w-full max-w-md px-3 py-2 bg-white border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none text-sm shadow-sm" value={formData.location} onChange={(e)=>updateField(null, 'location', e.target.value)} placeholder="如：上海市某街道" />
                        ) : (
                          <div className="text-sm text-slate-800 bg-slate-50 p-2.5 border border-slate-100 inline-block min-w-[200px]">{formData.location}</div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 flex items-center mb-3"><Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>专属深挖行业</label>
                        <div className="flex flex-wrap gap-2">
                           {formData.industries.map(i => (
                             <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 flex items-center">
                               {i} {editStates.aiConfig && <X className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-red-500 transition-colors" onClick={()=>removeInd(i)} />}
                             </span>
                           ))}
                           {editStates.aiConfig && (
                             <div className="flex items-center bg-white border border-cyan-200 px-2 overflow-hidden shadow-sm">
                               <Plus className="w-4 h-4 text-slate-400" />
                               <input type="text" placeholder="添加行业后回车" value={newInd} onChange={(e)=>setNewInd(e.target.value)} onKeyDown={addInd} className="bg-transparent border-none text-sm w-32 py-1.5 px-2 outline-none" />
                             </div>
                           )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold text-slate-700 flex items-center mb-3">
                          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-500"/>核心能力引擎标签
                        </label>
                        
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map(s => (
                            <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 flex items-center">
                              {s} {editStates.aiConfig && <X className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-red-500 transition-colors" onClick={()=>removeTag(s)} />}
                            </span>
                          ))}
                          {editStates.aiConfig && (
                            <div className="flex items-center bg-white border border-cyan-200 px-2 overflow-hidden shadow-sm">
                              <Plus className="w-4 h-4 text-slate-400" />
                              <input type="text" placeholder="手动添加标签后回车" value={newTag} onChange={(e)=>setNewTag(e.target.value)} onKeyDown={addTag} className="bg-transparent border-none text-sm w-36 py-1.5 px-2 outline-none" />
                            </div>
                          )}
                        </div>

                        {editStates.aiConfig && formData.aiSuggestedTags && (
                          <div className="mt-4 pt-4 border-t border-cyan-100 border-dashed">
                            <span className="text-xs text-cyan-700 font-bold mb-2 flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1"/>AI 结合历史跟进诊断补充推荐：</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.aiSuggestedTags.filter(tag => !formData.skills.includes(tag)).map((tag, idx) => (
                                <button 
                                  key={idx} 
                                  onClick={() => updateField(null, 'skills', [...formData.skills, tag])}
                                  className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs font-medium border border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 transition-colors flex items-center shadow-sm"
                                >
                                  <Plus className="w-3 h-3 mr-1" /> {tag}
                                </button>
                              ))}
                              {formData.aiSuggestedTags.filter(tag => !formData.skills.includes(tag)).length === 0 && (
                                <span className="text-xs text-slate-400">所有AI建议标签均已添加</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {editStates.aiConfig && <ActionFooter onCancel={() => cancelSection('aiConfig')} onSave={() => saveSection('aiConfig')} />}
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {showTargetModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center"><Flag className="w-4 h-4 mr-2 text-rose-500"/>调整本月目标设定</h3>
              <button onClick={() => setShowTargetModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-5 bg-slate-50/30">
              <div className="bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800 flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                <p>调整业绩目标将重新计算该销售的漏斗达成进度，请结合历史定盘数据合理干预。</p>
              </div>

              <div className="flex flex-col gap-2.5 p-4 bg-white border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">本月目标金额</label>
                  {getDiffText(formData.targets.targetAmount, modalTargetData.targetAmount)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 px-3 py-2 border border-slate-100 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 mb-0.5 font-medium">当前原目标</div>
                    <div className="text-sm font-bold text-slate-500 line-through decoration-slate-300">{formData.targets.targetAmount}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                  <div className="flex-1 relative">
                     <div className="text-[10px] text-cyan-600 mb-1 font-bold ml-1">新目标预设</div>
                     <div className="relative">
                       <input 
                         type="text" 
                         value={modalTargetData.targetAmount ? modalTargetData.targetAmount.toString().replace('万', '') : ''} 
                         onChange={(e) => setModalTargetData({...modalTargetData, targetAmount: e.target.value ? e.target.value + '万' : ''})}
                         className="w-full pl-3 pr-7 py-2 bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-slate-900 text-sm shadow-sm font-bold" 
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">万</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 p-4 bg-white border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">计划新增客户数</label>
                  {getDiffText(formData.targets.targetNewCustomers, modalTargetData.targetNewCustomers)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 px-3 py-2 border border-slate-100 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 mb-0.5 font-medium">当前原目标</div>
                    <div className="text-sm font-bold text-slate-500 line-through decoration-slate-300">{formData.targets.targetNewCustomers} <span className="text-xs font-normal">家</span></div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                  <div className="flex-1 relative">
                     <div className="text-[10px] text-cyan-600 mb-1 font-bold ml-1">新目标预设</div>
                     <div className="relative">
                       <input 
                         type="number" 
                         value={modalTargetData.targetNewCustomers} 
                         onChange={(e) => setModalTargetData({...modalTargetData, targetNewCustomers: e.target.value})}
                         className="w-full pl-3 pr-7 py-2 bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-slate-900 text-sm shadow-sm font-bold" 
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">家</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 p-4 bg-white border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">目标成单转化率</label>
                  {getDiffText(formData.targets.targetConversionRate, modalTargetData.targetConversionRate)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 px-3 py-2 border border-slate-100 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 mb-0.5 font-medium">当前原目标</div>
                    <div className="text-sm font-bold text-slate-500 line-through decoration-slate-300">{formData.targets.targetConversionRate}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                  <div className="flex-1 relative">
                     <div className="text-[10px] text-cyan-600 mb-1 font-bold ml-1">新目标预设</div>
                     <div className="relative">
                       <input 
                         type="text" 
                         value={modalTargetData.targetConversionRate ? modalTargetData.targetConversionRate.toString().replace('%', '') : ''} 
                         onChange={(e) => setModalTargetData({...modalTargetData, targetConversionRate: e.target.value ? e.target.value + '%' : ''})}
                         className="w-full pl-3 pr-7 py-2 bg-white border border-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-slate-900 text-sm shadow-sm font-bold" 
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowTargetModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">取消调整</button>
              <button onClick={saveTargetModal} className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors flex items-center">
                <Check className="w-4 h-4 mr-1.5" /> 确认覆盖新目标
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 燃尽图组件与AI预测分析
function BurndownChart({ data, capacity, intentList }) {
  const width = 400;
  const height = 200;
  const paddingX = 30;
  const paddingTop = 20;
  const paddingBottom = 30;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;
  
  const maxVal = Math.max(...data.overdueLeads, ...data.levelA, ...data.levelB, ...data.levelC, ...data.levelD, 10);

  const getPoints = (arr) => arr.map((val, i) => {
    const x = paddingX + (i / (arr.length - 1)) * innerWidth;
    const y = paddingTop + (1 - val / maxVal) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  // AI 预测性计算
  const totalLeads = data.overdueLeads.reduce((sum, val) => sum + val, 0);
  const totalCustomers = [...data.levelA, ...data.levelB, ...data.levelC, ...data.levelD].reduce((sum, val) => sum + val, 0);
  const dailyLeadCap = capacity?.leads || 50;
  const dailyCustCap = capacity?.customers || 15;
  
  const daysToClearLeads = (totalLeads / dailyLeadCap).toFixed(1);
  const daysToClearCust = (totalCustomers / dailyCustCap).toFixed(1);

  const leadWarning = parseFloat(daysToClearLeads) > 3;
  const capacityCustWarning = parseFloat(daysToClearCust) > 3;

  // SLA 逾期计算
  const overdueCustomers = (intentList || []).filter(c => getSlaStatus(c.level, c.daysFollowedUp) === 'overdue');
  const aLevelOverdue = overdueCustomers.filter(c => c.level === 'A级').length;
  const hasSlaWarning = overdueCustomers.length > 0;

  return (
    <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col w-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2 text-blue-500"/>超期未跟进监控与预测分析
        </h3>
        <p className="text-xs text-slate-500">监控待跟进线索与各级客户的超期滞留趋势，并由AI提供干预建议</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] font-medium px-2">
            <div className="flex items-center"><span className="w-2.5 h-2.5bg-purple-500 mr-1.5"></span>超期线索</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5bg-emerald-500 mr-1.5"></span>A级客户</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5bg-blue-500 mr-1.5"></span>B级客户</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5bg-amber-500 mr-1.5"></span>C级客户</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5bg-slate-400 mr-1.5"></span>D级客户</div>
          </div>
          <div className="relative w-full h-[200px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Y Axis Max Label */}
              <text x={paddingX - 10} y={paddingTop + 4} fontSize="10" fill="#94a3b8" textAnchor="end">{maxVal}</text>
              <text x={paddingX - 10} y={paddingTop + innerHeight + 4} fontSize="10" fill="#94a3b8" textAnchor="end">0</text>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                const y = paddingTop + ratio * innerHeight;
                return <line key={`grid-${ratio}`} x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray={ratio === 1 ? "" : "4 4"} />;
              })}
              
              {/* Lines */}
              <polyline points={getPoints(data.overdueLeads)} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
              <polyline points={getPoints(data.levelA)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
              <polyline points={getPoints(data.levelB)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
              <polyline points={getPoints(data.levelC)} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
              <polyline points={getPoints(data.levelD)} fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
              
              {/* Points */}
              {data.overdueLeads.map((val, i) => {
                const x = paddingX + (i / (data.overdueLeads.length - 1)) * innerWidth;
                const y = paddingTop + (1 - val / maxVal) * innerHeight;
                return <circle key={`lead-${i}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />;
              })}
              {data.levelA.map((val, i) => {
                const x = paddingX + (i / (data.levelA.length - 1)) * innerWidth;
                const y = paddingTop + (1 - val / maxVal) * innerHeight;
                return <circle key={`custA-${i}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#10b981" strokeWidth="2" />;
              })}
              {data.levelB.map((val, i) => {
                const x = paddingX + (i / (data.levelB.length - 1)) * innerWidth;
                const y = paddingTop + (1 - val / maxVal) * innerHeight;
                return <circle key={`custB-${i}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />;
              })}
              {data.levelC.map((val, i) => {
                const x = paddingX + (i / (data.levelC.length - 1)) * innerWidth;
                const y = paddingTop + (1 - val / maxVal) * innerHeight;
                return <circle key={`custC-${i}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />;
              })}
              {data.levelD.map((val, i) => {
                const x = paddingX + (i / (data.levelD.length - 1)) * innerWidth;
                const y = paddingTop + (1 - val / maxVal) * innerHeight;
                return <circle key={`custD-${i}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />;
              })}

              {/* X Axis Labels */}
              {data.labels.map((lbl, i) => {
                const x = paddingX + (i / (data.labels.length - 1)) * innerWidth;
                return <text key={lbl} x={x} y={height - 5} fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="500">{lbl}</text>;
              })}
            </svg>
          </div>
        </div>

        {/* AI预测性分析区块 (右侧栏) */}
        <div className="lg:col-span-1 flex flex-col border-t border-slate-100 pt-5 lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0">
           <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center">
             <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500"/> AI 预测性跟进分析
           </h4>
           <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
             {/* 线索预警 */}
             {leadWarning ? (
                <div className="flex items-start text-xs bg-amber-50 text-amber-700 p-2.5 border border-amber-100 shadow-sm transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed">超期线索总量达 <strong className="text-amber-800">{totalLeads}</strong> 条，按其日均处理产能需 <strong className="text-amber-800">{daysToClearLeads}</strong> 天消化，建议暂缓派发。</p>
                </div>
             ) : (
                <div className="flex items-start text-xs bg-slate-50 text-slate-600 p-2.5 border border-slate-200 shadow-sm transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-emerald-500" />
                  <p className="leading-relaxed">超期线索总量 <strong>{totalLeads}</strong> 条，处理水位处于正常区间，无滞留风险。</p>
                </div>
             )}

             {/* 客户SLA与产能预警 */}
             {hasSlaWarning ? (
                <div className="flex items-start text-xs bg-rose-50 text-rose-700 p-2.5 border border-rose-100 shadow-sm transition-colors">
                  <AlertCircle className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-rose-500" />
                  <p className="leading-relaxed">
                    检测到 <strong className="text-rose-800">{overdueCustomers.length}</strong> 家客户突破跟进SLA（含A级逾期 <strong className="text-rose-800">{aLevelOverdue}</strong> 家），高优客户面临流失风险！
                  </p>
                </div>
             ) : capacityCustWarning ? (
                <div className="flex items-start text-xs bg-amber-50 text-amber-700 p-2.5 border border-amber-100 shadow-sm transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-amber-500" />
                  <p className="leading-relaxed">
                    待跟进客户量达 <strong>{totalCustomers}</strong> 家，按其产能测算近期日程已饱和，请关注SLA逾期风险。
                  </p>
                </div>
             ) : (
                <div className="flex items-start text-xs bg-slate-50 text-slate-600 p-2.5 border border-slate-200 shadow-sm transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-emerald-500" />
                  <p className="leading-relaxed">客户跟进队列目前全部符合SLA标准，跟进及时率有保障。</p>
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

function ActionFooter({ onCancel, onSave, theme = 'cyan' }) {
  return (
    <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-slate-200/60 w-full">
       <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors font-medium">取消</button>
       <button onClick={onSave} className={`px-4 py-2 text-sm text-white shadow-sm transition-colors flex items-center font-medium ${theme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}>
         <Check className="w-4 h-4 mr-1.5" /> 保存配置
       </button>
    </div>
  );
}

function AdvancedMetricCard({ title, actual, target, unit, type, highlight, subtitle }) {
  const actualNum = parseFloat(actual) || 0;
  const targetNum = parseFloat(target) || 0;
  const progressPercent = targetNum > 0 ? (actualNum / targetNum) * 100 : 0;
  const diff = actualNum - targetNum;

  return (
    <div className={`p-6 border relative overflow-hidden flex flex-col ${highlight ? 'bg-gradient-to-br from-cyan-50 to-blue-50/30 border-cyan-200 shadow-sm' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="text-sm font-medium text-slate-500 mb-1">{title}</div>
      {subtitle && <div className="text-[10px] text-slate-400 mb-3">{subtitle}</div>}
      <div className="flex items-end gap-2 mb-4">
        <div className={`text-4xl font-black tracking-tight ${highlight ? 'text-cyan-900' : 'text-slate-800'}`}>{actual}<span className="text-xl ml-0.5">{unit}</span></div>
        <div className="text-sm text-slate-400 mb-1.5">/ {target}{unit}</div>
      </div>

      <div className="mt-auto">
        {type === 'progress' && (
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold">
              <span className={progressPercent >= 100 ? 'text-emerald-600' : 'text-slate-500'}>达成 {progressPercent.toFixed(1)}%</span>
              {diff >= 0 ? <span className="text-emerald-600">+超额 {diff}{unit}</span> : <span className="text-rose-500">还差 {Math.abs(diff)}{unit}</span>}
            </div>
            <div className="w-full bg-slate-200/80 h-2.5 overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${progressPercent >= 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(progressPercent, 100)}%` }}></div>
            </div>
          </div>
        )}
        
        {type === 'gap' && (
          <div className="inline-flex items-center px-2.5 py-1bg-slate-100 text-xs font-medium">
             {diff >= 0 ? (
               <><TrendingUp className="w-3 h-3 mr-1 text-emerald-600"/><span className="text-slate-700">超额拓客 <span className="text-emerald-600 font-bold">{diff}</span> 家</span></>
             ) : (
               <><AlertCircle className="w-3 h-3 mr-1 text-amber-500"/><span className="text-slate-700">距目标还差 <span className="text-amber-600 font-bold">{Math.abs(diff)}</span> 家</span></>
             )}
          </div>
        )}

        {type === 'diff' && (
          <div className="inline-flex items-center px-2.5 py-1bg-slate-100 text-xs font-medium">
             {diff >= 0 ? (
               <><TrendingUp className="w-3 h-3 mr-1 text-emerald-600"/><span className="text-slate-700">高于目标 <span className="text-emerald-600 font-bold">+{diff.toFixed(1)}%</span></span></>
             ) : (
               <><TrendingUp className="w-3 h-3 mr-1 text-rose-500 rotate-180"/><span className="text-slate-700">落后目标 <span className="text-rose-600 font-bold">{Math.abs(diff).toFixed(1)}%</span></span></>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

function StarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}
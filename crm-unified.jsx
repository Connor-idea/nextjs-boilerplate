import React, { useState, useEffect } from 'react';
import {
  Users, Search, Plus, UploadCloud, Bell, ChevronLeft, FileText, Edit, Trash2,
  Phone, Mail, Clock, Sparkles, AlertCircle, ChevronDown, ChevronUp, MessageCircle,
  UserPlus, Info, Share2, ChevronRight, X, Check, Menu, Home,
  UserCheck, Briefcase, User, CheckCircle2, Link as LinkIcon,
  Building2, RefreshCw, PlayCircle, ShieldAlert, History, Copy, MapPin, Undo2,
  Loader2, ScanLine, CalendarClock, Settings2, ListChecks,
  TrendingUp, BatteryMedium, BatteryFull, BatteryLow, ShieldCheck, Wand2, Database,
  AlertTriangle, Filter, Calendar, CircleDashed, CheckCircle, Network, CreditCard,
  PieChart, UserCircle, CornerUpLeft, ListTodo, Target, Flag,
  BarChart2, Activity, Bot, Edit2, CalendarDays, MessageSquare, TrendingDown,
  ArrowUpDown, Clock3,
} from 'lucide-react';

// ============================================================
// SECTION 1: 全局常量与数据
// ============================================================
const MOCK_COMPANY_DB = [
  "北京字节跳动科技有限公司","上海腾讯企点科技有限公司","深圳大疆创新科技有限公司",
  "杭州阿里巴巴集团有限公司","广州小鹏汽车科技有限公司","北京百度网讯科技有限公司",
  "华为技术有限公司","小米科技有限责任公司","网易（杭州）网络有限公司"
];

const MOCK_REP_PERFORMANCE = {
  '张三': { intent: 32, label: '饱和', icon: BatteryFull, color: 'text-red-600 bg-red-50 border-red-200' },
  '李四': { intent: 5,  label: '空闲', icon: BatteryLow,  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '王五': { intent: 18, label: '正常', icon: BatteryMedium,color: 'text-blue-700 bg-blue-50 border-blue-200' },
  '赵六': { intent: 8,  label: '空闲', icon: BatteryLow,  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '刘洋': { intent: 28, label: '偏高', icon: BatteryMedium,color: 'text-orange-700 bg-orange-50 border-orange-200' },
  '孙琦': { intent: 2,  label: '空闲', icon: BatteryLow,  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '周七': { intent: 15, label: '正常', icon: BatteryMedium,color: 'text-blue-700 bg-blue-50 border-blue-200' },
  '吴八': { intent: 22, label: '偏高', icon: BatteryMedium,color: 'text-orange-700 bg-orange-50 border-orange-200' },
};

const statusColors = {
  '新线索': 'bg-blue-50 text-blue-700 border-blue-100',
  '退回待分配': 'bg-orange-50 text-orange-700 border-orange-100',
  '二次分配线索': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  '三次分配线索': 'bg-purple-50 text-purple-700 border-purple-100',
  '失效线索': 'bg-slate-100 text-slate-600 border-slate-200',
  '异常线索': 'bg-rose-50 text-rose-700 border-rose-100',
};

const teamMembers = Object.keys(MOCK_REP_PERFORMANCE);
const SLA_LIMITS = { 'A级': 3, 'B级': 7, 'C级': 14, 'D级': 30 };

const getSlaStatus = (level, days) => {
  const limit = SLA_LIMITS[level] || 30;
  if (days > limit) return 'overdue';
  if (days === limit || days === limit - 1) return 'warning';
  return 'healthy';
};

const parseDateWeight = (dateStr) => {
  if (!dateStr) return 0;
  if (dateStr.includes('今天')) return 10000 + (parseInt(dateStr.match(/\d+/)) || 0);
  if (dateStr.includes('刚刚')) return 10000;
  if (dateStr.includes('昨天')) return 9000;
  if (dateStr.includes('前天')) return 8000;
  if (dateStr.includes('本周')) return 7000;
  if (dateStr.includes('上周')) return 6000;
  const match = dateStr.match(/(\d+)月(\d+)日/);
  if (match) return parseInt(match[1]) * 100 + parseInt(match[2]);
  return 0;
};

// ============================================================
// SECTION 2: 初始化数据
// ============================================================

// --- 线索管理数据 ---
const defaultMockContacts = [{
  id: 1, name: "张一鸣", position: "销售副总裁 (VP of Sales)",
  companyName: "北京字节跳动科技有限公司", address: "北京市海淀区中关村大街1号", website: "www.bytedance.com",
  tags: ["推荐触达","决策者"], tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  phones: ["138-0013-8888","010-8888xxxx"], wechat: "zhang_sales_vp", email: "zym@company.com", social: "抖音: 商业张sir",
  pitch: "张总您好，关注到贵司近期在快速扩充销售团队。我们提供的新一代CRM能直接对接大模型，帮您的团队提升30%的人效，不知您本周四下午是否有空交流10分钟？",
  aiAdvice: "建议通过微信添加，对方在朋友圈较为活跃，喜欢分享行业报告。切入点可以是探讨AI企业服务商业化路径。",
  note: "之前沟通感觉对价格比较敏感，需要多强调我们的投入产出比(ROI)。"
}];

const initialLeads = [
  { id:1,  name:'林晓', company:'北京字节跳动科技有限公司', industry:'人工智能',  phone:'138-0013-8000', email:'linx@company.com',    status:'二次分配线索', source:'抖音',      date:'2024-02-10', owner:'张三',  isSelfAdded:false, score:99,   daysUncontacted:3,  trackStatus:'pending',   contacts:defaultMockContacts, history:[], companyNote:'重点跟进二期项目' },
  { id:11, name:'林晓', company:'北京字节跳动科技有限公司', industry:'人工智能',  phone:'138-0013-8000', email:'linx_2@company.com', status:'新线索',       source:'批量导入',  date:'2024-03-10', owner:'未分配',isSelfAdded:false, score:null, daysUncontacted:0,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
  { id:2,  name:'李娜', company:'上海腾讯企点科技有限公司', industry:'企业服务',  phone:'139-1234-5678', email:'lina@example.com',    status:'新线索',       source:'名片录入',  date:'2024-02-26', owner:'李四',  isSelfAdded:true,  score:95,   daysUncontacted:0,  trackStatus:'completed', contacts:[], history:[], companyNote:'' },
  { id:3,  name:'王强', company:'深圳大疆创新科技有限公司', industry:'智能制造',  phone:'137-9876-5432', email:'wangqiang@example.com',status:'退回待分配',   source:'展会画册',  date:'2023-10-20', owner:'未分配',isSelfAdded:false, score:88,   daysUncontacted:7,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
  { id:4,  name:'赵敏', company:'杭州阿里巴巴集团有限公司', industry:'电子商务',  phone:'136-1111-2222', email:'zhaomin@example.com',  status:'失效线索',     source:'小红书',    date:'2023-10-15', owner:'王五',  isSelfAdded:true,  score:60,   daysUncontacted:15, trackStatus:'draft',     contacts:[], history:[], companyNote:'' },
  { id:5,  name:'钱伟', company:'京东集团',               industry:'电子商务',  phone:'131-2222-3333', email:'qianw@example.com',    status:'新线索',       source:'网络搜索',  date:'2024-03-01', owner:'未分配',isSelfAdded:false, score:null, daysUncontacted:2,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
  { id:6,  name:'周杰', company:'北京百度网讯科技有限公司', industry:'人工智能',  phone:'未知号码',      email:'zhoujie@example.com',  status:'异常线索',     source:'信息流广告',date:'2024-03-05', owner:'未分配',isSelfAdded:false, score:null, daysUncontacted:1,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
  { id:7,  name:'刘涛', company:'华为技术有限公司',         industry:'通信电子',  phone:'139-6666',      email:'liutao@example.com',   status:'退回待分配',   source:'网络搜索',  date:'2024-03-06', owner:'未分配',isSelfAdded:false, score:92,   daysUncontacted:5,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
  { id:8,  name:'吴磊', company:'小米科技有限责任公司',     industry:'智能硬件',  phone:'131-5555-4444', email:'wulei@example.com',    status:'三次分配线索', source:'批量导入',  date:'2024-03-07', owner:'张三',  isSelfAdded:false, score:78,   daysUncontacted:0,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
  { id:9,  name:'陈晨', company:'网易（杭州）网络有限公司', industry:'游戏开发',  phone:'138-1111-2222', email:'chenchen@example.com', status:'新线索',       source:'名片',      date:'2024-03-08', owner:'未分配',isSelfAdded:false, score:82,   daysUncontacted:0,  trackStatus:'pending',   contacts:[], history:[], companyNote:'' },
];

// --- AI推客数据 ---
const pitchLeads = [
  { id:'LD-2024-08997', name:'北京字节跳动科技有限公司',   status:'pending',   score:99, time:'11:00', daysUncontacted:3, source:'上海人工智能大会客户发放名片', companyNotes:[],
    history:[{id:3,date:'2024-02-10 16:00',sales:'您自己',type:'线下拜访',contact:'张一鸣',note:'上门拜访，确定了二期采购需求，需尽快跟进方案。',tag:'需求确认'},{id:4,date:'2024-01-20 14:00',sales:'您自己',type:'线上会议',contact:'张一鸣',note:'进行了首次产品Demo演示，客户对AI模块非常感兴趣，要求提供报价。',tag:'Demo演示'}]},
  { id:'LD-2024-08992', name:'北京智谱华章科技有限公司',   status:'pending',   score:98, time:'10:00', daysUncontacted:5, companyNotes:[{id:201,text:"销售总监反馈该公司下半年有换系统的计划，重点关注安全性和私有化部署能力。",date:"2024-03-20 14:00"}],
    history:[{id:1,date:'2023-11-15 14:30',sales:'王建国 (已离职)',type:'电话拜访',contact:'张一鸣',note:'初步沟通，对方表示年底预算已用完，当前正在评估几家CRM供应商，建议明年Q1再联系。',tag:'持续培育'},{id:2,date:'2023-10-10 10:00',sales:'王建国 (已离职)',type:'微信沟通',contact:'张一鸣',note:'发送了产品介绍PPT和安全白皮书，对方表示会抽空看下。',tag:'发送资料'}]},
  { id:'LD-2024-08995', name:'月之暗面科技有限公司',       status:'pending',   score:92, time:'10:15', daysUncontacted:1, source:'官网市场合作邮箱咨询', companyNotes:[],
    history:[{id:5,date:'2024-03-28 11:30',sales:'李四 (SDR)',type:'退回客户',contact:'--',note:'客户表示近期在忙封闭开发，无暇评估新系统，暂不考虑，故退回公海。',tag:'时机未到'}]},
  { id:'LD-2024-08993', name:'上海商汤智能科技有限公司',   status:'pending',   score:95, time:'09:30', daysUncontacted:7, source:'企查查企业名录定向拉取', companyNotes:[],
    history:[{id:6,date:'2024-03-20 15:45',sales:'赵六 (SDR)',type:'线索无效',contact:'前台',note:'多次拨打企查查上的工商预留电话均为空号，且尝试添加法人微信未通过。',tag:'联系方式失效'}]},
  { id:'LD-2024-08994', name:'深圳市腾讯计算机系统有限公司',status:'completed', score:88, time:'09:00', daysUncontacted:0, source:'历史流失公海捞回', companyNotes:[], history:[] },
];

// --- 销售画像数据 ---
const initialSalesData = [
  {
    id:'1', name:'张梓涵', gender:'女', age:28, birthDate:'1996-05-12', hireDate:'2020-02-15',
    avatar:'https://i.pravatar.cc/150?u=11', location:'北京市怀柔区某街道',
    industries:['互联网','高新制造'], position:'高级大客户经理', tenure:'4年2个月',
    skills:['SaaS解决方案','政企采购','高管谈判'], aiSuggestedTags:['成交周期短','方案撰写专家'],
    targets:{targetAmount:'150万',targetNewCustomers:30,targetConversionRate:'5%'},
    taskLoad:{weeklyFollowUps:45,pendingVisits:2,status:'正常',weight:100,dailyCapacity:{leads:60,customers:15}},
    followUpCount:156, visitedCount:32, intentCustomers:14,
    metrics:{
      cumulativeCustomers:320, cumulativeAmount:'1250万', monthlyNewCustomers:24,
      monthlyClosedCount:8, monthlyClosedAmount:'168', monthlyConversionRate:'2.5', warnings:[],
      intentList:[
        {name:'字节跳动-企业效能部',level:'A级',budget:'100万',estimatedClose:'下周三',daysFollowedUp:4,content:'客户对SaaS定制化方案表示认可，要求下周出具正式的商务报价。',followUp:'4天前'},
        {name:'京东物流-华北区',level:'B级',budget:'50万',estimatedClose:'本月底',daysFollowedUp:2,content:'确认法务合同已走完内部审批流程，提醒并催促对方尽快完成盖章。',followUp:'前天'},
        {name:'小红书',level:'C级',budget:'评估中',estimatedClose:'评估中',daysFollowedUp:10,content:'发送了初步的产品介绍白皮书，客户表示内部正在收集各部门需求，月底再定。',followUp:'上周三'},
        {name:'美团-商业化中心',level:'B级',budget:'80万',estimatedClose:'下个月',daysFollowedUp:8,content:'完成了第二轮系统演示，客户技术团队就数据隐私安全提出了几个疑问，已发邮件解答。',followUp:'上周一'},
      ],
      contractList:[
        {name:'腾讯云',amount:'85万',product:'SaaS私有化部署',date:'10月12日'},
        {name:'百度智能云',amount:'60万',product:'积分商城SaaS 1年订阅',date:'10月08日'},
        {name:'快手科技',amount:'23万',product:'综合产品包',date:'10月02日'},
      ],
      abnormalCases:[
        {name:'滴滴出行-本地生活',type:'流失客户',reason:'竞品低价抢标，未能体现差异化价值',date:'今天 10:00'},
        {name:'河北某制造厂',type:'无效线索',reason:'核心对接人已离职，无新负责人接洽',date:'10月15日'},
        {name:'天津某物流公司',type:'退回线索池',reason:'项目预算严重不足，不符合大客准入标准',date:'10月10日'},
      ],
    },
    funnelData:{'累计':{leads:1250,customers:320,closed:65,amount:'1250万'},'当月':{leads:120,customers:24,closed:8,amount:'168万'},'行业':{leads:85,customers:15,closed:6,amount:'120万'},'AI推荐':{leads:60,customers:12,closed:5,amount:'95万'}},
    burndown:{labels:['0天','1天','2天','3天','4天','5天','7天+'],overdueLeads:[15,10,5,2,0,0,0],levelA:[8,2,0,0,0,0,0],levelB:[12,8,4,1,0,0,0],levelC:[20,15,10,5,2,0,0],levelD:[30,25,20,15,10,5,2]},
    records:[
      {date:'今天 14:30',type:'线下拜访',location:'客户北京总部3层会议室',client:'字节跳动-企业效能部',contact:'王总 (CTO), 刘经理 (采购)',purpose:'POC测试复盘与商务预热',content:'详细演示了POC测试报告，客户对SaaS定制化方案的各项性能指标表示认可。进一步沟通了部署周期，客户明确要求我方下周三前出具正式商务报价及实施排期表。',status:'A级客户'},
      {date:'昨天 10:15',type:'预约产品演示demo',location:'线上会议室',client:'新浪微博',contact:'张总监 (IT部)',purpose:'系统扩容规划演示',content:'为客户IT团队进行了新版权限管理模块的产品演示Demo，客户对坐席分配逻辑很满意，预计新增坐席500个。',status:'B级客户'},
      {date:'本周一 16:00',type:'发送报价单',location:'企业邮箱',client:'京东物流-华北区',contact:'李经理 (业务侧)',purpose:'发送年度框架报价',content:'根据前期沟通的实施细则，已向客户发送正式的商务报价单，包含基础版+增值服务包，等待对方内部比价反馈。',status:'A级客户'},
    ],
    analysis:{successBehaviors:'善于在早期识别决策链，通过定制化方案快速锁定预算。',errorAreas:'在合同法务审核阶段跟进不够紧密。',touchpoints:'POC阶段结束后的第一次复盘会议。',optimization:'建议法务流程提前介入。'},
  },
  {
    id:'2', name:'李宇轩', gender:'男', age:26, birthDate:'1998-03-08', hireDate:'2022-04-10',
    avatar:'https://i.pravatar.cc/150?u=22', location:'上海市浦东新区',
    industries:['快消品','零售餐饮'], position:'销售经理', tenure:'2年',
    skills:['快消行业','地推能力','抗压能力强'], aiSuggestedTags:['客情维护极佳','高频拜访型'],
    targets:{targetAmount:'80万',targetNewCustomers:50,targetConversionRate:'4%'},
    taskLoad:{weeklyFollowUps:82,pendingVisits:6,status:'饱满',weight:80,dailyCapacity:{leads:100,customers:20}},
    followUpCount:204, visitedCount:59, intentCustomers:21,
    metrics:{
      cumulativeCustomers:580, cumulativeAmount:'860万', monthlyNewCustomers:45,
      monthlyClosedCount:12, monthlyClosedAmount:'76', monthlyConversionRate:'2.0',
      warnings:['当月转换率 (2.0%) 低于组内均线，客户盘子大但收口转化较弱'],
      intentList:[
        {name:'百联集团',level:'B级',budget:'30万',estimatedClose:'本周五',daysFollowedUp:7,content:'送去中秋礼盒并介绍下半年的最新促销活动政策。',followUp:'7天前'},
        {name:'光明乳业',level:'C级',budget:'20万',estimatedClose:'评估中',daysFollowedUp:12,content:'发送了重新核算后的产品组合报价单，客户表示单价偏高。',followUp:'12天前'},
        {name:'全家便利店',level:'C级',budget:'30万',estimatedClose:'评估中',daysFollowedUp:16,content:'初步互换名片，了解了对方今年的拓店计划。',followUp:'16天前'},
        {name:'来伊份',level:'D级',budget:'未知',estimatedClose:'评估中',daysFollowedUp:45,content:'拨打电话未接通，后续再尝试联系。',followUp:'45天前'},
      ],
      contractList:[
        {name:'大润发',amount:'45万',product:'综合产品包',date:'10月15日'},
        {name:'盒马鲜生',amount:'31万',product:'积分商城SaaS 1年订阅',date:'10月05日'},
      ],
      abnormalCases:[
        {name:'喜茶(某大区)',type:'暂停合作',reason:'客户内部组织架构大调整，业务全部暂停',date:'昨天 16:30'},
        {name:'某夫妻便利店',type:'无效线索',reason:'单店模式，无系统化管理需求',date:'10月18日'},
        {name:'联华超市(加盟商)',type:'退回线索池',reason:'加盟商无自主采购权，需从集团统采切入',date:'10月12日'},
      ],
    },
    funnelData:{'累计':{leads:2500,customers:580,closed:85,amount:'860万'},'当月':{leads:250,customers:45,closed:12,amount:'76万'},'行业':{leads:180,customers:30,closed:8,amount:'50万'},'AI推荐':{leads:120,customers:22,closed:7,amount:'45万'}},
    burndown:{labels:['0天','1天','2天','3天','4天','5天','7天+'],overdueLeads:[45,35,25,15,10,5,2],levelA:[2,1,0,0,0,0,0],levelB:[15,10,5,2,1,0,0],levelC:[40,30,20,10,5,2,0],levelD:[80,70,60,40,20,10,5]},
    records:[
      {date:'今天 09:30',type:'线下拜访',location:'百联集团总部大楼',client:'百联集团',contact:'陈总 (市场部)',purpose:'中秋客情维护及新政策宣发',content:'送去中秋礼盒，并在闲聊中介绍下半年的最新促销活动政策，客户表示对满减组合有一定兴趣，约定后续再细聊。',status:'C级客户'},
      {date:'昨天 15:40',type:'发送报价单',location:'微信发送',client:'光明乳业',contact:'赵经理 (采购部)',purpose:'跟进产品组合方案反馈',content:'发送了重新核算后的产品组合报价单，客户表示整体单价依然偏高，且目前正在对接两家竞品比价，推进遇到一定阻力。',status:'C级客户'},
    ],
    analysis:{successBehaviors:'极高的拜访频次和极强的客情维护能力，客户信任度高。',errorAreas:'对复杂产品组合的方案价值传递不足，多以单产品切入。',touchpoints:'线下的业务聚会和非正式交流场合。',optimization:'主管需定期介入指导其制作整合营销方案。'},
  },
  {
    id:'3', name:'王诗语', gender:'女', age:31, birthDate:'1993-11-20', hireDate:'2019-03-01',
    avatar:'https://i.pravatar.cc/150?u=33', location:'深圳市南山区',
    industries:['金融','保险'], position:'解决方案销售', tenure:'5年',
    skills:['金融科技','技术背景','招投标'], aiSuggestedTags:['合规把控','CTO对话级'],
    targets:{targetAmount:'300万',targetNewCustomers:15,targetConversionRate:'2%'},
    taskLoad:{weeklyFollowUps:30,pendingVisits:1,status:'空闲',weight:120,dailyCapacity:{leads:30,customers:10}},
    followUpCount:98, visitedCount:14, intentCustomers:8,
    metrics:{
      cumulativeCustomers:85, cumulativeAmount:'2400万', monthlyNewCustomers:12,
      monthlyClosedCount:2, monthlyClosedAmount:'405', monthlyConversionRate:'2.3', warnings:[],
      intentList:[
        {name:'招商银行',level:'A级',budget:'500万',estimatedClose:'下个月',daysFollowedUp:1,content:'提供了全私有化部署架构演示，彻底打消了合规顾虑，准备推进招投标。',followUp:'昨天'},
        {name:'平安保险',level:'A级',budget:'350万',estimatedClose:'本月底',daysFollowedUp:4,content:'整理并发送了最新的招投标文件初稿、实施明细以及项目整体报价单。',followUp:'4天前'},
        {name:'微众银行(二期)',level:'B级',budget:'120万',estimatedClose:'下个月',daysFollowedUp:6,content:'跟进二期扩容进度，客户反馈预算审批延后到下个月。',followUp:'6天前'},
      ],
      contractList:[
        {name:'微众银行',amount:'260万',product:'SaaS私有化部署',date:'10月18日'},
        {name:'南方基金',amount:'145万',product:'综合产品包',date:'10月11日'},
      ],
      abnormalCases:[
        {name:'某城商行',type:'流失客户',reason:'合规评审未通过，客户最终转向本地具备国企背景的供应商',date:'10月25日'},
        {name:'某地方农商行',type:'暂停合作',reason:'因行内架构调整，项目预算遭冻结，建议明年Q2再议',date:'10月20日'},
      ],
    },
    funnelData:{'累计':{leads:350,customers:85,closed:18,amount:'2400万'},'当月':{leads:80,customers:12,closed:2,amount:'405万'},'行业':{leads:60,customers:8,closed:2,amount:'405万'},'AI推荐':{leads:40,customers:5,closed:1,amount:'180万'}},
    burndown:{labels:['0天','1天','2天','3天','4天','5天','7天+'],overdueLeads:[5,2,0,0,0,0,0],levelA:[10,5,1,0,0,0,0],levelB:[8,4,2,0,0,0,0],levelC:[5,3,1,0,0,0,0],levelD:[10,8,5,3,1,0,0]},
    records:[
      {date:'今天 11:00',type:'线下拜访',location:'招商银行科技大楼',client:'招商银行',contact:'周总 (数据架构师)',purpose:'项目架构评审与合规答疑',content:'参与项目架构深度评审，针对客户重点关注的数据合规性和安全性问题，提供了全私有化部署架构演示，彻底打消了客户顾虑。',status:'A级客户'},
      {date:'上周五 14:00',type:'发送报价单',location:'企业邮箱',client:'平安保险',contact:'孙经理 (招投标办)',purpose:'发送预审文件与报价',content:'整理并发送了最新的招投标文件初稿、实施明细以及项目整体报价单供客户预审，等待反馈修改意见。',status:'B级客户'},
    ],
    analysis:{successBehaviors:'技术底子深厚，能直接与客户CTO对话。',errorAreas:'对于小预算的短平快项目缺乏耐心。',touchpoints:'架构评审会和安全合规答疑环节。',optimization:'建议将其定位为纯大客打猎型销售。'},
  },
  {
    id:'4', name:'吴优', gender:'女', age:23, birthDate:'2001-07-05', hireDate:'2023-08-01',
    avatar:'https://i.pravatar.cc/150?u=77', location:'武汉市洪山区',
    industries:['电子商务','教育培训'], position:'SDR/电话销售', tenure:'8个月',
    skills:['高频外呼','情绪管理'], aiSuggestedTags:['线索挖掘机','破冰留存高'],
    targets:{targetAmount:'15万',targetNewCustomers:150,targetConversionRate:'0.8%'},
    taskLoad:{weeklyFollowUps:200,pendingVisits:5,status:'超负荷',weight:50,dailyCapacity:{leads:150,customers:30}},
    followUpCount:850, visitedCount:18, intentCustomers:45,
    metrics:{
      cumulativeCustomers:1520, cumulativeAmount:'86万', monthlyNewCustomers:120,
      monthlyClosedCount:10, monthlyClosedAmount:'15.3', monthlyConversionRate:'0.6',
      warnings:['由于客户基数过大，当月转换率(0.6%)触底，建议系统进行死海回收清洗'],
      intentList:[
        {name:'良品铺子',level:'C级',budget:'5万',estimatedClose:'本周',daysFollowedUp:1,content:'成功邀约了明天的线上产品演示Demo，预计30分钟。',followUp:'昨天'},
        {name:'斗鱼直播',level:'B级',budget:'8万',estimatedClose:'下周',daysFollowedUp:2,content:'安排了售前技术支持进行专属的线上Demo演示与答疑。',followUp:'前天'},
        {name:'三只松鼠',level:'D级',budget:'3万',estimatedClose:'评估中',daysFollowedUp:14,content:'对方反馈需要和领导确认，让下周再联系。',followUp:'14天前'},
        {name:'完美日记',level:'D级',budget:'2万',estimatedClose:'评估中',daysFollowedUp:26,content:'发送了系统使用手册，对方一直未回复。',followUp:'26天前'},
        {name:'周黑鸭',level:'C级',budget:'未知',estimatedClose:'评估中',daysFollowedUp:38,content:'发送了单门店版的基础报价单，客户反馈预算已收紧。',followUp:'38天前'},
      ],
      contractList:[
        {name:'卓尔控股',amount:'10万',product:'积分商城SaaS 1年订阅',date:'10月20日'},
        {name:'九州通医药',amount:'5.3万',product:'综合产品包',date:'10月04日'},
      ],
      abnormalCases:[
        {name:'未知线索A',type:'无效线索',reason:'空号 / 接通后对方直接挂断',date:'今天 11:45'},
        {name:'周黑鸭',type:'退回线索池',reason:'今年门店预算收紧，近期无相关计划',date:'昨天 14:20'},
        {name:'某初创微商',type:'无效线索',reason:'非目标客群，组织规模太小',date:'上周五'},
        {name:'小王个人创业',type:'无效线索',reason:'个人性质无预算，白嫖资料',date:'本周三'},
        {name:'同行探盘',type:'无效线索',reason:'测试发现对方是某竞品的销售假冒',date:'本周一'},
      ],
    },
    funnelData:{'累计':{leads:8500,customers:1520,closed:85,amount:'86万'},'当月':{leads:850,customers:120,closed:10,amount:'15.3万'},'行业':{leads:500,customers:80,closed:6,amount:'9万'},'AI推荐':{leads:300,customers:45,closed:5,amount:'8万'}},
    burndown:{labels:['0天','1天','2天','3天','4天','5天','7天+'],overdueLeads:[150,120,90,60,40,20,10],levelA:[5,2,0,0,0,0,0],levelB:[20,15,10,5,2,0,0],levelC:[80,60,40,20,10,5,0],levelD:[120,100,80,60,40,20,10]},
    records:[
      {date:'今天 16:30',type:'预约产品演示demo',location:'线上会议室',client:'良品铺子',contact:'吴经理 (电商运营)',purpose:'初步展示系统功能',content:'客户对营销活动案例很感兴趣，已成功为其预约了明天的线上产品演示Demo，预计30分钟。',status:'B级客户'},
      {date:'今天 15:10',type:'预约产品演示demo',location:'线上会议室',client:'斗鱼直播',contact:'郑主管 (技术运维)',purpose:'技术答疑与实操演示',content:'针对客户的具体API对接疑问，安排了售前技术支持进行专属的线上Demo演示与答疑，建立信任。',status:'B级客户'},
      {date:'昨天 14:20',type:'发送报价单',location:'微信发送',client:'周黑鸭',contact:'王店长',purpose:'跟进门店采购意向',content:'发送了单门店版的基础报价单，但客户明确表示今年门店预算已收紧，近期无相关采购计划，转入沉睡池。',status:'C级客户'},
    ],
    analysis:{successBehaviors:'抗压能力极强，前30秒破冰留存率极高。',errorAreas:'面对复杂问题时容易卡壳。',touchpoints:'首次接通电话的前30秒。',optimization:'加强核心产品价值主张培训。'},
  },
];

// ============================================================
// SECTION 3: 共享基础组件
// ============================================================
const Toast = ({ message, type='success' }) => {
  if (!message) return null;
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-3.5 rounded-full shadow-lg border font-medium text-sm ${type==='success'?'bg-white text-emerald-700 border-emerald-100':'bg-white text-red-700 border-red-100'}`}>
        {type==='success'?<CheckCircle2 size={18} className="text-emerald-500"/>:<AlertCircle size={18} className="text-red-500"/>}
        {message}
      </div>
    </div>
  );
};

const EmptyState = ({ text, icon: Icon }) => {
  if (Icon) return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-400 w-full min-h-[200px]">
      <Icon className="w-10 h-10 mb-3 text-slate-200" strokeWidth={1.5}/>
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <CheckCircle2 size={40} className="mb-4 text-emerald-400 opacity-50"/>
      <p className="font-bold">{text}</p>
    </div>
  );
};

function CompanyAutocomplete({ value, onChange, className, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const handleChange = (e) => {
    const val = e.target.value; onChange(val);
    if (val.trim()) { setSuggestions(MOCK_COMPANY_DB.filter(c=>c.toLowerCase().includes(val.toLowerCase()))); setIsOpen(true); }
    else setIsOpen(false);
  };
  return (
    <div className="relative w-full">
      <input type="text" value={value} onChange={handleChange}
        onFocus={()=>value&&setIsOpen(true)} onBlur={()=>setTimeout(()=>setIsOpen(false),200)}
        className={className} placeholder={placeholder||"请输入公司全称..."} autoComplete="off"/>
      {isOpen&&suggestions.length>0&&(
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-48 overflow-auto py-2">
          {suggestions.map((c,i)=>(
            <li key={i} onMouseDown={()=>{onChange(c);setIsOpen(false);}}
              className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer flex items-center gap-2">
              <Building2 size={14} className="text-slate-400"/>{c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// SECTION 4: 统一布局
// ============================================================
const SystemSidebar = ({ activeModule, setActiveModule }) => {
  const [expanded, setExpanded] = useState(true);
  const modules = [{key:'leads',label:'线索管理'},{key:'pitch',label:'AI 推客'},{key:'profile',label:'销售画像'}];
  return (
    <div className="w-[240px] bg-[#2B303B] flex flex-col h-full z-20 flex-shrink-0 text-slate-300">
      <div className="h-16 flex items-center px-5 border-b border-slate-700 flex-shrink-0">
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center mr-3"><Building2 size={14} className="text-white"/></div>
        <span className="text-white font-bold">CRM Workspace</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5">
          <li className="mt-2">
            <div onClick={()=>setExpanded(!expanded)} className="flex items-center justify-between px-6 py-3 bg-slate-700 text-white cursor-pointer hover:bg-slate-600 transition-colors">
              <div className="flex items-center"><PieChart size={18} className="mr-3 text-blue-400"/><span className="text-sm font-bold">销售线索</span></div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${expanded?'rotate-0':'-rotate-90'}`}/>
            </div>
            {expanded&&(
              <ul className="bg-[#242833] py-1">
                {modules.map(m=>(
                  <li key={m.key}>
                    <div onClick={()=>setActiveModule(m.key)}
                      className={`flex items-center pl-12 pr-6 py-2.5 cursor-pointer transition-colors border-l-4 ${activeModule===m.key?'text-blue-400 bg-[#2f3542] border-blue-500 font-bold':'text-slate-400 hover:text-white hover:bg-slate-700/30 border-transparent'}`}>
                      <span className="text-sm">{m.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

const SystemHeader = ({ userRole, setUserRole }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 flex-shrink-0 shadow-sm">
    <button className="text-slate-500 hover:text-blue-600 transition-colors"><Menu size={20}/></button>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input type="text" placeholder="请输入客户名称" className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm w-64 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"/>
      </div>
      <div className="flex items-center bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 text-sm">
        <UserCheck size={16} className="text-blue-600 mr-2"/>
        <select value={userRole} onChange={e=>setUserRole(e.target.value)} className="bg-transparent border-none outline-none cursor-pointer font-medium text-blue-700">
          <option value="manager">主管视角 (Manager)</option>
          <option value="sales">销售视角 (张三)</option>
        </select>
      </div>
      <button className="text-slate-400 relative"><Bell size={20}/><span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"/></button>
      <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">包</div>
        <span className="text-sm font-medium text-slate-700">包子</span>
        <ChevronDown size={14} className="text-slate-400"/>
      </div>
    </div>
  </header>
);

// ============================================================
// SECTION 5: 线索管理模块
// ============================================================

function LeadsModule({ userRole, showToast }) {
  const [currentView, setCurrentView] = useState('list');
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const currentUserName = '张三';

  const [autoAssignConfig, setAutoAssignConfig] = useState({
    enabled: true, mode: 'smart', time: '09:00', limitPerRep: 5, reps: ['张三','李四','王五','孙琦']
  });
  const [assignLogs, setAssignLogs] = useState([
    { id:101, date:'2024-04-07 09:00:00', type:'智能负载均衡', total:17, details:'李四(10), 孙琦(5), 王五(2), 张三(0)', status:'成功', assignments:[] }
  ]);

  const handleAddLead = (data) => {
    const contact = {
      id:Date.now()+1, name:data.name, position:data.position, companyName:data.companyName,
      phones:data.phone?[data.phone]:[], wechat:data.wechat||'暂无', email:data.email||'暂无', social:data.social||'暂无', note:data.contactNote,
      tags:["手工录入"], tagColor:"bg-blue-50 text-blue-700 border-blue-100", pitch:"新录入客户，暂无AI分析话术。", aiAdvice:"建议尽快破冰沟通补充画像。"
    };
    const lead = { ...data, id:Date.now(), date:new Date().toISOString().split('T')[0], company:data.companyName||'未知公司',
      status:'新线索', owner:currentUserName, isSelfAdded:true, score:80, daysUncontacted:0, trackStatus:'pending',
      companyNote:data.companyNote||'', contacts:[contact], history:[] };
    setLeads([lead,...leads]); setCurrentView('list'); showToast('✅ 线索已成功录入');
  };

  const handleBatchImport = (imported) => {
    const formatted = imported.map((l,i)=>({...l,id:Date.now()+i,date:new Date().toISOString().split('T')[0],status:'新线索',source:'批量导入',industry:'未知行业',history:[],owner:'未分配',score:80,daysUncontacted:0,trackStatus:'pending',companyNote:'',contacts:[],isSelfAdded:false}));
    setLeads([...formatted,...leads]); setCurrentView('list'); showToast('✅ 线索批量导入成功');
  };

  const handleBatchOcrAdd = (parsedLeads) => {
    const formatted = parsedLeads.map((l,i)=>{
      const c={id:Date.now()+i+100,name:l.name,position:l.position,companyName:l.company,phones:l.phone?[l.phone]:[],wechat:l.wechat||'暂无',email:l.email||'暂无',social:'暂无',note:'',tags:["名片批量提取"],tagColor:"bg-blue-50 text-blue-700 border-blue-100",pitch:"批量名片录入客户。",aiAdvice:"建议尽快核对信息并跟进。"};
      return {id:Date.now()+i,date:new Date().toISOString().split('T')[0],name:l.name,company:l.company,industry:l.industry||'未知行业',phone:l.phone,email:l.email,source:'展会名片批量扫描',owner:currentUserName,isSelfAdded:true,status:'新线索',score:80+Math.floor(Math.random()*15),daysUncontacted:0,trackStatus:'pending',companyNote:'',contacts:[c],history:[]};
    });
    setLeads([...formatted,...leads]); setCurrentView('list'); showToast(`✅ 成功批量录入 ${formatted.length} 张名片线索`);
  };

  const handleReturnToPool = (id) => {
    const updated = leads.map(l=>l.id===id?{...l,owner:'未分配',status:'退回待分配',isSelfAdded:false}:l);
    setLeads(updated);
    if(selectedLead?.id===id) setSelectedLead(updated.find(x=>x.id===id));
    showToast('🔄 线索已退回到公海池');
  };

  const handleUpdateLead = (updated) => {
    setLeads(leads.map(l=>l.id===updated.id?updated:l)); setSelectedLead(updated); showToast('✅ 信息更新成功');
  };

  const handleAssign = (idsOrAssignments, ownerOrNull) => {
    let assignedData=[];
    if(Array.isArray(idsOrAssignments)&&typeof idsOrAssignments[0]==='object'){
      const assignments=idsOrAssignments;
      setLeads(leads.map(l=>{const m=assignments.find(a=>a.id===l.id);if(m){assignedData.push({id:l.id,to:m.owner,name:l.name,company:l.company});return{...l,owner:m.owner,status:l.status==='新线索'?'二次分配线索':l.status,isSelfAdded:false};}return l;}));
      const dm={};assignments.forEach(a=>{dm[a.owner]=(dm[a.owner]||0)+1;});
      setAssignLogs([{id:Date.now(),date:new Date().toLocaleString(),type:'主管 AI 智能分配',total:assignments.length,details:Object.entries(dm).map(([k,v])=>`${k}(${v})`).join(', '),status:'成功',assignments:assignedData},...assignLogs]);
      showToast('✅ AI 智能分配已生效');
    } else {
      setLeads(leads.map(l=>{if(idsOrAssignments.includes(l.id)){assignedData.push({id:l.id,to:ownerOrNull,name:l.name,company:l.company});return{...l,owner:ownerOrNull,status:l.status==='新线索'?'二次分配线索':l.status,isSelfAdded:false};}return l;}));
      setAssignLogs([{id:Date.now(),date:new Date().toLocaleString(),type:'主管手动分配',total:idsOrAssignments.length,details:`${ownerOrNull}(${idsOrAssignments.length})`,status:'成功',assignments:assignedData},...assignLogs]);
      showToast(`✅ 已成功分配给 ${ownerOrNull}`);
    }
  };

  const handleRevokeAssign = (logId) => {
    const log=assignLogs.find(l=>l.id===logId);
    if(!log||log.status==='已撤回') return;
    const ids=(log.assignments||[]).map(a=>a.id);
    setLeads(prev=>prev.map(l=>ids.includes(l.id)?{...l,owner:'未分配',status:'退回待分配',isSelfAdded:false}:l));
    setAssignLogs(prev=>prev.map(l=>l.id===logId?{...l,status:'已撤回'}:l));
    showToast('✅ 派发已成功撤回，线索已返回公海池');
  };

  const handleSimulateAutoAssign = () => {
    const unassigned=leads.filter(l=>l.owner==='未分配'&&l.status!=='失效线索'&&l.status!=='异常线索');
    if(!unassigned.length) return showToast('❌ 公海池中没有可分配的有效线索','error');
    if(!autoAssignConfig.reps.length) return showToast('❌ 请至少选择一名接收线索的销售','error');
    let li=0,assignDetails=[],total=0,updated=[...leads],assignedData=[];
    for(const rep of autoAssignConfig.reps){
      let lim=autoAssignConfig.limitPerRep;
      if(autoAssignConfig.mode==='smart'){const w=MOCK_REP_PERFORMANCE[rep]?.intent||0;if(w>=30)lim=1;else if(w>=20)lim=3;else if(w>=10)lim=6;else lim=15;}
      let cnt=0;
      while(cnt<lim&&li<unassigned.length){
        const l=unassigned[li];updated=updated.map(x=>x.id===l.id?{...x,owner:rep,status:'二次分配线索'}:x);assignedData.push({id:l.id,to:rep,name:l.name,company:l.company});cnt++;total++;li++;
      }
      if(cnt>0) assignDetails.push(`${rep}(${cnt})`);
    }
    if(total>0){
      setLeads(updated);
      setAssignLogs([{id:Date.now(),date:new Date().toLocaleString(),type:autoAssignConfig.mode==='smart'?'智能负载均衡':'固定定时分配',total,details:assignDetails.join(', '),status:'成功',assignments:assignedData},...assignLogs]);
      showToast(`✅ 成功模拟执行分配策略，共派发 ${total} 条线索`);
    } else showToast('❌ 当前销售的分配限额已满或没有足够线索','error');
  };

  const handleBatchDelete = (ids) => {
    setLeads(leads.filter(l=>!ids.includes(l.id)));
    if(selectedLead&&ids.includes(selectedLead.id)){setCurrentView('list');setSelectedLead(null);}
    showToast(`✅ 成功删除 ${ids.length} 条线索`);
  };

  const filtered = leads.filter(l=>userRole==='manager'?true:(l.owner===currentUserName||l.owner==='未分配'));

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
      {currentView==='list'&&<LeadListView allLeads={leads} setAllLeads={setLeads} leads={filtered} userRole={userRole} teamMembers={teamMembers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAdd={()=>setCurrentView('add')} onImport={()=>setCurrentView('import')} onBatchOcr={()=>setCurrentView('batchOcr')} onDetail={(l,edit)=>{setSelectedLead(l);setIsEditMode(edit);setCurrentView('detail');}} onAssign={handleAssign} onReturn={handleReturnToPool} onBatchDelete={handleBatchDelete} showToast={showToast} autoAssignConfig={autoAssignConfig} setAutoAssignConfig={setAutoAssignConfig} assignLogs={assignLogs} handleSimulateAutoAssign={handleSimulateAutoAssign} handleRevokeAssign={handleRevokeAssign}/>}
      {currentView==='add'&&<LeadAddView onCancel={()=>setCurrentView('list')} onSave={handleAddLead} showToast={showToast}/>}
      {currentView==='import'&&<LeadImportView onCancel={()=>setCurrentView('list')} onConfirm={handleBatchImport}/>}
      {currentView==='batchOcr'&&<LeadBatchOcrView onCancel={()=>setCurrentView('list')} onSaveBatch={handleBatchOcrAdd} showToast={showToast}/>}
      {currentView==='detail'&&selectedLead&&<LeadDetailView lead={selectedLead} isEdit={isEditMode} setIsEdit={setIsEditMode} userRole={userRole} onBack={()=>setCurrentView('list')} onSave={handleUpdateLead} onReturn={handleReturnToPool} showToast={showToast} leads={leads} setLeads={setLeads} setSelectedLead={setSelectedLead}/>}
    </main>
  );
}

// --- 线索列表视图 ---
function LeadListView({ allLeads, setAllLeads, leads, userRole, teamMembers, searchQuery, setSearchQuery, onAdd, onImport, onBatchOcr, onDetail, onAssign, onReturn, onBatchDelete, showToast, autoAssignConfig, setAutoAssignConfig, assignLogs, handleSimulateAutoAssign, handleRevokeAssign }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [showDataCleanModal, setShowDataCleanModal] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [jumpPage, setJumpPage] = useState('');
  const [showAIAssignModal, setShowAIAssignModal] = useState(false);
  const [aiAssignPreview, setAiAssignPreview] = useState([]);
  const [activeAutoAssignTab, setActiveAutoAssignTab] = useState('config');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [filterOwner, setFilterOwner] = useState([]);
  const [filterIndustry, setFilterIndustry] = useState([]);
  const [filterSource, setFilterSource] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  const filterOptions = {
    industries:['人工智能','企业服务','智能制造','电子商务','通信电子','游戏开发'],
    sources:['名片录入','批量导入','小红书','抖音','名片','展会画册','网络搜索','信息流广告'],
    statuses:['新线索','退回待分配','失效线索','二次分配线索','三次分配线索','异常线索'],
  };

  const displayLeads = leads.filter(l=>
    (l.name.toLowerCase().includes(searchQuery.toLowerCase())||l.company.toLowerCase().includes(searchQuery.toLowerCase()))&&
    (filterOwner.length===0||filterOwner.includes(l.owner))&&
    (filterIndustry.length===0||filterIndustry.includes(l.industry))&&
    (filterSource.length===0||filterSource.some(s=>l.source.includes(s)))&&
    (filterStatus.length===0||filterStatus.includes(l.status))
  );

  useEffect(()=>{setCurrentPage(1);setSelectedIds([]);},[searchQuery,filterOwner,userRole,filterIndustry,filterSource,filterStatus]);

  const totalPages=Math.max(1,Math.ceil(displayLeads.length/itemsPerPage));
  const paginatedLeads=displayLeads.slice((currentPage-1)*itemsPerPage,currentPage*itemsPerPage);
  const isAllSelected=displayLeads.length>0&&selectedIds.length===displayLeads.length;
  const isCurrentPageSelected=paginatedLeads.length>0&&paginatedLeads.every(l=>selectedIds.includes(l.id));

  const handleSelectAllToggle=()=>isAllSelected?setSelectedIds([]):setSelectedIds(displayLeads.map(l=>l.id));
  const handlePageSelectToggle=()=>{
    if(isCurrentPageSelected){const ids=paginatedLeads.map(l=>l.id);setSelectedIds(selectedIds.filter(id=>!ids.includes(id)));}
    else{setSelectedIds(Array.from(new Set([...selectedIds,...paginatedLeads.map(l=>l.id)])));}
  };
  const handleInvertSelection=()=>setSelectedIds(displayLeads.map(l=>l.id).filter(id=>!selectedIds.includes(id)));
  const toggleSelection=(id)=>setSelectedIds(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);

  const handleOpenAIAssign=()=>{
    const reasons=["该客户公司主营业务与销售【{owner}】画像匹配，其擅长攻坚传统行业大客户。","该客户属于互联网科技行业，【{owner}】有多个同行业成功交付案例，业务认知契合度达95%。","线索来源为短视频获客，【{owner}】跟进此类线索转化率（28%）居团队首位。"];
    setAiAssignPreview(selectedIds.map((id,i)=>{const lead=displayLeads.find(l=>l.id===id);const owner=teamMembers[i%teamMembers.length];return{id:lead.id,name:lead.name,company:lead.company,owner,reason:reasons[i%reasons.length].replace(/\{owner\}/g,owner)};}));
    setShowAIAssignModal(true);
  };
  const confirmAIAssign=()=>{onAssign(aiAssignPreview,null);setShowAIAssignModal(false);setSelectedIds([]);};

  const FilterBar = ()=>(
    <div className="px-6 py-2 bg-slate-50/50 border-y border-slate-100">
      {userRole==='manager'&&(
        <div className="flex items-start gap-4 py-3 border-b border-slate-100/80">
          <div className="text-sm font-bold text-slate-700 w-16 shrink-0 pt-1">负责人</div>
          <div className="flex flex-wrap gap-2 flex-1">
            <button onClick={()=>setFilterOwner([])} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filterOwner.length===0?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>不限</button>
            <button onClick={()=>setFilterOwner(prev=>prev.includes('未分配')?prev.filter(x=>x!=='未分配'):[...prev,'未分配'])} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filterOwner.includes('未分配')?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>未分配</button>
            {teamMembers.map(opt=><button key={opt} onClick={()=>setFilterOwner(prev=>prev.includes(opt)?prev.filter(x=>x!==opt):[...prev,opt])} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filterOwner.includes(opt)?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{opt}</button>)}
          </div>
        </div>
      )}
      {[{label:'行业',opts:filterOptions.industries,state:filterIndustry,setter:setFilterIndustry},{label:'来源',opts:filterOptions.sources,state:filterSource,setter:setFilterSource},{label:'状态',opts:filterOptions.statuses,state:filterStatus,setter:setFilterStatus}].map(({label,opts,state,setter},gi)=>(
        <div key={label} className={`flex items-start gap-4 py-3 ${gi<2?'border-b border-slate-100/80':''}`}>
          <div className="text-sm font-bold text-slate-700 w-16 shrink-0 pt-1">{label}</div>
          <div className="flex flex-wrap gap-2 flex-1">
            <button onClick={()=>setter([])} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${state.length===0?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>不限</button>
            {opts.map(opt=><button key={opt} onClick={()=>setter(prev=>prev.includes(opt)?prev.filter(x=>x!==opt):[...prev,opt])} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${state.includes(opt)?'bg-blue-600 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{opt}</button>)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-2"><h2 className="text-2xl font-bold text-slate-800">销售线索管理列表</h2></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 pb-5 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onBatchOcr} className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-1.5"><ScanLine size={16}/>批量名片识别</button>
            {userRole==='manager'&&<>
              <button onClick={onImport} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"><UploadCloud size={16}/>批量导入</button>
              <button onClick={()=>setShowDataCleanModal(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"><ShieldCheck size={16} className="text-indigo-600"/>智能清洗</button>
              <button onClick={()=>setShowAutoAssignModal(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"><CalendarClock size={16} className="text-indigo-600"/>自动分配策略</button>
            </>}
            <button onClick={onAdd} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 shadow-sm transition-colors"><Plus size={16}/>录入新线索</button>
          </div>
          <div className="relative flex-grow lg:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="检索联系人或公司..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-full lg:w-60 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
          </div>
        </div>

        <FilterBar/>

        {userRole==='manager'&&(
          <div className={`flex items-center gap-3 px-6 py-3 bg-slate-50/80 border-b border-slate-100 transition-opacity ${selectedIds.length>0?'opacity-100':'opacity-40 pointer-events-none grayscale'}`}>
            <span className="text-xs text-slate-500 font-semibold mr-2">已选中 <span className="text-blue-600">{selectedIds.length}</span> 项</span>
            <button onClick={handleOpenAIAssign} className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors shadow-sm">AI智能分配</button>
            <button onClick={()=>setShowAssignModal(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-sm">批量手动分配</button>
            <button onClick={()=>{setDeleteTargetIds(selectedIds);setShowDeleteModal(true);}} className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm">批量删除</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-semibold">
              <tr>
                {userRole==='manager'&&<th className="px-6 py-4 w-14 text-center"><input type="checkbox" checked={isCurrentPageSelected} onChange={handlePageSelectToggle} className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"/></th>}
                <th className="px-6 py-4">公司</th><th className="px-6 py-4">行业</th><th className="px-6 py-4">联系人</th>
                <th className="px-6 py-4">线索来源</th><th className="px-6 py-4">线索状态</th><th className="px-6 py-4">负责人</th><th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedLeads.length>0?paginatedLeads.map(l=>{
                const canEdit=userRole==='manager'||(userRole==='sales'&&l.isSelfAdded);
                const canReturn=userRole==='sales'&&!l.isSelfAdded&&l.owner!=='未分配';
                return (
                  <tr key={l.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(l.id)?'bg-blue-50/30':''}`}>
                    {userRole==='manager'&&<td className="px-6 py-4 text-center"><input type="checkbox" checked={selectedIds.includes(l.id)} onChange={()=>toggleSelection(l.id)} className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"/></td>}
                    <td className="px-6 py-4 text-slate-600">{l.company}</td>
                    <td className="px-6 py-4 text-slate-500">{l.industry||'--'}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{l.name}</td>
                    <td className="px-6 py-4 text-slate-500">{l.source}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-md text-[11px] font-medium border ${statusColors[l.status]||'bg-slate-50 border-slate-200'}`}>{l.status}</span></td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        {l.owner!=='未分配'&&<div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">{l.owner[0]}</div>}
                        <span className={l.owner==='未分配'?'text-orange-500 font-semibold':''}>{l.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={()=>onDetail(l,false)} className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-full font-medium text-xs transition-colors">查看</button>
                        {userRole==='manager'&&<button onClick={()=>{setSelectedIds([l.id]);setShowAssignModal(true);}} className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full font-medium text-xs transition-colors">分配</button>}
                        {canEdit&&<button onClick={()=>onDetail(l,true)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-full font-medium text-xs transition-colors">编辑</button>}
                        {canReturn&&<button onClick={()=>onReturn(l.id)} className="px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-full font-medium text-xs transition-colors">退回</button>}
                        {userRole==='manager'&&<button onClick={()=>{setDeleteTargetIds([l.id]);setShowDeleteModal(true);}} className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-full font-medium text-xs transition-colors">删除</button>}
                      </div>
                    </td>
                  </tr>
                );
              }):<tr><td colSpan={8} className="px-8 py-24 text-center text-slate-400 font-medium">暂无匹配的线索数据</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {userRole==='manager'&&<>
              <button onClick={handleSelectAllToggle} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-medium text-slate-600 transition-colors shadow-sm">{isAllSelected?'取消全选':'全选'}</button>
              <button onClick={handleInvertSelection} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-medium text-slate-600 transition-colors shadow-sm">反选</button>
            </>}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>每页:</span>
              <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 cursor-pointer">
                <option value={5}>5 条</option><option value={10}>10 条</option><option value={20}>20 条</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"><ChevronLeft size={16}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors ${currentPage===p?'bg-blue-600 text-white shadow-sm':'hover:bg-slate-100 text-slate-700'}`}>{p}</button>
              ))}
              <button disabled={currentPage===totalPages||totalPages===0} onClick={()=>setCurrentPage(p=>p+1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"><ChevronRight size={16}/></button>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span>跳至:</span>
              <input type="text" value={jumpPage} onChange={e=>setJumpPage(e.target.value)}
                onBlur={()=>{const v=Number(jumpPage);if(v>=1&&v<=totalPages)setCurrentPage(v);setJumpPage('');}}
                onKeyDown={e=>{if(e.key==='Enter'){const v=Number(jumpPage);if(v>=1&&v<=totalPages)setCurrentPage(v);setJumpPage('');}}}
                className="w-10 h-7 border border-slate-200 rounded-lg outline-none focus:border-blue-400 text-center bg-slate-50"/>
              <span>页，共 {displayLeads.length} 条</span>
            </div>
          </div>
        </div>
      </div>

      {/* 智能清洗弹窗 */}
      {showDataCleanModal&&<DataCleaningModal leads={allLeads} setLeads={setAllLeads} onClose={()=>setShowDataCleanModal(false)} showToast={showToast}/>}

      {/* 自动分配策略弹窗 */}
      {showAutoAssignModal&&(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-[900px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-8 pt-8 pb-4 border-b border-slate-100 bg-slate-50/50 relative shrink-0">
              <button onClick={()=>setShowAutoAssignModal(false)} className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"><X size={20}/></button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600"><CalendarClock size={28}/></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">自动分配策略中心</h3>
                  <p className="text-sm text-slate-500 mt-1">智能分析团队负荷，将公海池线索实现自动化高效流转</p>
                </div>
              </div>
              <div className="flex gap-6 border-b border-slate-200">
                <button onClick={()=>setActiveAutoAssignTab('config')} className={`pb-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${activeAutoAssignTab==='config'?'border-indigo-600 text-indigo-700':'border-transparent text-slate-500 hover:text-slate-800'}`}><Settings2 size={16}/>策略配置</button>
                <button onClick={()=>setActiveAutoAssignTab('logs')} className={`pb-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${activeAutoAssignTab==='logs'?'border-indigo-600 text-indigo-700':'border-transparent text-slate-500 hover:text-slate-800'}`}><ListChecks size={16}/>派发日志记录</button>
              </div>
            </div>

            {activeAutoAssignTab==='config'?(
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
                {/* 分配模式 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/>分配模式设定</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    {[{v:'fixed',label:'固定平均配额',desc:'为所有勾选的销售人员，每天分配相同固定数量的线索。简单直接，绝对平均。',color:'border-blue-500 bg-blue-50/50'},{v:'smart',label:'智能负载均衡 ✨',desc:'系统实时分析销售当前的在跟意向客户数。向空闲人员倾斜资源，对饱和人员降级派发。',color:'border-indigo-500 bg-indigo-50/50'}].map(opt=>(
                      <label key={opt.v} className={`flex-1 flex items-start gap-4 p-5 border rounded-2xl cursor-pointer transition-all ${autoAssignConfig.mode===opt.v?opt.color:'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" name="assignMode" checked={autoAssignConfig.mode===opt.v} onChange={()=>setAutoAssignConfig({...autoAssignConfig,mode:opt.v})} className="mt-1 w-4 h-4 text-blue-600"/>
                        <div><span className="block text-base font-bold text-slate-800 mb-1">{opt.label}</span><span className="text-xs text-slate-500 leading-relaxed">{opt.desc}</span></div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* 参与人员 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Users size={18} className="text-blue-500"/>参与接单人员圈选</h4>
                  <p className="text-xs text-slate-500 mb-5">仅勾选的销售人员会被计入线索分配池</p>
                  <div className="flex flex-wrap gap-3">
                    {teamMembers.map(m=>{
                      const sel=autoAssignConfig.reps.includes(m);
                      return <div key={m} onClick={()=>setAutoAssignConfig({...autoAssignConfig,reps:sel?autoAssignConfig.reps.filter(r=>r!==m):[...autoAssignConfig.reps,m]})} className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${sel?'bg-blue-50 border-blue-200 text-blue-700':'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${sel?'bg-blue-600 border-blue-600 text-white':'border-slate-300'}`}>{sel&&<Check size={12}/>}</div>{m}
                      </div>;
                    })}
                  </div>
                </div>
              </div>
            ):(
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold">
                      <tr><th className="px-6 py-4">派发时间</th><th className="px-6 py-4">分配类型</th><th className="px-6 py-4">派发总数</th><th className="px-6 py-4">分配明细</th><th className="px-6 py-4">状态</th><th className="px-6 py-4 text-right">操作</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {assignLogs.length===0&&<tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">暂无派发记录</td></tr>}
                      {assignLogs.map(log=>(
                        <React.Fragment key={log.id}>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-medium">{log.date}</td>
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${log.type.includes('智能')?'bg-indigo-50 text-indigo-700 border-indigo-200':'bg-blue-50 text-blue-700 border-blue-200'}`}>{log.type}</span></td>
                            <td className="px-6 py-4 font-black text-slate-800">{log.total}</td>
                            <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-[200px]">{log.details}</td>
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${log.status==='成功'?'bg-emerald-50 text-emerald-700 border-emerald-100':'bg-slate-100 text-slate-500 border-slate-200'}`}>{log.status}</span></td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end items-center gap-3">
                                <button onClick={()=>setExpandedLogId(expandedLogId===log.id?null:log.id)} className="text-blue-600 text-xs font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-full">{expandedLogId===log.id?<><ChevronUp size={14}/>收起</>:<><ChevronDown size={14}/>明细</>}</button>
                                {log.status==='成功'&&<button onClick={()=>handleRevokeAssign(log.id)} className="text-orange-600 text-xs font-bold flex items-center gap-1 hover:bg-orange-50 px-2.5 py-1.5 rounded-full"><Undo2 size={14}/>撤回</button>}
                              </div>
                            </td>
                          </tr>
                          {expandedLogId===log.id&&(
                            <tr className="bg-slate-50/80">
                              <td colSpan={6} className="px-6 py-5 border-t border-slate-100">
                                <div className="text-xs text-slate-500 font-bold mb-4 flex items-center gap-2 uppercase tracking-widest"><ListChecks size={16} className="text-indigo-500"/>线索分配明细</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
                                  {(log.assignments||[]).length>0?log.assignments.map((a,i)=>(
                                    <div key={i} className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                                      <div className="flex flex-col truncate pr-3">
                                        <span className="font-bold text-slate-800 text-xs truncate">{a.company}</span>
                                        <span className="text-slate-500 text-[11px] mt-1.5 font-medium">{a.name}</span>
                                      </div>
                                      <span className="shrink-0 text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">给: {a.to}</span>
                                    </div>
                                  )):<div className="text-slate-400 text-xs py-4 col-span-3 text-center">明细数据不可用（历史录入）</div>}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Info size={14}/>提示：您可以使用模拟执行立刻测试派发效果</div>
              <div className="flex gap-3">
                <button onClick={()=>setShowAutoAssignModal(false)} className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">关闭</button>
                {activeAutoAssignTab==='config'&&<button onClick={handleSimulateAutoAssign} className="px-6 py-2.5 rounded-full text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors flex items-center gap-1.5"><PlayCircle size={16}/>立即模拟执行一次</button>}
                <button onClick={()=>{showToast('✅ 自动分配策略已成功保存');setShowAutoAssignModal(false);}} className="px-8 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">保存策略设置</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 手动分配弹窗 */}
      {showAssignModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl flex flex-col border border-slate-100">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6"><UserPlus size={28}/></div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">手动分配线索</h3>
            <p className="text-sm text-slate-500 mb-6">您即将把已选中的 <span className="text-blue-600 font-semibold">{selectedIds.length}</span> 条线索统一分配给：</p>
            <select id="assignTo" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium mb-8 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer">
              {teamMembers.map(m=><option key={m}>{m}</option>)}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setShowAssignModal(false)} className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={()=>{onAssign(selectedIds,document.getElementById('assignTo').value);setShowAssignModal(false);setSelectedIds([]);}} className="px-6 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">确认分配</button>
            </div>
          </div>
        </div>
      )}

      {/* AI分配预览弹窗 */}
      {showAIAssignModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-[700px] max-h-[85vh] flex flex-col shadow-2xl border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 shrink-0"><Sparkles size={28}/></div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">AI 智能分配预览</h3>
                <p className="text-sm text-slate-500 mt-1">系统已基于客户画像，为 <span className="text-purple-600 font-semibold">{aiAssignPreview.length}</span> 条线索推荐了最优跟进人：</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[300px] bg-slate-50 rounded-2xl p-4 space-y-4 mb-8 custom-scrollbar border border-slate-100">
              {aiAssignPreview.map(item=>(
                <div key={item.id} className="flex flex-col bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors shadow-sm gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col overflow-hidden pr-4 flex-1">
                      <span className="text-base font-semibold text-slate-800 truncate mb-1">{item.name}</span>
                      <span className="text-xs text-slate-500 truncate">{item.company}</span>
                    </div>
                    <select value={item.owner} onChange={e=>{const updated=[...aiAssignPreview];const idx=updated.findIndex(x=>x.id===item.id);updated[idx]={...updated[idx],owner:e.target.value};setAiAssignPreview(updated);}} className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-purple-400 bg-white cursor-pointer shrink-0">
                      {teamMembers.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
                    <Info size={18} className="text-purple-500 shrink-0 mt-0.5"/>
                    <p className="text-xs text-purple-800 leading-relaxed"><span className="font-semibold mr-1">智能解析：</span>{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 shrink-0">
              <button onClick={()=>setShowAIAssignModal(false)} className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消操作</button>
              <button onClick={confirmAIAssign} className="px-6 py-2.5 rounded-full text-sm font-medium bg-purple-600 text-white shadow-sm hover:bg-purple-700 transition-colors">确认智能分配</button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl border border-slate-100">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6"><AlertCircle size={28}/></div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">确认删除线索？</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">您即将删除选定的 <span className="text-red-600 font-semibold">{deleteTargetIds.length}</span> 条线索。删除后数据将无法恢复。</p>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setShowDeleteModal(false)} className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={()=>{onBatchDelete(deleteTargetIds);setShowDeleteModal(false);setSelectedIds([]);}} className="px-6 py-2.5 rounded-full text-sm font-medium bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 智能数据清洗弹窗 ---
function DataCleaningModal({ leads, setLeads, showToast, onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [activeTab, setActiveTab] = useState('dupes');
  const [results, setResults] = useState({ duplicates:[], invalids:[], needsEnhance:[] });

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(()=>{
      const grouped=leads.reduce((acc,curr)=>{const key=`${curr.company}_${curr.name}`;if(!acc[key])acc[key]=[];acc[key].push(curr);return acc;},{});
      const dupes=Object.entries(grouped).filter(([_,items])=>items.length>1).map(([key,items])=>({key,items}));
      const invalids=leads.filter(l=>{if(!l.phone)return true;const p=l.phone.replace(/-/g,'');return p.length<8||/[a-zA-Z\u4e00-\u9fa5]/.test(p);});
      const needsEnhance=leads.filter(l=>l.score===null);
      setResults({duplicates:dupes,invalids,needsEnhance});
      setIsScanning(false);setHasScanned(true);
      showToast('✅ 全库数据体检完成，已生成健康报告');
    },2000);
  };
  const handleMergeDupes=(groupKey)=>{
    const group=results.duplicates.find(g=>g.key===groupKey);if(!group)return;
    const sorted=[...group.items].sort((a,b)=>b.id-a.id);
    const idsToDelete=sorted.slice(1).map(l=>l.id);
    setLeads(prev=>prev.filter(l=>!idsToDelete.includes(l.id)));
    setResults(prev=>({...prev,duplicates:prev.duplicates.filter(g=>g.key!==groupKey)}));
    showToast(`✅ 成功合并重复线索，保留了最新记录 #${sorted[0].id}`);
  };
  const handleMarkInvalid=(id)=>{
    setLeads(prev=>prev.map(l=>l.id===id?{...l,status:'失效线索',owner:'未分配'}:l));
    setResults(prev=>({...prev,invalids:prev.invalids.filter(l=>l.id!==id)}));
    showToast('✅ 已将该线索标记为失效并退回公海');
  };
  const handleBatchEnhance=()=>{
    const ids=results.needsEnhance.map(l=>l.id);if(!ids.length)return;
    setLeads(prev=>prev.map(l=>ids.includes(l.id)?{...l,score:85+Math.floor(Math.random()*14)}:l));
    setResults(prev=>({...prev,needsEnhance:[]}));
    showToast('✅ AI 已完成全量扫描并智能补充了画像评分！');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-[1000px] max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600"><ShieldCheck size={28}/></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">智能数据清洗中心</h2>
              <p className="text-sm text-slate-500 mt-1">定期体检公海池，通过 AI 剔除冗余与失效数据</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors absolute top-6 right-6"><X size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="p-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              {!hasScanned?(
                <div className="flex flex-col items-center justify-center w-full py-10">
                  <Database size={64} className="text-slate-300 mb-6"/>
                  <button onClick={handleScan} disabled={isScanning} className="bg-indigo-600 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:bg-indigo-400">
                    {isScanning?<Loader2 size={18} className="animate-spin"/>:<Search size={18}/>}
                    {isScanning?'正在全库扫描中...':'开始全库数据体检'}
                  </button>
                </div>
              ):(
                <div className="flex gap-4 w-full justify-between items-center">
                  <div className="flex gap-4">
                    <div className="bg-rose-50 text-rose-700 px-5 py-2.5 rounded-2xl border border-rose-100 flex flex-col items-center">
                      <span className="text-2xl font-black">{results.duplicates.length+results.invalids.length}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">异常项待处理</span>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl border border-blue-100 flex flex-col items-center">
                      <span className="text-2xl font-black">{results.needsEnhance.length}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">待 AI 完善补充</span>
                    </div>
                  </div>
                  <button onClick={handleScan} disabled={isScanning} className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50">
                    {isScanning?<Loader2 size={16} className="animate-spin"/>:<RefreshCw size={16}/>}重新扫描
                  </button>
                </div>
              )}
            </div>
            {hasScanned&&(
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                  {[{k:'dupes',label:'撞单去重处理',cnt:results.duplicates.length,color:'indigo'},{k:'invalids',label:'无效联系方式',cnt:results.invalids.length,color:'rose'},{k:'enhance',label:'AI 画像补全',cnt:results.needsEnhance.length,color:'blue'}].map(t=>(
                    <button key={t.k} onClick={()=>setActiveTab(t.k)} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab===t.k?`border-${t.color}-600 text-${t.color}-700 bg-white`:'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                      {t.label} <span className={`bg-${t.color}-100 text-${t.color}-700 px-2 py-0.5 rounded-full text-[10px] ml-1`}>{t.cnt} {t.k==='dupes'?'组':'个'}</span>
                    </button>
                  ))}
                </div>
                <div className="p-6 bg-white min-h-[300px]">
                  {activeTab==='dupes'&&(results.duplicates.length===0?<EmptyState text="太棒了，线索库中没有检测到重复撞单！"/>:
                    <div className="grid gap-6">{results.duplicates.map((group,i)=>(
                      <div key={i} className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-slate-800">{group.key.replace('_',' - ')}</span>
                          <button onClick={()=>handleMergeDupes(group.key)} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-indigo-700 shadow-sm transition-colors">一键合并 (保留最新)</button>
                        </div>
                        <div className="space-y-2">{group.items.map(item=>(
                          <div key={item.id} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-slate-400 font-mono w-16">ID: {item.id}</span>
                              <span className="text-slate-600 font-medium w-32">{item.phone}</span>
                              <span className="text-slate-500 text-xs">来源: {item.source}</span>
                            </div>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-600 border border-slate-200">归属: {item.owner}</span>
                          </div>
                        ))}</div>
                      </div>
                    ))}</div>
                  )}
                  {activeTab==='invalids'&&(results.invalids.length===0?<EmptyState text="当前线索库联系方式格式良好！"/>:
                    <div className="overflow-x-auto border border-rose-100 rounded-2xl shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-bold">
                          <tr><th className="px-6 py-4">公司与联系人</th><th className="px-6 py-4">异常联络方式</th><th className="px-6 py-4">来源与录入人</th><th className="px-6 py-4 text-right">操作</th></tr>
                        </thead>
                        <tbody className="divide-y divide-rose-50">
                          {results.invalids.map(l=>(
                            <tr key={l.id} className="bg-white hover:bg-rose-50/30 transition-colors">
                              <td className="px-6 py-4"><div className="font-bold text-slate-800">{l.company}</div><div className="text-xs text-slate-500 mt-1">{l.name}</div></td>
                              <td className="px-6 py-4"><span className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg font-mono font-bold inline-flex items-center gap-2"><AlertCircle size={14}/>{l.phone||'空缺'}</span></td>
                              <td className="px-6 py-4 text-xs text-slate-600"><div>来源: {l.source}</div><div className="mt-1">归属: {l.owner}</div></td>
                              <td className="px-6 py-4 text-right"><button onClick={()=>handleMarkInvalid(l.id)} className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm">标记为失效</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab==='enhance'&&(
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-5 rounded-2xl">
                        <div>
                          <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><Wand2 size={18}/>启动大模型补全引擎</h4>
                          <p className="text-sm text-blue-700/80">共有 {results.needsEnhance.length} 条线索处于"裸数据"状态。</p>
                        </div>
                        <button onClick={handleBatchEnhance} disabled={results.needsEnhance.length===0} className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50">一键批量执行 AI 完善</button>
                      </div>
                      {results.needsEnhance.length===0?<EmptyState text="线索库质量极高，暂无需要 AI 补充的裸数据！"/>:
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.needsEnhance.map(l=>(
                            <div key={l.id} className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col justify-between opacity-70">
                              <div><div className="font-bold text-slate-800 truncate mb-1">{l.company}</div><div className="text-xs text-slate-500">{l.name} | {l.industry||'未知行业'}</div></div>
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium"><span className="w-2 h-2 rounded-full bg-slate-200"/>缺少评分与标签画像</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 线索详情视图 ---
function LeadDetailView({ lead, isEdit, setIsEdit, userRole, onBack, onSave, showToast, leads, setLeads, setSelectedLead, onReturn }) {
  const [form, setForm] = useState({...lead});
  useEffect(()=>setForm({...lead}),[lead]);
  const handleSaveEdit=()=>{
    if(!form.company) return showToast("❌ 公司全称为必填项","error");
    const final={...form};
    if(final.contacts&&final.contacts.length>0){final.name=final.contacts[0].name;final.phone=final.contacts[0].phones&&final.contacts[0].phones.length>0?final.contacts[0].phones[0]:'';}
    onSave(final);setIsEdit(false);
  };
  const canEdit=userRole==='manager'||(userRole==='sales'&&lead.isSelfAdded);
  const canReturn=userRole==='sales'&&!lead.isSelfAdded&&lead.owner!=='未分配';
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"><ChevronLeft size={20} className="mr-1"/>返回</button>
        <div className="flex gap-3">
          {canReturn&&<button onClick={()=>{onReturn(lead.id);onBack();}} className="px-5 py-2.5 bg-white border border-orange-200 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-50 flex items-center gap-2 transition-colors shadow-sm"><Undo2 size={16}/>退回公海池</button>}
          {canEdit&&(!isEdit?(
            <button onClick={()=>setIsEdit(true)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors text-slate-700 shadow-sm"><Edit size={16} className="text-blue-600"/>编辑线索信息</button>
          ):(
            <><button onClick={()=>setIsEdit(false)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">取消编辑</button><button onClick={handleSaveEdit} className="px-8 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">保存更改</button></>
          ))}
        </div>
      </div>
      <div className="mb-6 flex items-center gap-3 flex-wrap text-sm text-slate-500">
        <span className="font-mono text-slate-600 bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-lg text-xs">ID: #{lead.id}</span>
        <span className="flex items-center text-slate-600"><LinkIcon size={16} className="mr-1.5 text-slate-400"/>来源：{lead.source}</span>
        {lead.daysUncontacted>0&&<span className={`px-3 py-1 border rounded-lg text-xs font-medium ${lead.daysUncontacted>=3?'bg-red-50 text-red-700 border-red-100':'bg-slate-100 text-slate-600 border-slate-200'}`}>{lead.daysUncontacted} 天未跟进</span>}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start pb-20">
        <div className="xl:col-span-7 space-y-6">
          {isEdit?(
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100"><h3 className="font-bold text-lg text-slate-800">编辑公司信息</h3></div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">公司全称 <span className="text-red-500">*</span></label><CompanyAutocomplete value={form.company} onChange={v=>setForm({...form,company:v})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"/></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">所属行业</label><input type="text" value={form.industry||''} onChange={e=>setForm({...form,industry:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 transition-colors"/></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">线索来源</label><select value={form.source} onChange={e=>setForm({...form,source:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 transition-colors"><option>名片</option><option>老客户转介绍</option><option>网络搜索</option><option>批量导入</option></select></div>
                  <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">线索状态</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 transition-colors">{Object.keys(statusColors).map(s=><option key={s}>{s}</option>)}</select></div>
                  <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">公司补充备注</label><textarea value={form.companyNote||''} onChange={e=>setForm({...form,companyNote:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors h-24 resize-none"/></div>
                </div>
              </div>
            </div>
          ):(
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="p-8 pb-6 bg-white border-b border-slate-100">
                <div className="flex justify-between items-start gap-5">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl font-bold text-slate-900">{lead?.company}</h2>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg font-medium border border-emerald-100">存续</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"><Building2 size={14} className="mr-1.5 text-blue-500"/>{lead?.industry||'未知行业'}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100 shadow-sm">
                    <div className="flex items-center text-[11px] text-orange-700 font-semibold mb-1"><Sparkles size={14} className="mr-1"/>AI 推荐评分</div>
                    {lead?.score?<><span className="text-4xl font-bold text-orange-600">{lead.score}</span><span className="text-sm font-semibold text-orange-400 ml-1">/100</span></>:<span className="text-sm font-bold text-orange-400 py-2">待 AI 完善</span>}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-[#f8faff] p-6 rounded-3xl border border-blue-100 relative overflow-hidden">
                  <div className="flex items-center text-blue-800 font-semibold mb-3 text-sm"><Sparkles size={20} className="mr-2"/>AI 业务需求分析</div>
                  <div className="text-sm text-slate-700 leading-relaxed">基于该公司近期招聘了大量"大客户销售"，判断其正处于<span className="font-semibold text-blue-800 bg-blue-100/50 px-1.5 py-0.5 rounded-md mx-1">销售团队扩张期</span>。极大概率需要采购CRM系统。</div>
                </div>
                {lead?.companyNote&&<div className="border-t border-slate-100 pt-6 mt-6"><div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100"><div className="text-xs font-semibold text-amber-800 mb-2 flex items-center"><FileText size={16} className="mr-1.5"/>公司补充备注</div><div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{lead.companyNote}</div></div></div>}
              </div>
            </div>
          )}
        </div>
        <div className="xl:col-span-5">
          <LeadContactsSection contacts={isEdit?form.contacts||[]:lead.contacts||[]} onUpdateContacts={newContacts=>{if(isEdit)setForm({...form,contacts:newContacts});else{const updated=leads.map(l=>l.id===lead.id?{...l,contacts:newContacts}:l);setLeads(updated);setSelectedLead(updated.find(x=>x.id===lead.id));}}} isEdit={isEdit} showToast={showToast}/>
        </div>
      </div>
    </div>
  );
}

// --- 线索模块联系人区域 ---
const LeadContactsSection = ({ contacts, onUpdateContacts, isEdit, showToast }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({name:'',position:'',companyName:'',phones:'',wechat:'',email:'',note:''});
  const handleCopy=(text,type)=>{try{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);showToast(`✅ ${type} 已复制`);}catch{showToast(`❌ 复制失败`,'error');}};
  const handleSave=()=>{
    if(!formData.name.trim()) return showToast('❌ 姓名不能为空','error');
    const nc={id:Date.now(),name:formData.name,position:formData.position||"暂无职位",companyName:formData.companyName||"",phones:formData.phones?formData.phones.split(/[,，、\/]/).map(p=>p.trim()).filter(Boolean):[],wechat:formData.wechat||"暂无",email:formData.email||"暂无",social:"暂无",tags:["手工录入"],tagColor:"bg-slate-100 text-slate-600 border-slate-200",pitch:"新录入联系人，暂无AI分析话术。",aiAdvice:"建议尽快跟进。",note:formData.note};
    onUpdateContacts([nc,...(contacts||[])]);setShowAddModal(false);setFormData({name:'',position:'',companyName:'',phones:'',wechat:'',email:'',note:''});showToast('✅ 联系人新增成功');
  };
  if(isEdit){
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6 p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-100 pb-4"><Users size={20} className="mr-2 text-blue-600"/>编辑联系人名片</h3>
        {(contacts||[]).map(c=>(
          <div key={c.id} className="p-6 border border-slate-200 rounded-2xl relative bg-slate-50/50">
            <button onClick={()=>onUpdateContacts(contacts.filter(x=>x.id!==c.id))} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors"><Trash2 size={16}/></button>
            <div className="grid grid-cols-2 gap-5 pr-8">
              {[{label:'姓名 *',field:'name',val:c.name},{label:'职位',field:'position',val:c.position}].map(f=>(
                <div key={f.field}><label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label><input value={f.val} onChange={e=>onUpdateContacts(contacts.map(x=>x.id===c.id?{...x,[f.field]:e.target.value}:x))} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500"/></div>
              ))}
              <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-1.5">电话 (逗号分隔)</label><input value={(c.phones||[]).join(', ')} onChange={e=>onUpdateContacts(contacts.map(x=>x.id===c.id?{...x,phones:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}:x))} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500"/></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">微信号</label><input value={c.wechat==='暂无'?'':c.wechat} onChange={e=>onUpdateContacts(contacts.map(x=>x.id===c.id?{...x,wechat:e.target.value||'暂无'}:x))} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500"/></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">电子邮箱</label><input value={c.email==='暂无'?'':c.email} onChange={e=>onUpdateContacts(contacts.map(x=>x.id===c.id?{...x,email:e.target.value||'暂无'}:x))} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500"/></div>
              <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-1.5">个人专属备注</label><textarea value={c.note||''} onChange={e=>onUpdateContacts(contacts.map(x=>x.id===c.id?{...x,note:e.target.value}:x))} rows="3" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 resize-none"/></div>
            </div>
          </div>
        ))}
        <button onClick={()=>onUpdateContacts([...(contacts||[]),{id:Date.now(),name:'',position:'',companyName:'',phones:[],wechat:'暂无',email:'暂无',social:'暂无',tags:["手工录入"],tagColor:"bg-slate-100 text-slate-600 border-slate-200",pitch:"手工补充联系人。",aiAdvice:"建议尽快跟进。",note:''}])} className="w-full py-4 border border-dashed border-blue-300 text-blue-600 font-medium text-sm rounded-2xl hover:bg-blue-50 transition-colors flex justify-center items-center gap-2"><Plus size={18}/>增加名片条目</button>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="border-b border-slate-100 p-6 bg-white flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center"><Users size={20} className="mr-2 text-blue-600"/>联系人图谱 ({(contacts||[]).length})</h2>
        <button onClick={()=>setShowAddModal(true)} className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"><UserPlus size={16} className="mr-1.5"/>手工补充联系人</button>
      </div>
      <div className="divide-y divide-slate-100">
        {(contacts||[]).length===0&&<div className="p-10 text-center text-slate-400 text-sm">暂无联系人名片数据</div>}
        {(contacts||[]).map(c=>(
          <div key={c.id} className="p-8 hover:bg-slate-50/50 transition-colors">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">{c.name||'未知联系人'}</h3>
                <span className="text-sm font-medium text-slate-500 border-l border-slate-300 pl-3">{c.position}</span>
                {c.tags.map(t=><span key={t} className={`px-2.5 py-1 text-xs font-medium rounded-md border ${c.tagColor}`}>{t}</span>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.phones&&c.phones.map(phone=>(
                  <div key={phone} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3.5 rounded-2xl group hover:border-slate-300 transition-colors">
                    <div className="flex items-center text-sm font-medium text-slate-800"><Phone size={16} className="mr-3 text-slate-400"/>{phone}</div>
                    <button onClick={()=>handleCopy(phone,'电话')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Copy size={16}/></button>
                  </div>
                ))}
                {c.wechat&&c.wechat!=="暂无"&&<div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3.5 rounded-2xl group hover:border-slate-300 transition-colors"><div className="flex items-center text-sm font-medium text-slate-800"><MessageCircle size={16} className="mr-3 text-emerald-500"/>{c.wechat}</div><button onClick={()=>handleCopy(c.wechat,'微信')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Copy size={16}/></button></div>}
                {c.email&&c.email!=="暂无"&&<div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3.5 rounded-2xl group hover:border-slate-300 transition-colors col-span-1 sm:col-span-2"><div className="flex items-center text-sm font-medium text-slate-800"><Mail size={16} className="mr-3 text-blue-500"/>{c.email}</div><button onClick={()=>handleCopy(c.email,'邮箱')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Copy size={16}/></button></div>}
              </div>
              {c.note&&<div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50"><div className="text-xs font-semibold text-amber-800 mb-2 flex items-center"><FileText size={16} className="mr-1.5"/>个人专属备注</div><div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.note}</div></div>}
              {c.pitch&&<div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100"><div className="text-xs font-bold text-blue-800 mb-2 flex items-center"><Sparkles size={12} className="mr-1"/>AI 推荐话术钩子</div><div className="text-sm text-slate-700 bg-white p-3 rounded border border-blue-50 italic mb-3">"{c.pitch}"</div>{c.aiAdvice&&<><div className="text-xs font-bold text-blue-800 mb-1">AI 跟进建议</div><div className="text-sm text-slate-600">{c.aiAdvice}</div></>}</div>}
            </div>
          </div>
        ))}
      </div>
      {showAddModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 flex justify-between items-center z-10">
              <h3 className="font-bold text-slate-800 flex items-center text-lg"><UserPlus size={20} className="mr-2 text-blue-600"/>手工录入联系人名片</h3>
              <button onClick={()=>setShowAddModal(false)} className="bg-slate-50 p-2 rounded-full text-slate-500 hover:bg-slate-100"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-2 gap-6">
                {[{label:'姓名',field:'name'},{label:'职位/头衔',field:'position'},{label:'电话 (逗号分隔)',field:'phones'},{label:'微信',field:'wechat'},{label:'电子邮箱',field:'email'}].map(f=>(
                  <div key={f.field}><label className="block text-xs font-semibold text-slate-600 mb-2">{f.label}</label><input type="text" value={formData[f.field]} onChange={e=>setFormData({...formData,[f.field]:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500"/></div>
                ))}
                <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-2">个人专属备注</label><textarea rows="4" value={formData.note} onChange={e=>setFormData({...formData,note:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 resize-none"/></div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
              <button onClick={()=>setShowAddModal(false)} className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">保存入库</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 录入新线索 ---
function LeadAddView({ onCancel, onSave, showToast }) {
  const [f, setF] = useState({name:'',source:'',position:'',companyName:'',companyEmail:'',phone:'',email:'',wechat:'',xiaohongshu:'',douyin:'',contactNote:'',companyNote:'',industry:''});
  const sources=['名片录入','批量导入','小红书','抖音','展会画册','网络搜索','信息流广告'];
  const handleSubmit=()=>{
    if(!f.source.trim()) return showToast('❌ 线索来源为必填项','error');
    if(!f.name.trim()&&!f.companyName.trim()) return showToast('❌ 请至少填写联系人姓名或公司名称','error');
    if(!f.phone.trim()&&!f.email.trim()&&!f.companyEmail.trim()&&!f.wechat.trim()&&!f.xiaohongshu.trim()&&!f.douyin.trim()) return showToast('❌ 请至少填写一种联系方式','error');
    const social=[f.xiaohongshu&&`小红书:${f.xiaohongshu}`,f.douyin&&`抖音:${f.douyin}`].filter(Boolean).join(' | ');
    onSave({name:f.name||'未知联系人',source:f.source,position:f.position,companyName:f.companyName||'未知公司',phone:f.phone,email:f.email||f.companyEmail,wechat:f.wechat,social:social||'暂无',contactNote:f.contactNote,companyNote:f.companyNote,industry:f.industry});
  };
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 pb-20">
      <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6"><ChevronLeft size={18} className="mr-1"/>返回线索列表</button>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50"><h2 className="text-2xl font-bold text-slate-800">录入新线索</h2><p className="text-sm text-slate-500 mt-2">手动创建市场线索。姓名与公司名至少填一项，联系方式至少填一项。</p></div>
        <div className="p-10">
          <section className="mb-10 bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-bold text-slate-800 mb-2">线索来源渠道 <span className="text-rose-500">*</span></label>
              <select value={f.source} onChange={e=>setF({...f,source:e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 cursor-pointer shadow-sm">
                <option value="" disabled>请选择获取该线索的来源...</option>
                {sources.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100"><Building2 size={18} className="text-blue-600"/>公司与业务信息</h3>
              <div className="space-y-5">
                <div><label className="block text-xs font-bold text-slate-700 mb-2">公司全称</label><CompanyAutocomplete value={f.companyName} onChange={v=>setF({...f,companyName:v})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"/></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-2">所属行业</label><input type="text" value={f.industry} onChange={e=>setF({...f,industry:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="如: 互联网/制造"/></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-2">公司统一邮箱</label><input type="text" value={f.companyEmail} onChange={e=>setF({...f,companyEmail:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="如: contact@company.com"/></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-2">公司全局备注</label><textarea value={f.companyNote} onChange={e=>setF({...f,companyNote:e.target.value})} rows="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none" placeholder="记录该公司的预算、业务痛点、采购周期等背景信息..."/></div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100"><User size={18} className="text-emerald-600"/>个人联系人明细</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">联系人姓名</label><input type="text" value={f.name} onChange={e=>setF({...f,name:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="如: 王建国"/></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">职位/头衔</label><input type="text" value={f.position} onChange={e=>setF({...f,position:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="如: 采购总监"/></div>
                </div>
                <div className="grid grid-cols-2 gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">手机号</label><input type="text" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="常用联系手机"/></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">微信号</label><input type="text" value={f.wechat} onChange={e=>setF({...f,wechat:e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="微信号码"/></div>
                  <div className="col-span-2"><label className="block text-xs font-bold text-slate-700 mb-2">个人邮箱</label><input type="text" value={f.email} onChange={e=>setF({...f,email:e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="如: personal@gmail.com"/></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">小红书 ID</label><input type="text" value={f.xiaohongshu} onChange={e=>setF({...f,xiaohongshu:e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="小红书号"/></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-2">抖音 ID</label><input type="text" value={f.douyin} onChange={e=>setF({...f,douyin:e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="抖音号"/></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-700 mb-2">联系人专属备注</label><textarea value={f.contactNote} onChange={e=>setF({...f,contactNote:e.target.value})} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all resize-none" placeholder="记录该联系人的沟通偏好、性格特征等..."/></div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-10 py-6 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
          <button onClick={onCancel} className="px-8 py-3 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">取消录入</button>
          <button onClick={handleSubmit} className="px-10 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2"><Check size={18}/>保存并入库</button>
        </div>
      </div>
    </div>
  );
}

// --- 批量导入（简化版） ---
function LeadImportView({ onCancel, onConfirm }) {
  const [isDragging, setIsDragging] = useState(false);
  const mockData=[{name:'测试客户A',company:'测试公司A',phone:'138-0000-0001',email:'a@test.com'},{name:'测试客户B',company:'测试公司B',phone:'138-0000-0002',email:'b@test.com'}];
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6"><ChevronLeft size={18} className="mr-1"/>返回线索列表</button>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50"><h2 className="text-2xl font-bold text-slate-800">批量导入线索</h2><p className="text-sm text-slate-500 mt-2">上传 CSV/Excel 文件批量创建线索（演示模式下使用模拟数据）。</p></div>
        <div className="p-10">
          <div onDragOver={e=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} onDrop={e=>{e.preventDefault();setIsDragging(false);}} className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center transition-colors ${isDragging?'border-blue-500 bg-blue-50':'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}>
            <UploadCloud size={48} className="text-slate-400 mb-4"/>
            <p className="font-medium text-slate-700 mb-2">拖拽文件到此区域，或点击选择文件</p>
            <p className="text-xs text-slate-400">支持 .csv / .xlsx 格式</p>
          </div>
          <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">演示模式：将导入 {mockData.length} 条模拟数据</p>
            <div className="space-y-2">{mockData.map((d,i)=><div key={i} className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">{d.company} - {d.name} ({d.phone})</div>)}</div>
          </div>
        </div>
        <div className="px-10 py-6 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
          <button onClick={onCancel} className="px-8 py-3 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">取消</button>
          <button onClick={()=>onConfirm(mockData)} className="px-10 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2"><Check size={18}/>确认导入</button>
        </div>
      </div>
    </div>
  );
}

// --- 批量名片OCR（简化版） ---
function LeadBatchOcrView({ onCancel, onSaveBatch, showToast }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const mockOcrData=[{name:'展会联系人A',company:'北京某科技有限公司',position:'销售总监',phone:'138-8888-0001',email:'a@tech.com',industry:'人工智能'},{name:'展会联系人B',company:'上海某互联网公司',position:'CTO',phone:'139-7777-0002',email:'b@internet.com',industry:'企业服务'}];
  const handleSimulate=()=>{
    setIsProcessing(true);
    setTimeout(()=>{setResults(mockOcrData);setIsProcessing(false);showToast('✅ 名片识别完成');},1800);
  };
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors mb-6"><ChevronLeft size={18} className="mr-1"/>返回线索列表</button>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><ScanLine size={24}/></div>
          <div><h2 className="text-2xl font-bold text-slate-800">批量名片 AI 识别</h2><p className="text-sm text-slate-500 mt-1">上传展会名片图片，AI自动识别并批量创建线索（演示模式）。</p></div>
        </div>
        <div className="p-10 space-y-8">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
            <UploadCloud size={48} className="text-slate-400 mb-4"/>
            <p className="font-medium text-slate-700">拖拽名片图片到此区域</p>
            <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG、PDF</p>
          </div>
          {results.length===0&&<div className="flex justify-center"><button onClick={handleSimulate} disabled={isProcessing} className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-blue-400">{isProcessing?<Loader2 size={18} className="animate-spin"/>:<Sparkles size={18}/>}{isProcessing?'AI 识别中...':'模拟演示识别'}</button></div>}
          {results.length>0&&(
            <div>
              <h3 className="font-bold text-slate-800 mb-4">AI 识别结果 ({results.length} 张)</h3>
              <div className="space-y-3 mb-8">{results.map((r,i)=>(
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shrink-0">{r.name[0]}</div>
                  <div className="flex-1"><div className="font-bold text-slate-800">{r.name} <span className="font-normal text-slate-500 text-sm">- {r.position}</span></div><div className="text-sm text-slate-600 mt-1">{r.company} · {r.phone}</div></div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-medium">识别成功</span>
                </div>
              ))}</div>
              <div className="flex justify-end gap-4">
                <button onClick={()=>setResults([])} className="px-8 py-3 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">重新识别</button>
                <button onClick={()=>onSaveBatch(results)} className="px-10 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2"><Check size={18}/>确认批量入库</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 6: AI推客模块
// ============================================================

function PitchModule({ showToast }) {
  const [leads, setLeads] = useState(pitchLeads);
  const [currentLeadId, setCurrentLeadId] = useState(pitchLeads[0].id);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const currentLead = leads.find(l=>l.id===currentLeadId);

  const handleSaveDraft = (id) => setLeads(leads.map(l=>l.id===id?{...l,status:'draft'}:l));
  const handleAddHistoryRecord = (leadId, record) => setLeads(leads.map(l=>l.id===leadId?{...l,history:[record,...(l.history||[])]}:l));
  const handleAddCompanyNote = (leadId, text, dateStr) => setLeads(leads.map(l=>l.id===leadId?{...l,companyNotes:[...(l.companyNotes||[]),{id:Date.now(),text,date:dateStr}]}:l));

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <PitchDirectoryDrawer isOpen={isDirectoryOpen} onClose={()=>setIsDirectoryOpen(false)} leads={leads} currentLeadId={currentLeadId} onSelectLead={id=>{setCurrentLeadId(id);setIsDirectoryOpen(false);}}/>
      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto px-6 pt-6">
          <div className="animate-in fade-in duration-500" key={currentLeadId}>
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-slate-500 text-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-slate-700 font-medium">线索 ID: #{currentLeadId}</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center text-slate-600 font-medium"><LinkIcon size={14} className="mr-1.5 text-slate-400"/>线索来源：{currentLead?.source||'全网企业公开库抓取'}</span>
                {currentLead?.status==='draft'&&<span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-bold border border-orange-200 ml-2">草稿暂存中</span>}
                {currentLead?.daysUncontacted>0&&<span className={`px-2 py-0.5 rounded text-xs font-bold border ml-2 ${currentLead.daysUncontacted>=3?'bg-red-100 text-red-600 border-red-200':'bg-slate-200 text-slate-600 border-slate-300'}`}>{currentLead.daysUncontacted} 天未跟进</span>}
              </div>
              <span className="flex items-center text-slate-400"><RefreshCw size={12} className="mr-1"/>抓取更新: 10分钟前</span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-7">
                <PitchCompanyInfoSection lead={currentLead} showToast={showToast} onAddCompanyNote={handleAddCompanyNote} onAddHistoryRecord={record=>handleAddHistoryRecord(currentLeadId,record)}/>
                <PitchHistorySection history={currentLead?.history}/>
              </div>
              <div className="xl:col-span-5">
                <PitchContactsSection showToast={showToast} onAddHistoryRecord={record=>handleAddHistoryRecord(currentLeadId,record)}/>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PitchActionSection lead={currentLead} showToast={showToast} onSaveDraft={handleSaveDraft} onOpenDirectory={()=>setIsDirectoryOpen(true)}/>
    </div>
  );
}

// AI推客 - 线索目录抽屉
const PitchDirectoryDrawer = ({ isOpen, onClose, leads, currentLeadId, onSelectLead }) => {
  const draftLeads=leads.filter(l=>l.status==='draft');
  const completedLeads=leads.filter(l=>l.status==='completed');
  const pendingLeads=leads.filter(l=>l.status==='pending');
  const LeadItem=({lead})=>{
    const isActive=lead.id===currentLeadId;
    let StatusIcon=CircleDashed;let statusColor="text-slate-400";
    if(lead.status==='completed'){StatusIcon=CheckCircle;statusColor="text-green-500";}
    else if(lead.status==='draft'){StatusIcon=Clock;statusColor="text-orange-500";}
    else if(lead.daysUncontacted>=3){statusColor="text-red-500";}
    return (
      <div onClick={()=>{onSelectLead(lead.id);onClose();}} className={`p-3 rounded-xl cursor-pointer transition-all border mb-2 ${isActive?'bg-blue-50 border-blue-200 shadow-sm':'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'}`}>
        <div className="flex items-start gap-2.5">
          <StatusIcon size={16} className={`mt-0.5 flex-shrink-0 ${isActive?'text-blue-600':statusColor}`}/>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-bold truncate pr-2 ${isActive?'text-blue-800':'text-slate-700'}`}>{lead.name}</div>
            <div className="text-xs mt-1.5 flex justify-between items-center">
              <span className={`font-medium truncate mr-2 ${lead.status==='draft'?'text-orange-500':lead.daysUncontacted>=3?'text-red-500':'text-slate-400'}`}>
                {lead.status==='completed'?'今日已跟进':lead.status==='draft'?'草稿待提交':`${lead.daysUncontacted} 天未跟进`}
              </span>
              <span className="flex items-center flex-shrink-0 text-orange-500"><Sparkles size={10} className="mr-0.5"/>{lead.score}分</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Group=({title,icon:Icon,colorClass,data})=>{
    if(!data.length) return null;
    return (
      <div className="mb-6">
        <div className={`text-xs font-bold mb-3 flex items-center ${colorClass}`}><Icon size={14} className="mr-1.5"/>{title} ({data.length})</div>
        {data.map(l=><LeadItem key={l.id} lead={l}/>)}
      </div>
    );
  };
  return (
    <>
      {isOpen&&<div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] animate-in fade-in duration-200" onClick={onClose}/>}
      <div className={`fixed top-0 right-0 h-full w-[360px] bg-slate-50 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen?'translate-x-0':'translate-x-full'}`}>
        <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800 flex items-center"><ListTodo size={18} className="mr-2 text-blue-600"/>今日任务线索池</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Group title="跟进暂存" icon={Clock} colorClass="text-orange-600" data={draftLeads}/>
          <Group title="今日已处理" icon={CheckCircle} colorClass="text-green-600" data={completedLeads}/>
          <Group title="待跟进" icon={Users} colorClass="text-slate-600" data={pendingLeads}/>
        </div>
      </div>
    </>
  );
};

// AI推客 - 公司信息区域
const PitchCompanyInfoSection = ({ lead, showToast, onAddCompanyNote, onAddHistoryRecord }) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const getDate=()=>{const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')} ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;};
  const handleSaveNote=()=>{
    if(!noteText.trim()){showToast('❌ 备注内容不能为空');return;}
    const d=getDate();
    onAddCompanyNote(lead.id,noteText.trim(),d);
    onAddHistoryRecord({id:Date.now(),date:d,sales:'您自己',type:'公司信息备注追加',contact:'--',note:noteText.trim(),tag:'信息补充'});
    setShowNoteModal(false);setNoteText('');setIsNotesExpanded(true);
    showToast('✅ 公司备注追加成功并已同步至跟进记录');
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {showNoteModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90vw] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center"><FileText size={16} className="mr-2 text-orange-500"/>追加公司信息备注</h3>
              <button onClick={()=>{setShowNoteModal(false);setNoteText('');}} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <div className="p-5">
              <div className="mb-2 text-xs text-slate-500">正在为 <span className="font-bold text-slate-800">{lead?.name}</span> 追加备注。</div>
              <textarea rows="4" value={noteText} onChange={e=>setNoteText(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-orange-500 resize-none" placeholder="请输入关于该公司的最新跟进备注..." autoFocus/>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={()=>{setShowNoteModal(false);setNoteText('');}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNote} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all">保存备注</button>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-slate-100 p-6 bg-slate-50/50">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{lead?.name||'加载中...'}</h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-md font-semibold border border-emerald-200">存续</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="flex items-center bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm"><Building2 size={14} className="mr-1.5 text-slate-400"/>人工智能 / 软件开发</span>
              <span className="flex items-center bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm text-xs">成立: 2019-06-11</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-rose-50 px-5 py-3 rounded-xl border border-orange-100 shadow-sm">
            <div className="flex items-center text-xs text-orange-600 font-bold mb-1"><Sparkles size={12} className="mr-1"/>AI 推荐评分</div>
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">{lead?.score||90}</span>
              <span className="text-xs font-semibold text-orange-400 ml-0.5">/100</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 relative overflow-hidden">
            <div className="flex items-center text-indigo-700 font-semibold mb-3"><Sparkles size={18} className="mr-2"/>AI 业务需求深度分析</div>
            <p className="text-sm text-slate-700 leading-relaxed">基于该公司近期招聘了大量"大客户销售"和"CRM实施工程师"，判断其正处于<span className="font-bold text-indigo-900 bg-indigo-100/50 px-1 rounded">销售团队快速扩张期</span>。极大概率需要采购企业级SaaS CRM系统。客户对数据安全、API对接能力要求极高。</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center text-indigo-700 font-semibold mb-3"><Sparkles size={18} className="mr-2"/>推荐跟进理由</div>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              <li>近期获得新一轮战略融资，预算充足。</li>
              <li>历史使用过基础版CRM，但随着团队突破300人，存在系统升级的痛点。</li>
              <li>属于我们的"S级高价值行业（AI/企服）"目标画像。</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-6">
          {lead?.companyNotes&&lead.companyNotes.length>0?(
            <div className="bg-amber-50/40 rounded-xl border border-amber-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors" onClick={()=>setIsNotesExpanded(!isNotesExpanded)}>
                <div className="text-sm font-bold text-amber-700 flex items-center"><FileText size={16} className="mr-1.5"/>公司信息备注 ({lead.companyNotes.length}条)</div>
                <button className="text-amber-500">{isNotesExpanded?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button>
              </div>
              {isNotesExpanded&&(
                <div className="px-4 pb-4 space-y-3 border-t border-amber-100/50 pt-3">
                  <div className="flex justify-end"><button onClick={e=>{e.stopPropagation();setShowNoteModal(true);}} className="text-amber-600 hover:text-amber-800 font-medium bg-amber-100/50 px-2.5 py-1.5 rounded-lg text-xs">+ 追加备注</button></div>
                  {lead.companyNotes.map(note=>(
                    <div key={note.id} className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-amber-50 shadow-sm">
                      <div className="text-[10px] text-slate-400 mb-1.5 font-mono">{note.date}</div>
                      <div className="leading-relaxed whitespace-pre-wrap">{note.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ):(
            <button onClick={()=>setShowNoteModal(true)} className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center border border-dashed border-blue-200 hover:bg-blue-50 w-full justify-center py-3 rounded-xl transition-colors">+ 添加公司信息备注</button>
          )}
        </div>
      </div>
    </div>
  );
};

// AI推客 - 历史跟进时间轴
const PitchHistorySection = ({ history }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  if(!history||!history.length) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={()=>setIsExpanded(!isExpanded)}>
        <div className="flex items-center"><History size={20} className="mr-2 text-blue-600"/><h2 className="text-lg font-bold text-slate-800">历史跟进记录 ({history.length})</h2></div>
        <button className="text-slate-400">{isExpanded?<ChevronUp size={20}/>:<ChevronDown size={20}/>}</button>
      </div>
      {isExpanded&&(
        <div className="p-6">
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {history.map(record=>(
              <div key={record.id} className="relative pl-6 group">
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 transition-colors ${record.type==='线索无效'?'bg-red-400 ring-red-50':record.type==='退回客户'?'bg-orange-400 ring-orange-50':'bg-slate-200 ring-slate-50 group-hover:bg-blue-400 group-hover:ring-blue-50'}`}/>
                <div className={`rounded-xl p-4 border transition-colors ${record.type==='线索无效'?'bg-red-50/50 border-red-100':record.type==='退回客户'?'bg-orange-50/50 border-orange-100':'bg-slate-50 border-slate-100 hover:border-blue-100'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800 flex items-center"><Users size={14} className="mr-1 text-slate-400"/>{record.sales}</span>
                      <span className={`text-xs px-2 py-1 rounded-md border shadow-sm font-medium ${record.type==='线索无效'?'text-red-700 bg-red-100 border-red-200':record.type==='退回客户'?'text-orange-700 bg-orange-100 border-orange-200':'text-slate-600 bg-white border-slate-200'}`}>操作: {record.type}</span>
                      {record.contact&&record.contact!=='--'&&<span className="text-xs text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">联系人: {record.contact}</span>}
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center"><Clock size={12} className="mr-1"/>{record.date}</span>
                  </div>
                  <div className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm"><div className="leading-relaxed whitespace-pre-wrap">{record.note}</div></div>
                  {record.tag&&<div className="mt-3"><span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${record.type==='线索无效'?'bg-red-50 text-red-600 border-red-100':record.type==='退回客户'?'bg-orange-50 text-orange-600 border-orange-100':'bg-blue-50 text-blue-600 border-blue-100'}`}>标记: {record.tag}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// AI推客 - 联系人区域
const PitchContactsSection = ({ showToast, onAddHistoryRecord }) => {
  const initContacts=[
    {id:1,name:"张一鸣",position:"销售副总裁 (VP of Sales)",tags:["推荐触达","决策者"],tagColor:"bg-green-100 text-green-700 border-green-200",phones:["138-xxxx-8888","010-8888xxxx"],wechat:"zhang_sales_vp",email:"zym@company.com",social:"抖音: 商业张sir (1.2w粉)",pitch:"张总您好，关注到贵司近期在快速扩充销售团队。我们提供的新一代CRM能直接对接大模型，帮您的团队提升30%的人效，不知您本周四下午是否有空交流10分钟？",aiAdvice:"建议通过微信添加，对方在朋友圈较为活跃，喜欢分享行业报告。切入点可以是探讨AI企业服务商业化路径。",notes:[{id:101,text:"之前沟通感觉对价格比较敏感，需要多强调我们的投入产出比(ROI)。",date:"2024-03-25 10:30"}]},
    {id:2,name:"林晓",position:"IT总监 / CIO",tags:["难触达","技术评估者"],tagColor:"bg-orange-100 text-orange-700 border-orange-200",phones:["139-xxxx-9999"],wechat:"linxiao_it",email:"linx@company.com",social:"小红书: IT圈的小林",pitch:"林总您好，我们CRM的OpenAPI非常完善，且支持私有化部署和数据加密，能够完美适配贵司自研的大模型底层。想给您发送一份API文档和安全白皮书参考。",aiAdvice:"电话接通率极低（历史数据<10%），建议直接发专业邮件附带白皮书，或通过脉脉申请技术交流。",notes:[]},
  ];
  const [contacts, setContacts] = useState(initContacts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({name:'',position:'',phones:'',wechat:'',email:'',social:'',note:''});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeNoteContactId, setActiveNoteContactId] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [expandedNoteIds, setExpandedNoteIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy=(text,type)=>{try{const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);setCopiedId(text);showToast(`✅ ${type} 已复制`);setTimeout(()=>setCopiedId(null),2000);}catch{showToast(`❌ 复制失败`);}};
  const getDate=()=>{const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')} ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;};

  const handleSaveNewContact=()=>{
    if(!formData.name.trim()){showToast('❌ 姓名不能为空');return;}
    const d=getDate();const nid=Date.now();
    const notes=formData.note.trim()?[{id:nid,text:formData.note.trim(),date:d}]:[];
    const nc={id:nid,name:formData.name,position:formData.position||"暂无职位信息",tags:["销售手动添加"],tagColor:"bg-blue-50 text-blue-600 border-blue-200",phones:formData.phones?formData.phones.split(/[,，、\/]/).map(p=>p.trim()).filter(Boolean):[],wechat:formData.wechat||"暂无",email:formData.email||"暂无",social:formData.social||"暂无",pitch:"手工补充联系人，当前暂无 AI 推荐破冰话术。",aiAdvice:"系统建议：尽快尝试通过现有联系方式建立初步破冰沟通，补全客户画像。",notes};
    setContacts([nc,...contacts]);
    if(notes.length>0){setExpandedNoteIds([...expandedNoteIds,nid]);onAddHistoryRecord({id:Date.now(),date:d,sales:'您自己',type:'新增联系人及备注',contact:formData.name,note:formData.note.trim(),tag:'信息补充'});}
    setShowAddModal(false);setFormData({name:'',position:'',phones:'',wechat:'',email:'',social:'',note:''});showToast('✅ 联系人及备注添加成功');
  };

  const handleSaveNote=()=>{
    if(!newNoteText.trim()){showToast('❌ 备注内容不能为空');return;}
    const d=getDate();const note={id:Date.now(),text:newNoteText.trim(),date:d};
    let cname='';
    setContacts(contacts.map(c=>{if(c.id===activeNoteContactId){cname=c.name;return{...c,notes:[...(c.notes||[]),note]};}return c;}));
    onAddHistoryRecord({id:Date.now(),date:d,sales:'您自己',type:'联系人备注追加',contact:cname,note:newNoteText.trim(),tag:'信息补充'});
    setShowNoteModal(false);setNewNoteText('');
    setExpandedNoteIds(prev=>prev.includes(activeNoteContactId)?prev:[...prev,activeNoteContactId]);
    setActiveNoteContactId(null);showToast('✅ 备注追加成功并已同步至跟进记录');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {showAddModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[90vw] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center"><UserPlus size={18} className="mr-2 text-blue-600"/>新增联系人</h3>
              <button onClick={()=>setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {[{l:'姓名 *',f:'name'},{l:'职位/角色',f:'position'},{l:'手机号码',f:'phones'},{l:'微信号',f:'wechat'},{l:'电子邮箱',f:'email'},{l:'社交平台',f:'social'}].map(x=>(
                  <div key={x.f}><label className="block text-xs font-bold text-slate-700 mb-1.5">{x.l}</label><input type="text" value={formData[x.f]} onChange={e=>setFormData({...formData,[x.f]:e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"/></div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-700 flex items-center mb-2"><FileText size={14} className="mr-1.5 text-orange-500"/>联系人信息备注</label>
                <textarea rows="3" value={formData.note} onChange={e=>setFormData({...formData,note:e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-none" placeholder="针对该联系人的特别备注说明（选填）..."/>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={()=>setShowAddModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNewContact} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all">保存联系人</button>
            </div>
          </div>
        </div>
      )}
      {showNoteModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90vw] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center"><FileText size={16} className="mr-2 text-orange-500"/>追加联系人备注</h3>
              <button onClick={()=>{setShowNoteModal(false);setNewNoteText('');}} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <div className="p-5">
              <div className="mb-2 text-xs text-slate-500">正在为 <span className="font-bold text-slate-800">{contacts.find(c=>c.id===activeNoteContactId)?.name}</span> 追加备注。</div>
              <textarea rows="4" value={newNoteText} onChange={e=>setNewNoteText(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-orange-500 resize-none" placeholder="请输入最新的跟进备注或信息补充..." autoFocus/>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={()=>{setShowNoteModal(false);setNewNoteText('');}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNote} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all">保存备注</button>
            </div>
          </div>
        </div>
      )}
      <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center"><Users size={20} className="mr-2 text-blue-600"/>联系人图谱 (共发现 {contacts.length} 人)</h2>
        <button onClick={()=>setShowAddModal(true)} className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200 shadow-sm"><UserPlus size={16} className="mr-1.5"/>新增联系人</button>
      </div>
      <div className="divide-y divide-slate-100">
        {contacts.map(c=>(
          <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                <span className="text-sm text-slate-500">{c.position}</span>
                {c.tags.map(t=><span key={t} className={`px-2 py-0.5 text-xs rounded border ${c.tagColor}`}>{t}</span>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {c.phones&&c.phones.map(phone=>(
                  <div key={phone} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg group">
                    <div className="flex items-center text-sm text-slate-700 font-mono"><Phone size={14} className="mr-2 text-slate-400"/>{phone}</div>
                    <button onClick={()=>handleCopy(phone,'电话')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">{copiedId===phone?<Check size={14} className="text-emerald-500"/>:<Copy size={14}/>}</button>
                  </div>
                ))}
                {c.wechat&&c.wechat!=="暂无"&&<div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg"><div className="flex items-center text-sm text-slate-700 font-mono"><MessageCircle size={14} className="mr-2 text-green-500"/>{c.wechat}</div><button onClick={()=>handleCopy(c.wechat,'微信号')} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-all">{copiedId===c.wechat?<Check size={14} className="text-emerald-500"/>:<Copy size={14}/>}</button></div>}
                {c.email&&c.email!=="暂无"&&<div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg"><div className="flex items-center text-sm text-slate-700 font-mono"><Mail size={14} className="mr-2 text-slate-400"/>{c.email}</div><button onClick={()=>handleCopy(c.email,'邮箱')} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-all">{copiedId===c.email?<Check size={14} className="text-emerald-500"/>:<Copy size={14}/>}</button></div>}
              </div>
              {c.notes&&c.notes.length>0?(
                <div className="bg-amber-50/40 rounded-lg border border-amber-100 overflow-hidden">
                  <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors" onClick={()=>setExpandedNoteIds(prev=>prev.includes(c.id)?prev.filter(i=>i!==c.id):[...prev,c.id])}>
                    <span className="text-xs font-semibold text-amber-700 flex items-center"><FileText size={14} className="mr-1.5"/>联系人信息备注 ({c.notes.length}条)</span>
                    <button className="text-amber-500">{expandedNoteIds.includes(c.id)?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>
                  </div>
                  {expandedNoteIds.includes(c.id)&&(
                    <div className="px-3 pb-3 space-y-2 border-t border-amber-100/50 pt-2">
                      <div className="flex justify-end"><button onClick={()=>{setActiveNoteContactId(c.id);setShowNoteModal(true);}} className="text-amber-600 hover:text-amber-800 font-medium bg-amber-100/50 px-2 py-1 rounded text-xs">+ 追加备注</button></div>
                      {c.notes.map(n=>(
                        <div key={n.id} className="text-sm text-slate-700 bg-white p-2.5 rounded-md border border-amber-50 shadow-sm">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono">{n.date}</div>
                          <div className="leading-relaxed whitespace-pre-wrap">{n.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ):(
                <button onClick={()=>{setActiveNoteContactId(c.id);setShowNoteModal(true);}} className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center border border-dashed border-blue-200 hover:bg-blue-50 w-full justify-center py-2 rounded-lg transition-colors">+ 添加联系人信息备注</button>
              )}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="text-xs font-bold text-blue-800 mb-2 flex items-center"><Sparkles size={12} className="mr-1"/>AI 推荐话术钩子</div>
                <div className="text-sm text-slate-700 bg-white p-3 rounded border border-blue-50 italic mb-3">"{c.pitch}"</div>
                <div className="text-xs font-bold text-blue-800 mb-1 flex items-center"><CheckCircle2 size={12} className="mr-1"/>AI 跟进建议</div>
                <div className="text-sm text-slate-600">{c.aiAdvice}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI推客 - 悬浮操作栏
const PitchActionSection = ({ lead, showToast, onSaveDraft, onOpenDirectory }) => {
  const [actionType, setActionType] = useState('convert');
  const [isOpen, setIsOpen] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [nextPlan, setNextPlan] = useState('');
  const [validationError, setValidationError] = useState('');
  const handleSubmit=()=>{
    if(actionType==='convert'&&!nextPlan){setValidationError('请选择下一步动作计划！');return;}
    setValidationError('');showToast('🎉 提交成功，正在加载下一条...');setIsOpen(false);
  };
  const handleSaveDraftClick=()=>{if(lead)onSaveDraft(lead.id);showToast('💾 已暂存到草稿箱');setIsOpen(false);};
  return (
    <>
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.08)] rounded-l-2xl bg-white border border-slate-200 border-r-0 overflow-hidden divide-y divide-slate-100 transition-transform duration-300 ${isOpen?'translate-x-full':'translate-x-0'}`}>
        {[{icon:ListTodo,label:'线索目录',color:'indigo',action:onOpenDirectory},{icon:Briefcase,label:'填写跟进',color:'blue',action:()=>{setActionType('convert');setValidationError('');setIsOpen(true);}},{icon:AlertCircle,label:'线索无效',color:'orange',action:()=>{setActionType('invalid');setValidationError('');setIsOpen(true);}},{icon:CornerUpLeft,label:'退回客户',color:'red',action:()=>setShowReturnModal(true)}].map(b=>(
          <button key={b.label} onClick={b.action} className={`p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-${b.color}-600 hover:bg-${b.color}-50 transition-all w-24 group`}>
            <div className={`bg-slate-50 group-hover:bg-${b.color}-100 p-2.5 rounded-full group-hover:scale-110 transition-transform`}><b.icon size={22} className={`text-slate-500 group-hover:text-${b.color}-600`}/></div>
            <span className="text-xs font-bold text-center">{b.label}</span>
          </button>
        ))}
      </div>
      {showReturnModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90vw] overflow-hidden">
            <div className="p-5 border-b border-red-100 flex justify-between items-center bg-red-50/50">
              <h3 className="font-bold text-red-700 flex items-center"><AlertCircle size={18} className="mr-2"/>确认退回该客户？</h3>
              <button onClick={()=>{setShowReturnModal(false);setConfirmText('');}} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <div className="p-6">
              <div className="mb-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">为防止误操作，请手动输入 <span className="text-red-600 font-mono bg-red-100/50 px-1.5 py-0.5 rounded border border-red-200">确认退回</span></label>
                <input type="text" value={confirmText} onChange={e=>setConfirmText(e.target.value)} placeholder="请输入：确认退回" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"/>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={()=>{setShowReturnModal(false);setConfirmText('');}} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100">取消</button>
              <button disabled={confirmText!=='确认退回'} className={`px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all ${confirmText==='确认退回'?'bg-red-600 hover:bg-red-700 shadow-md':'bg-red-300 cursor-not-allowed opacity-70'}`} onClick={()=>{showToast("🔄 客户已成功退回，将重新由AI分配！");setShowReturnModal(false);setConfirmText('');setIsOpen(false);}}>执行退回</button>
            </div>
          </div>
        </div>
      )}
      {isOpen&&<div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[140] animate-in fade-in duration-200" onClick={()=>setIsOpen(false)}/>}
      <div className={`fixed top-0 right-0 h-full w-[480px] sm:w-[540px] bg-white shadow-2xl z-[150] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen?'translate-x-0':'translate-x-full'}`}>
        <div className={`bg-gradient-to-r ${actionType==='convert'?'from-blue-600 to-indigo-600':'from-orange-500 to-red-500'} p-5 text-white flex justify-between items-center flex-shrink-0`}>
          <h2 className="text-lg font-bold flex items-center">{actionType==='convert'?<><Briefcase size={20} className="mr-2"/>填写跟进记录</>:<><AlertCircle size={20} className="mr-2"/>标记线索无效</>}</h2>
          <button onClick={()=>setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 custom-scrollbar">
          {actionType==='invalid'?(
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">无效原因 <span className="text-red-500">*</span></label><select className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white outline-none focus:border-orange-500"><option value="">请选择原因...</option><option>联系方式全部错误/空号</option><option>公司已倒闭/注销</option><option>非目标客户（无需求）</option></select></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">详细备注说明</label><textarea rows="5" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-orange-500 outline-none resize-none" placeholder="输入补充说明..."/></div>
              </div>
            </div>
          ):(
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center"><MessageCircle size={16} className="mr-1.5 text-blue-500"/>核心跟进信息</h3>
                  <div className="space-y-5">
                    <div><label className="block text-xs font-bold text-slate-700 mb-1.5">沟通纪要 / 跟进详情 <span className="text-red-500">*</span></label><textarea rows="4" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:border-blue-500 outline-none resize-none" placeholder="例如：今天下午与张总通话，对方对AI模块感兴趣..."/></div>
                    <div><label className="block text-xs font-bold text-slate-700 mb-1.5">上传凭证 <span className="text-slate-400 font-normal text-xs ml-1">(选填)</span></label><div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group"><UploadCloud size={28} className="text-slate-400 group-hover:text-blue-500"/><p className="text-sm font-medium text-slate-700 group-hover:text-blue-600">点击或拖拽文件上传</p></div></div>
                  </div>
                </div>
                <div className="pt-5 border-t border-slate-100">
                  <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${validationError?'bg-red-50 border-red-300':'bg-blue-50/70 border-blue-100'}`}>
                    <label className={`text-sm font-bold flex items-center ${validationError?'text-red-700':'text-blue-800'}`}><Calendar size={16} className="mr-1.5"/>下一步动作计划 <span className="text-red-500 ml-1">*</span></label>
                    <select value={nextPlan} onChange={e=>{setNextPlan(e.target.value);setValidationError('');}} className={`w-full border rounded-lg p-3 text-sm bg-white outline-none focus:ring-2 shadow-sm ${validationError?'border-red-400 focus:border-red-500 focus:ring-red-100':'border-blue-200 focus:border-blue-500 focus:ring-blue-100 text-slate-700'}`}>
                      <option value="">必填：请选择计划</option>
                      <option value="demo">预约产品演示 (Demo)</option>
                      <option value="quote">发送报价单</option>
                      <option value="visit">线下拜访</option>
                    </select>
                    {validationError&&<span className="text-xs text-red-600 font-medium flex items-center"><AlertCircle size={12} className="mr-1"/>{validationError}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
          <button onClick={handleSaveDraftClick} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">暂存草稿</button>
          <button onClick={handleSubmit} className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${actionType==='convert'?'bg-blue-600 hover:bg-blue-700 shadow-blue-200/50':'bg-orange-500 hover:bg-orange-600 shadow-orange-200/50'}`}>提交 / 下一条</button>
        </div>
      </div>
    </>
  );
};

// ============================================================
// SECTION 7: 销售画像模块
// ============================================================

function ProfileModule() {
  const [view, setView] = useState('list');
  const [salesList, setSalesList] = useState(initialSalesData);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleViewDetail=(user)=>{setSelectedUser(user);setView('detail');window.scrollTo(0,0);};
  const handleBack=()=>{setView('list');setSelectedUser(null);};
  const handleSaveUser=(updated)=>{setSalesList(salesList.map(u=>u.id===updated.id?updated:u));setSelectedUser(updated);};
  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
      {view==='list'?<ProfileList salesList={salesList} onViewDetail={handleViewDetail}/>:<ProfileDetail user={selectedUser} onBack={handleBack} onSave={handleSaveUser}/>}
    </main>
  );
}

function ProfileList({ salesList, onViewDetail }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered=salesList.filter(u=>u.name.includes(searchTerm)||u.position.includes(searchTerm));
  const grouped=filtered.reduce((acc,u)=>{if(!acc[u.position])acc[u.position]=[];acc[u.position].push(u);return acc;},{});
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-blue-600"/>团队业绩与漏斗分析概览</h3>
          <span className="text-xs text-slate-500 font-medium">数据实时同步</span>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
          <table className="w-full text-center text-sm whitespace-nowrap border-collapse">
            <thead className="bg-[#4472c4] text-white sticky top-0 z-10">
              <tr>{['姓名','目标业绩','完成业绩','意向金额','联系客户数','现场拜访数','有意向数量'].map(h=><th key={h} className="px-4 py-3 font-medium border border-blue-700/30">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white">
              {Object.entries(grouped).map(([position,users])=>(
                <React.Fragment key={position}>
                  <tr className="bg-slate-100/80"><td colSpan="7" className="px-4 py-2.5 text-left font-bold text-slate-600 text-xs border border-slate-200">{position} ({users.length}人)</td></tr>
                  {users.map(user=>{
                    const intentAmount=user.metrics.intentList.reduce((sum,i)=>{const v=parseFloat(i.budget);return sum+(isNaN(v)?0:v);},0);
                    const isHighlighted=user.metrics.warnings&&user.metrics.warnings.length>0;
                    return (
                      <tr key={user.id} className={`hover:opacity-90 transition-opacity ${isHighlighted?'bg-[#f8cbad] text-red-900':'hover:bg-slate-50 text-slate-700'}`}>
                        <td className="px-4 py-2.5 border border-slate-200 font-bold">{user.name}</td>
                        <td className="px-4 py-2.5 border border-slate-200">{user.targets.targetAmount}</td>
                        <td className="px-4 py-2.5 border border-slate-200">{user.metrics.monthlyClosedAmount}万</td>
                        <td className="px-4 py-2.5 border border-slate-200 font-medium">¥{(intentAmount*10000).toLocaleString()}</td>
                        <td className="px-4 py-2.5 border border-slate-200">{user.followUpCount}</td>
                        <td className="px-4 py-2.5 border border-slate-200">{user.visitedCount}</td>
                        <td className="px-4 py-2.5 border border-slate-200">{user.intentCustomers}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
          <input type="text" placeholder="搜索姓名、职位..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all" onChange={e=>setSearchTerm(e.target.value)}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(user=>(
          <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer flex flex-col" onClick={()=>onViewDetail(user)}>
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" alt={user.name}/>
                <div><h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{user.name}</h3><span className="text-xs text-slate-400 font-medium">最近活跃</span></div>
              </div>
              <button className="text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 p-1.5 rounded transition-colors"><ChevronRight className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <span className="px-2.5 py-1.5 bg-cyan-50 text-cyan-700 text-xs rounded-md border border-cyan-100 truncate flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1.5"/>{user.position}</span>
              <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md truncate flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5"/>{user.tenure}</span>
              <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md truncate flex items-center"><User className="w-3.5 h-3.5 mr-1.5"/>{user.gender} · {user.age}岁</span>
              <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-md truncate flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5"/>{user.location}</span>
            </div>
            <div className="flex items-center text-xs mb-6 text-slate-600 truncate px-1">
              <span className="text-slate-400 mr-2 shrink-0 font-medium">核心技能：</span><span className="truncate">{user.skills.join('，')}</span>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-sm bg-slate-50 p-3.5 rounded-lg">
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

function ProfileDetail({ user, onBack, onSave }) {
  const [formData, setFormData] = useState({...user});
  const [activeTab, setActiveTab] = useState('metrics');
  const [editStates, setEditStates] = useState({aiConfig:false});
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [modalTargetData, setModalTargetData] = useState({...user.targets});
  const [funnelSource, setFunnelSource] = useState('全部');
  const [funnelIndustry, setFunnelIndustry] = useState('全部');
  const [sortConfig, setSortConfig] = useState({key:null,direction:'asc'});
  const [abnormalFilter, setAbnormalFilter] = useState('全部');
  const [newTag, setNewTag] = useState('');
  const [newInd, setNewInd] = useState('');

  useEffect(()=>{setFormData({...user});setModalTargetData({...user.targets});setActiveTab('metrics');setEditStates({aiConfig:false});setShowTargetModal(false);setNewTag('');setNewInd('');setFunnelSource('全部');setFunnelIndustry('全部');setSortConfig({key:null,direction:'asc'});setAbnormalFilter('全部');},[user]);

  const toggleEdit=(k)=>setEditStates(prev=>({...prev,[k]:!prev[k]}));
  const saveSection=(k)=>{toggleEdit(k);onSave(formData);};
  const cancelSection=(k)=>{setFormData({...user});toggleEdit(k);if(k==='aiConfig'){setNewTag('');setNewInd('');}};
  const saveTargetModal=()=>{const u={...formData,targets:modalTargetData};setFormData(u);onSave(u);setShowTargetModal(false);};
  const updateField=(section,field,value)=>{if(section)setFormData({...formData,[section]:{...formData[section],[field]:value}});else setFormData({...formData,[field]:value});};

  const addTag=(e)=>{if(e.key==='Enter'&&newTag.trim()){e.preventDefault();if(!formData.skills.includes(newTag.trim()))updateField(null,'skills',[...formData.skills,newTag.trim()]);setNewTag('');}};
  const removeTag=(t)=>updateField(null,'skills',formData.skills.filter(s=>s!==t));
  const addInd=(e)=>{if(e.key==='Enter'&&newInd.trim()){e.preventDefault();if(!formData.industries.includes(newInd.trim()))updateField(null,'industries',[...formData.industries,newInd.trim()]);setNewInd('');}};
  const removeInd=(i)=>updateField(null,'industries',formData.industries.filter(x=>x!==i));

  const getDiffText=(oldStr,newStr)=>{const o=parseFloat(oldStr)||0,n=parseFloat(newStr)||0,d=n-o;if(!newStr||d===0)return<span className="text-[10px] text-slate-400">持平</span>;if(d>0)return<span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">↑ 上调 {d}</span>;return<span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">↓ 下调 {Math.abs(d)}</span>;};

  const handleSort=(key)=>{setSortConfig(prev=>({key,direction:prev.key===key&&prev.direction==='asc'?'desc':'asc'}));};
  const sortedIntentList=[...formData.metrics.intentList].sort((a,b)=>{if(!sortConfig.key)return 0;const{key,direction}=sortConfig;const m=direction==='asc'?1:-1;if(key==='level'){const w={'A级':4,'B级':3,'C级':2,'D级':1};return((w[a.level]||0)-(w[b.level]||0))*m;}if(key==='budget'){return((parseFloat(a.budget)||0)-(parseFloat(b.budget)||0))*m;}if(key==='daysFollowedUp'){return((parseInt(a.daysFollowedUp)||0)-(parseInt(b.daysFollowedUp)||0))*m;}return 0;});

  const filterAndSortAbnormal=(cases)=>{if(!cases)return[];let f=cases;if(abnormalFilter!=='全部')f=f.filter(c=>c.type===abnormalFilter);return f.sort((a,b)=>parseDateWeight(b.date)-parseDateWeight(a.date));};
  const displayAbnormalCases=filterAndSortAbnormal(formData.metrics.abnormalCases||[]);

  const cumulativeFunnel=formData.funnelData['累计'];
  const baseFunnel=formData.funnelData['当月'];
  let mult=1;
  if(funnelSource==='AI推客')mult*=0.35;
  if(funnelIndustry!=='全部')mult*=(1/(formData.industries.length||1));
  const monthlyFunnel={leads:Math.max(1,Math.round(baseFunnel.leads*mult)),customers:Math.max(1,Math.round(baseFunnel.customers*mult)),closed:Math.max(0,Math.round(baseFunnel.closed*mult)),amount:(parseFloat(baseFunnel.amount)*mult).toFixed(1)+'万'};

  const levelColor=(level)=>({A级:'bg-emerald-50 text-emerald-600 border-emerald-200',B级:'bg-blue-50 text-blue-600 border-blue-200',C级:'bg-amber-50 text-amber-600 border-amber-200',D级:'bg-slate-100 text-slate-500 border-slate-200'}[level]||'');
  const statusBadgeColor=(status)=>({A级客户:'bg-emerald-50 text-emerald-600 border-emerald-200',B级客户:'bg-blue-50 text-blue-600 border-blue-200',C级客户:'bg-amber-50 text-amber-600 border-amber-200'}[status]||'bg-slate-50 text-slate-600 border-slate-200');

  return (
    <div className="bg-white min-h-[85vh] md:rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-right-8 duration-300 relative">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-6 flex items-center gap-5 md:rounded-t-2xl">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"><ChevronLeft className="w-6 h-6"/></button>
        <div className="w-px h-10 bg-slate-200 hidden md:block"/>
        <div className="flex items-center gap-4">
          <img src={formData.avatar} className="w-14 h-14 rounded-full border border-slate-100 object-cover" alt={formData.name}/>
          <div className="flex flex-col justify-center">
            <div className="flex items-end gap-3 mb-1.5">
              <h2 className="text-xl font-bold text-slate-900 leading-none">{formData.name}</h2>
              <span className="text-xs text-slate-500 font-medium">{formData.gender} · {formData.age}岁</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded border border-cyan-100"><Briefcase className="w-3 h-3 mr-1 text-cyan-500"/>{formData.position}</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"><Clock className="w-3 h-3 mr-1 text-slate-400"/>{formData.tenure}</span>
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"><MapPin className="w-3 h-3 mr-1 text-slate-400"/>{formData.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8">
        <div className="flex space-x-6 md:space-x-8 border-b border-slate-100 mt-4 overflow-x-auto">
          {[{key:'metrics',label:'业绩达成监控',icon:BarChart2},{key:'analysis',label:'跟进情况分析',icon:Activity},{key:'ai',label:'AI推客逻辑配置',icon:Bot}].map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)} className={`flex items-center pb-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab===t.key?`border-cyan-500 text-cyan-600`:'border-transparent text-slate-400 hover:text-slate-600'}`}>
              <t.icon className="w-4 h-4 mr-2"/>{t.label}
            </button>
          ))}
        </div>

        <div className="py-8 pb-16">
          {/* TAB 1: 业绩达成监控 */}
          {activeTab==='metrics'&&(
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-800 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5"/>当月目标与达成</h4>
                <button onClick={()=>setShowTargetModal(true)} className="flex items-center px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 shadow-sm transition-all"><Flag className="w-4 h-4 mr-1.5"/>调整本月目标</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <ProfileMetricCard title="当月达成金额" actual={parseFloat(formData.metrics.monthlyClosedAmount).toFixed(0)} target={parseFloat(formData.targets.targetAmount)} unit="万" type="progress" highlight/>
                <ProfileMetricCard title="当月达成客户数" actual={formData.metrics.monthlyNewCustomers} target={formData.targets.targetNewCustomers} unit="家" type="gap"/>
                <ProfileMetricCard title="当月转换率" subtitle="当月成交数 ÷ 总客户数" actual={parseFloat(formData.metrics.monthlyConversionRate)} target={parseFloat(formData.targets.targetConversionRate)} unit="%" type="diff"/>
              </div>
              {formData.metrics.warnings&&formData.metrics.warnings.length>0&&(
                <div className="mb-8 flex items-start bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm shadow-sm">
                  <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-red-500"/>
                  <div><strong className="block mb-1 text-red-800">指标异常预警</strong>{formData.metrics.warnings[0]}</div>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 border-t border-slate-100 pt-8">
                {/* 累计漏斗 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
                  <h3 className="text-base font-bold text-slate-800 flex items-center mb-6"><Filter className="w-5 h-5 mr-2 text-blue-500"/>累计转化漏斗</h3>
                  <div className="flex flex-col items-center w-full flex-grow justify-center gap-2">
                    {[{label:'线索数',val:`${cumulativeFunnel.leads} 条`,color:'blue'},{label:'客户数',val:`${cumulativeFunnel.customers} 家`,color:'amber'},{label:'成功签约',val:`${cumulativeFunnel.closed} 单 / ${cumulativeFunnel.amount}`,color:'emerald'}].map((item,i)=>(
                      <React.Fragment key={item.label}>
                        <div className={`w-full bg-${item.color}-50 border border-${item.color}-200 ${i===0?'rounded-t-xl rounded-b-md':i===2?'rounded-t-md rounded-b-xl w-4/6':' rounded-md w-5/6'} p-4 flex flex-col items-center relative transition-transform hover:scale-105`}>
                          <span className={`text-xs font-bold text-${item.color}-800 mb-1`}>{item.label}</span>
                          <div className={`text-xl font-black text-${item.color}-700`}>{item.val}</div>
                        </div>
                        {i<2&&<ChevronDown className="w-4 h-4 text-slate-300"/>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {/* 当月漏斗 */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-slate-800 flex items-center shrink-0"><Filter className="w-5 h-5 mr-2 text-blue-500"/>当月转化漏斗</h3>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
                      <div className="flex bg-slate-200/50 p-0.5 rounded-md">
                        {['全部','AI推客'].map(s=><button key={s} onClick={()=>setFunnelSource(s)} className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${funnelSource===s?'bg-white text-blue-600 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>{s}</button>)}
                      </div>
                      <select value={funnelIndustry} onChange={e=>setFunnelIndustry(e.target.value)} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 rounded px-1.5 py-1 outline-none max-w-[70px]">
                        <option value="全部">全部行业</option>
                        {formData.industries.map(ind=><option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full flex-grow justify-center gap-2">
                    {[{label:'线索数',val:`${monthlyFunnel.leads} 条`,color:'blue'},{label:'客户数',val:`${monthlyFunnel.customers} 家`,color:'amber'},{label:'成功签约',val:`${monthlyFunnel.closed} 单 / ${monthlyFunnel.amount}`,color:'emerald'}].map((item,i)=>(
                      <React.Fragment key={item.label}>
                        <div className={`w-full bg-${item.color}-50 border border-${item.color}-200 ${i===0?'rounded-t-xl rounded-b-md':i===2?'rounded-t-md rounded-b-xl w-4/6':' rounded-md w-5/6'} p-4 flex flex-col items-center relative transition-transform hover:scale-105`}>
                          <span className={`text-xs font-bold text-${item.color}-800 mb-1`}>{item.label}</span>
                          <div className={`text-xl font-black text-${item.color}-700`}>{item.val}</div>
                        </div>
                        {i<2&&<ChevronDown className="w-4 h-4 text-slate-300"/>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              {/* 重点意向池 */}
              <div className="mt-10 border-t border-slate-100 pt-8">
                <h4 className="text-base font-bold text-slate-800 flex items-center mb-4"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2.5 shadow-[0_0_8px_rgba(245,158,11,0.6)]"/>重点意向池</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {formData.metrics.intentList.map((item,idx)=>(
                    <div key={idx} className="flex flex-col p-4 bg-amber-50/40 border border-amber-200/60 rounded-xl hover:border-amber-400 transition-colors shadow-sm">
                      <span className="font-bold text-slate-800 text-sm mb-3 truncate">{item.name}</span>
                      <div className="flex flex-col gap-1.5 mt-auto">
                        <div className="flex items-center"><span className="text-[10px] text-slate-500 mr-2 font-medium w-12 shrink-0">意向等级</span><span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${levelColor(item.level)}`}>{item.level}</span></div>
                        <div className="flex items-center"><span className="text-[10px] text-slate-500 mr-2 font-medium w-12 shrink-0">预估金额</span><span className={(!item.budget||item.budget==='评估中'||item.budget==='未知')?'text-[10px] text-slate-400':'text-[10px] text-blue-600 font-bold'}>{(!item.budget||item.budget==='评估中'||item.budget==='未知')?'评估中':item.budget}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 当月合同 */}
              <div className="mt-10 border-t border-slate-100 pt-8">
                <h4 className="text-base font-bold text-slate-800 flex items-center mb-5"><FileText className="w-5 h-5 mr-2 text-emerald-500"/>当月合同明细</h4>
                <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
                      <tr>{['客户名称','签约产品/类型','合同金额','签约日期'].map(h=><th key={h} className="px-5 py-3.5 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.metrics.contractList.map((item,idx)=>(
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

          {/* TAB 2: 跟进情况分析 */}
          {activeTab==='analysis'&&(
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ProfileBurndownChart data={formData.burndown} capacity={formData.taskLoad.dailyCapacity} intentList={formData.metrics.intentList}/>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 意向客户跟进池 */}
                <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/30">
                    <h4 className="text-base font-bold text-slate-800 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-500"/>当月意向客户跟进池</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Top 10</span>
                  </div>
                  <div className="overflow-x-auto flex-grow max-h-[420px] overflow-y-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-4 py-3 font-medium">客户名称</th>
                          {[{k:'level',l:'等级'},{k:'budget',l:'预估金额'},{k:'estimatedClose',l:'预估成单'},{k:'daysFollowedUp',l:'未跟进'}].map(col=>(
                            <th key={col.k} className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-200/50 transition-colors" onClick={()=>handleSort(col.k)}>
                              <div className="flex items-center">{col.l}<ArrowUpDown className="w-3 h-3 ml-1 text-slate-400"/></div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sortedIntentList.slice(0,10).map((item,idx)=>{
                          const slaStatus=getSlaStatus(item.level,item.daysFollowedUp);
                          const isOverdue=slaStatus==='overdue';const isWarning=slaStatus==='warning';
                          return (
                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-700 truncate max-w-[140px]">{item.name}</td>
                              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${levelColor(item.level)}`}>{item.level}</span></td>
                              <td className="px-4 py-3"><span className={(!item.budget||item.budget==='评估中'||item.budget==='未知')?'text-[10px] text-slate-400':'text-[10px] text-blue-600 font-bold'}>{(!item.budget||item.budget==='评估中'||item.budget==='未知')?'评估中':item.budget}</span></td>
                              <td className="px-4 py-3"><span className={(!item.estimatedClose||item.estimatedClose==='评估中')?'text-[10px] text-slate-400':'text-[10px] text-indigo-600'}>{item.estimatedClose||'评估中'}</span></td>
                              <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded text-[10px] font-bold inline-flex items-center ${isOverdue?'bg-rose-50 text-rose-600 border border-rose-200':isWarning?'bg-amber-50 text-amber-600 border border-amber-200':'text-slate-600 bg-slate-50 border border-slate-200'}`}>{isOverdue&&<AlertCircle className="w-3 h-3 mr-1"/>}{isWarning&&<Clock3 className="w-3 h-3 mr-1"/>}{item.daysFollowedUp} 天</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* 近期过程记录 */}
                <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center p-5 border-b border-slate-100 bg-slate-50/30">
                    <h4 className="text-base font-bold text-slate-800 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-indigo-500"/>近期核心过程记录</h4>
                  </div>
                  <div className="p-5 flex-grow overflow-y-auto max-h-[420px]">
                    {formData.records&&formData.records.length>0?(
                      <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 space-y-6 pb-2">
                        {formData.records.map((record,index)=>(
                          <div key={index} className="relative pl-6 md:pl-8">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-400 shadow-sm"/>
                            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-800 text-sm">{record.client}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${statusBadgeColor(record.status)}`}>{record.status}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1 font-medium mb-2">
                                <span className="flex items-center text-indigo-600"><Clock className="w-3 h-3 mr-1"/>{record.date}</span>
                                <span className="flex items-center"><Target className="w-3 h-3 mr-1"/>{record.purpose}</span>
                              </div>
                              <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-100 shadow-sm">{record.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ):(
                      <EmptyState text="最近暂无业务跟进记录" icon={MessageSquare}/>
                    )}
                  </div>
                </div>
              </div>
              {/* 异常清单 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm mt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
                  <h4 className="text-base font-bold text-slate-800 flex items-center"><ShieldAlert className="w-5 h-5 mr-2 text-rose-500"/>异常情况清单明细</h4>
                  <div className="flex bg-slate-100/80 p-1 rounded-lg overflow-x-auto">
                    {['全部','退回线索池','流失客户','暂停合作','无效线索'].map(type=>(
                      <button key={type} onClick={()=>setAbnormalFilter(type)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${abnormalFilter===type?'bg-white text-slate-800 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>{type}</button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 sticky top-0 z-10 shadow-sm">
                      <tr>{['客户/线索名称','分类状态','原因/备注解读','发生时间'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayAbnormalCases.length>0?displayAbnormalCases.map((item,idx)=>(
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-700">{item.name}</td>
                          <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${item.type==='无效线索'?'bg-slate-100 text-slate-500 border-slate-200':item.type==='退回线索池'?'bg-amber-50 text-amber-600 border-amber-200':item.type==='流失客户'?'bg-rose-50 text-rose-600 border-rose-200':item.type==='暂停合作'?'bg-purple-50 text-purple-600 border-purple-200':'bg-slate-100 text-slate-600 border-slate-200'}`}>{item.type}</span></td>
                          <td className="px-5 py-3.5 text-slate-600 font-medium truncate max-w-[400px]" title={item.reason}>{item.reason}</td>
                          <td className="px-5 py-3.5 text-slate-500 text-xs font-medium"><Clock className="w-3 h-3 inline mr-1 text-slate-400"/>{item.date}</td>
                        </tr>
                      )):<tr><td colSpan="4"><EmptyState text="当前分类下暂无异常流失或退回记录" icon={CheckCircle2}/></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI推客逻辑配置 */}
          {activeTab==='ai'&&(
            <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-purple-50/50 border border-purple-100/50 p-4 rounded-xl flex gap-3 text-purple-700 text-sm">
                <Bot className="w-5 h-5 shrink-0"/>
                <p>派单引擎将综合读取该销售的<strong>寻客区域</strong>、<strong>所属行业</strong>及<strong>能力标签</strong>智能匹配线索，实现高优意向线索的精准分发。</p>
              </div>
              <div className="pb-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold flex items-center"><Target className="w-4 h-4 mr-2 text-slate-400"/>线索定向分发规则</h3>
                  {!editStates.aiConfig&&<button onClick={()=>toggleEdit('aiConfig')} className="flex items-center text-cyan-600 text-xs font-bold bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors"><Edit2 className="w-3.5 h-3.5 mr-1.5"/>编辑配置</button>}
                </div>
                <div className={`p-6 -mx-6 md:mx-0 md:rounded-xl flex flex-col transition-colors ${editStates.aiConfig?'bg-cyan-50/20 ring-1 ring-cyan-100':''}`}>
                  <div className="space-y-8">
                    <div>
                      <label className="text-sm font-bold text-slate-700 flex items-center mb-3"><MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>寻客区域 (LBS优先)</label>
                      {editStates.aiConfig?<input className="w-full max-w-md px-3 py-2 bg-white border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm shadow-sm" value={formData.location} onChange={e=>updateField(null,'location',e.target.value)} placeholder="如：上海市某街道"/>:<div className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 inline-block min-w-[200px]">{formData.location}</div>}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 flex items-center mb-3"><Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400"/>专属深挖行业</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.industries.map(i=><span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 flex items-center">{i}{editStates.aiConfig&&<X className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-red-500" onClick={()=>removeInd(i)}/>}</span>)}
                        {editStates.aiConfig&&<div className="flex items-center bg-white border border-cyan-200 rounded-lg px-2 overflow-hidden shadow-sm"><Plus className="w-4 h-4 text-slate-400"/><input type="text" placeholder="添加行业后回车" value={newInd} onChange={e=>setNewInd(e.target.value)} onKeyDown={addInd} className="bg-transparent border-none text-sm w-32 py-1.5 px-2 outline-none"/></div>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 flex items-center mb-3"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-500"/>核心能力引擎标签</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(s=><span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 flex items-center">{s}{editStates.aiConfig&&<X className="w-3.5 h-3.5 ml-2 cursor-pointer hover:text-red-500" onClick={()=>removeTag(s)}/>}</span>)}
                        {editStates.aiConfig&&<div className="flex items-center bg-white border border-cyan-200 rounded-lg px-2 overflow-hidden shadow-sm"><Plus className="w-4 h-4 text-slate-400"/><input type="text" placeholder="手动添加标签后回车" value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={addTag} className="bg-transparent border-none text-sm w-36 py-1.5 px-2 outline-none"/></div>}
                      </div>
                      {editStates.aiConfig&&formData.aiSuggestedTags&&(
                        <div className="mt-4 pt-4 border-t border-cyan-100 border-dashed">
                          <span className="text-xs text-cyan-700 font-bold mb-2 flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1"/>AI 结合历史跟进诊断补充推荐：</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.aiSuggestedTags.filter(tag=>!formData.skills.includes(tag)).map((tag,idx)=>(
                              <button key={idx} onClick={()=>updateField(null,'skills',[...formData.skills,tag])} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-lg border border-cyan-200 hover:bg-cyan-100 transition-colors flex items-center shadow-sm"><Plus className="w-3 h-3 mr-1"/>{tag}</button>
                            ))}
                            {formData.aiSuggestedTags.filter(tag=>!formData.skills.includes(tag)).length===0&&<span className="text-xs text-slate-400">所有AI建议标签均已添加</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {editStates.aiConfig&&(
                    <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-slate-200/60 w-full">
                      <button onClick={()=>cancelSection('aiConfig')} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">取消</button>
                      <button onClick={()=>saveSection('aiConfig')} className="px-4 py-2 text-sm text-white rounded-lg shadow-sm transition-colors flex items-center font-medium bg-cyan-600 hover:bg-cyan-700"><Check className="w-4 h-4 mr-1.5"/>保存配置</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 调整目标弹窗 */}
      {showTargetModal&&(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center"><Flag className="w-4 h-4 mr-2 text-rose-500"/>调整本月目标设定</h3>
              <button onClick={()=>setShowTargetModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-5 bg-slate-50/30">
              {[{label:'本月目标金额',field:'targetAmount',unit:'万'},{label:'计划新增客户数',field:'targetNewCustomers',unit:'家'},{label:'目标成单转化率',field:'targetConversionRate',unit:'%'}].map(f=>(
                <div key={f.field} className="flex flex-col gap-2.5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">{f.label}</label>
                    {getDiffText(formData.targets[f.field],modalTargetData[f.field])}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex flex-col justify-center">
                      <div className="text-[10px] text-slate-400 mb-0.5 font-medium">当前原目标</div>
                      <div className="text-sm font-bold text-slate-500 line-through decoration-slate-300">{formData.targets[f.field]} <span className="text-xs font-normal">{f.unit}</span></div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 shrink-0"/>
                    <div className="flex-1 relative">
                      <div className="text-[10px] text-cyan-600 mb-1 font-bold ml-1">新目标预设</div>
                      <div className="relative">
                        <input type="text" value={(modalTargetData[f.field]||'').toString().replace(f.unit,'')} onChange={e=>setModalTargetData({...modalTargetData,[f.field]:e.target.value?(e.target.value+f.unit):undefined})} className="w-full pl-3 pr-7 py-2 bg-white border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 text-sm shadow-sm font-bold"/>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{f.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={()=>setShowTargetModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">取消调整</button>
              <button onClick={saveTargetModal} className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center"><Check className="w-4 h-4 mr-1.5"/>确认覆盖新目标</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 销售画像 - 燃尽图
function ProfileBurndownChart({ data, capacity, intentList }) {
  const width=400,height=200,pX=30,pTop=20,pBot=30;
  const innerW=width-pX*2,innerH=height-pTop-pBot;
  const maxVal=Math.max(...data.overdueLeads,...data.levelA,...data.levelB,...data.levelC,...data.levelD,10);
  const getPoints=(arr)=>arr.map((val,i)=>{const x=pX+(i/(arr.length-1))*innerW;const y=pTop+(1-val/maxVal)*innerH;return`${x},${y}`;}).join(' ');
  const totalLeads=data.overdueLeads.reduce((s,v)=>s+v,0);
  const totalCustomers=[...data.levelA,...data.levelB,...data.levelC,...data.levelD].reduce((s,v)=>s+v,0);
  const dailyLeadCap=capacity?.leads||50,dailyCustCap=capacity?.customers||15;
  const daysToClearLeads=(totalLeads/dailyLeadCap).toFixed(1);
  const daysToClearCust=(totalCustomers/dailyCustCap).toFixed(1);
  const leadWarning=parseFloat(daysToClearLeads)>3,capacityCustWarning=parseFloat(daysToClearCust)>3;
  const overdueCustomers=(intentList||[]).filter(c=>getSlaStatus(c.level,c.daysFollowedUp)==='overdue');
  const aLevelOverdue=overdueCustomers.filter(c=>c.level==='A级').length;
  const hasSlaWarning=overdueCustomers.length>0;
  const lines=[{arr:data.overdueLeads,color:'#a855f7'},{arr:data.levelA,color:'#10b981'},{arr:data.levelB,color:'#3b82f6'},{arr:data.levelC,color:'#f59e0b'},{arr:data.levelD,color:'#94a3b8'}];
  const legends=[{color:'#a855f7',label:'超期线索'},{color:'#10b981',label:'A级客户'},{color:'#3b82f6',label:'B级客户'},{color:'#f59e0b',label:'C级客户'},{color:'#94a3b8',label:'D级客户'}];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col w-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center"><TrendingDown className="w-5 h-5 mr-2 text-blue-500"/>超期未跟进监控与预测分析</h3>
        <p className="text-xs text-slate-500">监控待跟进线索与各级客户的超期滞留趋势，并由AI提供干预建议</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] font-medium px-2">
            {legends.map(l=><div key={l.label} className="flex items-center"><span className="w-2.5 h-2.5 rounded mr-1.5" style={{backgroundColor:l.color}}/>{l.label}</div>)}
          </div>
          <div className="relative w-full h-[200px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <text x={pX-10} y={pTop+4} fontSize="10" fill="#94a3b8" textAnchor="end">{maxVal}</text>
              <text x={pX-10} y={pTop+innerH+4} fontSize="10" fill="#94a3b8" textAnchor="end">0</text>
              {[0,0.25,0.5,0.75,1].map(r=><line key={r} x1={pX} y1={pTop+r*innerH} x2={width-pX} y2={pTop+r*innerH} stroke="#f1f5f9" strokeWidth="1" strokeDasharray={r===1?"":"4 4"}/>)}
              {lines.map((line,li)=>(
                <React.Fragment key={li}>
                  <polyline points={getPoints(line.arr)} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {line.arr.map((val,i)=>{const x=pX+(i/(line.arr.length-1))*innerW;const y=pTop+(1-val/maxVal)*innerH;return<circle key={i} cx={x} cy={y} r="3" fill="#ffffff" stroke={line.color} strokeWidth="2"/>;}) }
                </React.Fragment>
              ))}
              {data.labels.map((lbl,i)=><text key={lbl} x={pX+(i/(data.labels.length-1))*innerW} y={height-5} fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="500">{lbl}</text>)}
            </svg>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col border-t border-slate-100 pt-5 lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0">
          <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500"/>AI 预测性跟进分析</h4>
          <div className="space-y-3">
            {leadWarning?(
              <div className="flex items-start text-xs bg-amber-50 text-amber-700 p-2.5 rounded-lg border border-amber-100 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-amber-500"/>
                <p className="leading-relaxed">超期线索总量达 <strong className="text-amber-800">{totalLeads}</strong> 条，按其日均处理产能需 <strong className="text-amber-800">{daysToClearLeads}</strong> 天消化，建议暂缓派发。</p>
              </div>
            ):(
              <div className="flex items-start text-xs bg-slate-50 text-slate-600 p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-emerald-500"/>
                <p className="leading-relaxed">超期线索总量 <strong>{totalLeads}</strong> 条，处理水位处于正常区间，无滞留风险。</p>
              </div>
            )}
            {hasSlaWarning?(
              <div className="flex items-start text-xs bg-rose-50 text-rose-700 p-2.5 rounded-lg border border-rose-100 shadow-sm">
                <AlertCircle className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-rose-500"/>
                <p className="leading-relaxed">检测到 <strong className="text-rose-800">{overdueCustomers.length}</strong> 家客户突破跟进SLA（含A级逾期 <strong className="text-rose-800">{aLevelOverdue}</strong> 家），高优客户面临流失风险！</p>
              </div>
            ):capacityCustWarning?(
              <div className="flex items-start text-xs bg-amber-50 text-amber-700 p-2.5 rounded-lg border border-amber-100 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-amber-500"/>
                <p className="leading-relaxed">待跟进客户量达 <strong>{totalCustomers}</strong> 家，按其产能测算近期日程已饱和，请关注SLA逾期风险。</p>
              </div>
            ):(
              <div className="flex items-start text-xs bg-slate-50 text-slate-600 p-2.5 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-emerald-500"/>
                <p className="leading-relaxed">客户跟进队列目前全部符合SLA标准，跟进及时率有保障。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 销售画像 - 指标卡片
function ProfileMetricCard({ title, actual, target, unit, type, highlight, subtitle }) {
  const actualNum=parseFloat(actual)||0,targetNum=parseFloat(target)||0;
  const progressPercent=targetNum>0?(actualNum/targetNum)*100:0;
  const diff=actualNum-targetNum;
  return (
    <div className={`p-6 rounded-xl border relative overflow-hidden flex flex-col ${highlight?'bg-gradient-to-br from-cyan-50 to-blue-50/30 border-cyan-200 shadow-sm':'bg-white border-slate-200 shadow-sm'}`}>
      <div className="text-sm font-medium text-slate-500 mb-1">{title}</div>
      {subtitle&&<div className="text-[10px] text-slate-400 mb-3">{subtitle}</div>}
      <div className="flex items-end gap-2 mb-4">
        <div className={`text-4xl font-black tracking-tight ${highlight?'text-cyan-900':'text-slate-800'}`}>{actual}<span className="text-xl ml-0.5">{unit}</span></div>
        <div className="text-sm text-slate-400 mb-1.5">/ {target}{unit}</div>
      </div>
      <div className="mt-auto">
        {type==='progress'&&(
          <div>
            <div className="flex justify-between text-xs mb-2 font-bold">
              <span className={progressPercent>=100?'text-emerald-600':'text-slate-500'}>达成 {progressPercent.toFixed(1)}%</span>
              {diff>=0?<span className="text-emerald-600">+超额 {diff}{unit}</span>:<span className="text-rose-500">还差 {Math.abs(diff)}{unit}</span>}
            </div>
            <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${progressPercent>=100?'bg-emerald-500':'bg-cyan-500'}`} style={{width:`${Math.min(progressPercent,100)}%`}}/></div>
          </div>
        )}
        {type==='gap'&&(
          <div className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-xs font-medium">
            {diff>=0?<><TrendingUp className="w-3 h-3 mr-1 text-emerald-600"/><span className="text-slate-700">超额拓客 <span className="text-emerald-600 font-bold">{diff}</span> 家</span></>:<><AlertCircle className="w-3 h-3 mr-1 text-amber-500"/><span className="text-slate-700">距目标还差 <span className="text-amber-600 font-bold">{Math.abs(diff)}</span> 家</span></>}
          </div>
        )}
        {type==='diff'&&(
          <div className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-xs font-medium">
            {diff>=0?<><TrendingUp className="w-3 h-3 mr-1 text-emerald-600"/><span className="text-slate-700">高于目标 <span className="text-emerald-600 font-bold">+{diff.toFixed(1)}%</span></span></>:<><TrendingDown className="w-3 h-3 mr-1 text-rose-500"/><span className="text-slate-700">落后目标 <span className="text-rose-600 font-bold">{Math.abs(diff).toFixed(1)}%</span></span></>}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 8: 主应用入口
// ============================================================
export default function App() {
  const [activeModule, setActiveModule] = useState('leads');
  const [userRole, setUserRole] = useState('manager');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type='success') => {
    setToastMessage(msg); setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-800">
      <Toast message={toastMessage} type={toastType}/>
      <SystemSidebar activeModule={activeModule} setActiveModule={setActiveModule}/>
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <SystemHeader userRole={userRole} setUserRole={setUserRole}/>
        <div className="flex-1 flex overflow-hidden">
          {activeModule==='leads'&&<LeadsModule userRole={userRole} showToast={showToast}/>}
          {activeModule==='pitch'&&<PitchModule showToast={showToast}/>}
          {activeModule==='profile'&&<ProfileModule/>}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar{width:6px;}
        .custom-scrollbar::-webkit-scrollbar-track{background:transparent;}
        .custom-scrollbar::-webkit-scrollbar-thumb{background-color:#cbd5e1;border-radius:10px;}
        .custom-scrollbar:hover::-webkit-scrollbar-thumb{background-color:#94a3b8;}
      `}}/>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle2, AlertCircle, Sparkles, Link as LinkIcon, 
  Building2, Calendar, Users, Briefcase, 
  Phone, Mail, MessageCircle, Share2, UploadCloud, 
  ChevronRight, ArrowRight, X, Frown, PartyPopper, RefreshCw,
  Menu, Clock, CircleDashed, CheckCircle, ChevronDown, ChevronUp,
  PlayCircle, ShieldAlert, History, FileText, BellRing, Pin, Info, Copy, Check,
  Home, Network, CreditCard, PieChart, UserCircle, Search, Bell, LayoutGrid, CornerUpLeft, UserPlus, ListTodo
} from 'lucide-react';

// --- 模拟线索数据源 ---
const initialLeads = [
  { 
    id: 'LD-2024-08997', name: '北京字节跳动科技有限公司', status: 'pending', score: 99, time: '11:00', daysUncontacted: 3,
    source: '上海人工智能大会客户发放名片',
    companyNotes: [],
    history: [
      { id: 3, date: '2024-02-10 16:00', sales: '您自己', type: '线下拜访', contact: '张一鸣', note: '上门拜访，确定了二期采购需求，需尽快跟进方案。', tag: '需求确认' },
      { id: 4, date: '2024-01-20 14:00', sales: '您自己', type: '线上会议', contact: '张一鸣', note: '进行了首次产品Demo演示，客户对AI模块非常感兴趣，要求提供报价。', tag: 'Demo演示' }
    ]
  },
  { 
    id: 'LD-2024-08992', name: '北京智谱华章科技有限公司', status: 'pending', score: 98, time: '10:00', daysUncontacted: 5,
    companyNotes: [
      { id: 201, text: "销售总监反馈该公司下半年有换系统的计划，重点关注安全性和私有化部署能力。", date: "2024-03-20 14:00" }
    ],
    history: [
      { id: 1, date: '2023-11-15 14:30', sales: '王建国 (已离职)', type: '电话拜访', contact: '张一鸣', note: '初步沟通，对方表示年底预算已用完，当前正在评估几家CRM供应商，建议明年Q1再联系。', tag: '持续培育' },
      { id: 2, date: '2023-10-10 10:00', sales: '王建国 (已离职)', type: '微信沟通', contact: '张一鸣', note: '发送了产品介绍PPT和安全白皮书，对方表示会抽空看下。', tag: '发送资料' }
    ]
  },
  { 
    id: 'LD-2024-08995', name: '月之暗面科技有限公司', status: 'pending', score: 92, time: '10:15', daysUncontacted: 1, 
    source: '官网市场合作邮箱咨询', companyNotes: [], 
    history: [
      { id: 5, date: '2024-03-28 11:30', sales: '李四 (SDR)', type: '退回线索池', contact: '--', note: '客户表示近期在忙封闭开发，无暇评估新系统，暂不考虑，故退回线索池。', tag: '时机未到' }
    ] 
  },
  { 
    id: 'LD-2024-08993', name: '上海商汤智能科技有限公司', status: 'pending', score: 95, time: '09:30', daysUncontacted: 7, 
    source: '企查查企业名录定向拉取', companyNotes: [], 
    history: [
      { id: 6, date: '2024-03-20 15:45', sales: '赵六 (SDR)', type: '线索无效', contact: '前台', note: '多次拨打企查查上的工商预留电话均为空号，且尝试添加法人微信未通过。', tag: '联系方式失效' }
    ] 
  },
  { id: 'LD-2024-08994', name: '深圳市腾讯计算机系统有限公司', status: 'completed', score: 88, time: '09:00', daysUncontacted: 0, source: '历史流失公海捞回', companyNotes: [], history: [] },
];

// --- 全局 Toast 提示组件 ---
// --- 模块内部 Toast：自管定时自动关闭，不依赖父组件 ---
/**
 * 模块内部 Toast 组件（独立自管）
 * 3秐后自动回调 onClose，支持 success/error/loading 三种状态。
 * @param {Object} props
 * @param {string} props.message - 提示内容
 * @param {'success'|'error'|'loading'} [props.type='success']
 * @param {Function} props.onClose - 定时器到期的回调
 */
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-2 px-4 py-3 shadow-lg border font-medium text-sm ${type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : type === 'loading' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
        {type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : type === 'loading' ? <RefreshCw size={18} className="text-blue-500 animate-spin" /> : <AlertCircle size={18} className="text-red-500" />}
        {message}
      </div>
    </div>
  );
};

// --- 通用展示组件 ---
/**
 * 带来源链接的单个信息展示单元
 * @param {Object} props
 * @param {string} props.label - 字段名
 * @param {string} props.value - 字段内容
 * @param {string} [props.source] - 来源标签（悬浮显示）
 * @param {string} [props.link='#'] - 来源链接 URL
 * @param {number} [props.colSpan=1] - 占列数
 */
const InfoItem = ({ label, value, source, link = "#", colSpan = 1 }) => (
  <div className={`relative group flex flex-col p-3 hover:bg-slate-50 transition-colors ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}>
    <span className="text-xs text-slate-500 mb-1">{label}</span>
    <div className="flex items-center">
      <span className="text-sm text-slate-800 font-medium whitespace-pre-wrap">{value}</span>
      {source && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-blue-500 bg-blue-50 px-2 py-0.5 cursor-pointer">
          <LinkIcon size={10} className="mr-1" />{source}
        </a>
      )}
    </div>
  </div>
);

/**
 * AI 信息展示卡片，带渐变背景和图标装饰
 * @param {Object} props
 * @param {string} props.title - 卡片标题
 * @param {React.ReactNode} props.children - 卡片内容
 * @param {React.ElementType} [props.icon=Sparkles] - 标题图标组件
 */
const AIBlock = ({ title, children, icon: Icon = Sparkles }) => (
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100 relative overflow-hidden">
    <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
      <Icon size={120} />
    </div>
    <div className="flex items-center text-indigo-700 font-semibold mb-3 relative z-10">
      <Icon size={18} className="mr-2" />
      {title}
    </div>
    <div className="relative z-10 text-sm text-slate-700 leading-relaxed">
      {children}
    </div>
  </div>
);

// --- 骨架屏加载组件 ---
const SkeletonLoading = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-6 animate-pulse w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-4 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <div className="h-7 w-64 bg-slate-200"></div>
                <div className="h-5 w-40 bg-slate-100 rounded"></div>
              </div>
              <div className="h-14 w-20 bg-orange-50 border border-orange-100/50"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="h-12 bg-slate-100"></div>
              <div className="h-12 bg-slate-100"></div>
              <div className="h-12 bg-slate-100 col-span-2"></div>
              <div className="h-12 bg-slate-100 col-span-2"></div>
            </div>

            <div className="h-28 bg-indigo-50/50 mb-6"></div>

            <div className="grid grid-cols-2 gap-6">
              <div className="h-32 bg-slate-50"></div>
              <div className="h-32 bg-red-50/30"></div>
            </div>
          </div>
          
          <div className="h-24 bg-white shadow-sm border border-slate-100"></div>
        </div>

        <div className="xl:col-span-5">
          <div className="bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-50 p-5 bg-slate-50/50">
              <div className="h-5 w-40 bg-slate-200 rounded"></div>
            </div>
            <div className="p-6 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-20 bg-slate-200 rounded"></div>
                    <div className="h-4 w-32 bg-slate-100 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-slate-50"></div>
                    <div className="h-9 bg-slate-50"></div>
                  </div>
                  <div className="h-24 bg-blue-50/30"></div>
                  {i === 1 && <div className="h-px bg-slate-100 w-full my-4"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 1. 抽屉式线索目录组件
const DirectoryDrawer = ({ isOpen, onClose, leads, currentLeadId, onSelectLead }) => {
  const draftLeads = useMemo(() => leads.filter(l => l.status === 'draft'), [leads]);
  const completedLeads = useMemo(() => leads.filter(l => l.status === 'completed'), [leads]);
  const pendingLeads = useMemo(() => leads.filter(l => l.status === 'pending'), [leads]);

  const LeadItem = ({ lead }) => {
    const isActive = lead.id === currentLeadId;
    let StatusIcon = CircleDashed;
    let statusColor = "text-slate-400";
    if (lead.status === 'completed') { StatusIcon = CheckCircle; statusColor = "text-green-500"; }
    else if (lead.status === 'draft') { StatusIcon = Clock; statusColor = "text-orange-500"; }
    else if (lead.daysUncontacted >= 3) { statusColor = "text-red-500"; }

    return (
      <div 
        onClick={() => { onSelectLead(lead.id); onClose(); }}
        className={`p-3 cursor-pointer transition-all border mb-2 group ${isActive ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
      >
        <div className="flex items-start gap-2.5">
          <StatusIcon size={16} className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-blue-600' : statusColor}`} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className={`text-sm font-bold truncate pr-2 ${isActive ? 'text-blue-800' : 'text-slate-700'}`}>{lead.name}</div>
            </div>
            <div className="text-xs mt-1.5 flex justify-between items-center">
              <span className={`font-medium truncate mr-2 ${lead.status === 'draft' ? 'text-orange-500' : lead.daysUncontacted >= 3 ? 'text-red-500' : 'text-slate-400'}`}>
                {lead.status === 'completed' ? '今日已跟进' : lead.status === 'draft' ? '草稿待提交' : `${lead.daysUncontacted} 天未跟进`}
              </span>
              <span className="flex items-center flex-shrink-0 text-orange-500"><Sparkles size={10} className="mr-0.5"/>{lead.score}分</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SkeletonLeadItem = () => (
    <div className="p-3 border mb-2 bg-white border-slate-100 opacity-60">
      <div className="flex items-start gap-2.5 animate-pulse">
        <div className="w-4 h-4 bg-slate-200 mt-0.5 flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-slate-200w-3/4 mb-2.5 mt-0.5"></div>
          <div className="flex justify-between items-center mt-1.5">
            <div className="h-3 bg-slate-200w-1/3"></div>
            <div className="h-3 bg-slate-200w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const GroupSection = ({ title, icon: Icon, colorClass, data, showSkeleton = false }) => {
    if (data.length === 0 && !showSkeleton) return null;
    return (
      <div className="mb-6">
        <div className={`text-xs font-bold mb-3 flex items-center justify-between ${colorClass}`}>
          <div className="flex items-center">
            <Icon size={14} className="mr-1.5" />
            {title} ({data.length})
          </div>
        </div>
        {data.map(lead => <LeadItem key={lead.id} lead={lead} />)}
        {showSkeleton && <SkeletonLeadItem />}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] transition-opacity animate-in fade-in duration-200" 
          onClick={onClose}
        ></div>
      )}
      
      <div className={`fixed top-0 right-0 h-full w-[360px] bg-slate-50 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800 flex items-center">
            <ListTodo size={18} className="mr-2 text-blue-600" /> 今日任务线索池
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 text-slate-500 transition-colors" aria-label="关闭目录"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <GroupSection title="跟进暂存" icon={Clock} colorClass="text-orange-600" data={draftLeads} />
          <GroupSection title="今日已处理" icon={CheckCircle} colorClass="text-green-600" data={completedLeads} />
          <GroupSection title="待跟进 / 计划跟进中" icon={Users} colorClass="text-slate-600" data={pendingLeads} showSkeleton={true} />
        </div>
      </div>
    </>
  );
};

// 2. 内部顶部进度条
const ProgressHeader = ({ total, current, pending }) => {
  const percentage = useMemo(() => Math.round(((total - pending) / total) * 100), [total, pending]);
  
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-blue-50">
            {current}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">今日线索跟进</h1>
            <p className="text-xs text-slate-500">
              总计 <span className="font-semibold text-slate-700">{total}</span> 条 · 
              待跟进 <span className="font-semibold text-orange-500">{pending}</span> 条
            </p>
          </div>
        </div>
        <div className="flex-1 w-full sm:max-w-md">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">当前进度</span>
            <span className="text-blue-600 font-bold">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 relative overflow-hidden">
            <div className="bg-blue-600 h-2.5 transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-400">
            <span>开始</span>
            <span className="text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">第 {current} 题</span>
            <span>完成</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. 公司信息区域
const CompanyInfoSection = ({ lead, showToast, onAddCompanyNote, onAddHistoryRecord }) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const getCurrentDateStr = useCallback(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  const handleSaveNote = useCallback(() => {
    if (!newNoteText.trim()) {
      showToast('❌ 备注内容不能为空');
      return;
    }
    
    const dateStr = getCurrentDateStr();
    onAddCompanyNote(lead.id, newNoteText.trim(), dateStr);
    onAddHistoryRecord({
      id: Date.now(),
      date: dateStr,
      sales: '您自己',
      type: '公司信息备注追加',
      contact: '--',
      note: newNoteText.trim(),
      tag: '信息补充'
    });

    setShowNoteModal(false);
    setNewNoteText('');
    setIsNotesExpanded(true); 
    showToast('✅ 公司备注追加成功并已同步至跟进记录');
  }, [newNoteText, lead.id, showToast, onAddCompanyNote, onAddHistoryRecord, getCurrentDateStr]);

  return (
    <div className="bg-white shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all duration-300">
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white shadow-2xl w-[420px] max-w-[90vw] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center"><FileText size={16} className="mr-2 text-orange-500" /> 追加公司信息备注</h3>
              <button onClick={() => {setShowNoteModal(false); setNewNoteText('');}} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="关闭"><X size={18} /></button>
            </div>
            <div className="p-5">
              <div className="mb-2 text-xs text-slate-500">
                正在为 <span className="font-bold text-slate-800">{lead?.name}</span> 追加备注（保存后同步至跟进记录，且不可删除）。
              </div>
              <textarea 
                rows={4}
                value={newNoteText} 
                onChange={e => setNewNoteText(e.target.value)} 
                className="w-full border border-slate-300 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all resize-none" 
                placeholder="请输入关于该公司的最新跟进备注或背调补充..." 
                autoFocus
              ></textarea>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => {setShowNoteModal(false); setNewNoteText('');}} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNote} className="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-200 transition-all">保存备注</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-100 p-6 bg-slate-50/50">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{lead?.name || '加载中...'}</h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200 shadow-sm">存续</span>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 text-sm text-slate-600">
              <span className="flex items-center bg-white border border-slate-200 px-2.5 py-1 shadow-sm"><Building2 size={14} className="mr-1.5 text-slate-400"/> 人工智能 / 软件开发</span>
              <span className="flex items-center bg-white border border-slate-200 px-2.5 py-1 shadow-sm text-xs">成立年限：{Math.floor((Date.now() - new Date('2019-06-11').getTime()) / (365.25 * 24 * 3600 * 1000))}年</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-rose-50 px-5 py-3 border border-orange-100 shadow-sm relative overflow-hidden group cursor-help">
            <div className="absolute -right-2 -top-2 opacity-10 text-orange-500 rotate-12 group-hover:rotate-45 transition-transform duration-500"><Sparkles size={48} /></div>
            <div className="flex items-center text-[10px] sm:text-xs text-orange-600 font-bold mb-1 relative z-10 group/tooltip">
              <Sparkles size={12} className="mr-1" />AI 推荐评分
              <Info size={12} className="ml-1 text-orange-400" />
              <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-slate-800 text-white text-[10px] font-normalshadow-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                基于企业的招聘动态、融资节点和历史客单价综合计算得出的成单概率分值。
              </div>
            </div>
            <div className="flex items-baseline relative z-10">
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">{lead?.score || 90}</span>
              <span className="text-xs font-semibold text-orange-400 ml-0.5">/100</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <InfoItem label="成立时间" value="2019-06-11" />
          <InfoItem label="实缴资本" value="5000万人民币" />
          <InfoItem label="参保人数" value="350人" />
          <InfoItem label="公开年报" value="2024年度已公示" source="国家企业信用信息公示系统" link="#" />
          <InfoItem label="注册地址" value="北京市海淀区中关村东路1号院" colSpan={2} />
          <InfoItem label="办公地址" value="北京市海淀区清华科技园" colSpan={2} />
          <InfoItem label="主营业务" value="大语言模型研发、AI企业服务、智能客服系统" colSpan={2} />
          <InfoItem label="经营范围" value="技术开发、技术推广；计算机系统服务；数据处理..." colSpan={2} />
          <InfoItem label="公开财报" value="未上市，无公开财报" />
          <InfoItem label="关联公司" value="智谱(上海)科技有限公司等3家" colSpan={2} />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <AIBlock title="AI 业务需求深度分析" icon={Sparkles}>
            <p>基于该公司近期招聘了大量"大客户销售"和"CRM实施工程师"，判断其正处于<span className="font-bold text-indigo-900 bg-indigo-100/50 px-1 rounded">销售团队快速扩张期</span>。极大概率需要采购企业级SaaS CRM系统、呼叫中心或线索管理工具以支撑其业务增长。客户对数据安全、API对接能力要求极高。</p>
          </AIBlock>
          
          <AIBlock title="推荐跟进理由">
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>近期获得新一轮战略融资，预算充足。</li>
              <li>历史使用过基础版CRM，但随着团队突破300人，存在系统升级的痛点。</li>
              <li>属于我们的"S级高价值行业（AI/企服）"目标画像。</li>
            </ul>
          </AIBlock>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
              <PlayCircle size={16} className="mr-2 text-blue-500" /> 近期动态
            </h3>
            <ul className="space-y-3">
              <li className="text-sm group flex items-start">
                <span className="w-2 h-2 mt-1.5 bg-blue-500 mr-2 flex-shrink-0"></span>
                <div>
                  <div className="text-slate-700">发布招聘：资深CRM产品经理、大客户销售总监</div>
                  <div className="text-xs text-slate-400 mt-0.5">2天前</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="border border-red-100 bg-red-50/30 p-4 relative group">
            <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center cursor-help">
              <ShieldAlert size={16} className="mr-2" /> 风险提示
              <Info size={14} className="ml-1.5 text-red-400" />
            </h3>
             <div className="absolute top-10 left-4 w-48 p-2 bg-slate-800 text-white text-[10px] font-normalshadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                涉及失信被执行人、重大司法诉讼或核心高管频繁变动。
              </div>
            <ul className="space-y-3">
              <li className="text-sm flex items-start">
                <span className="w-2 h-2 mt-1.5 bg-red-500 mr-2 flex-shrink-0"></span>
                <div>
                  <div className="text-slate-700">存在 1 条知识产权纠纷（被告），已结案。</div>
                  <div className="text-xs text-slate-400 mt-0.5">来源: 裁判文书网</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          {lead?.companyNotes && lead.companyNotes.length > 0 && (
            <div className="bg-amber-50/40 border border-amber-100 overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors"
                onClick={() => setIsNotesExpanded(!isNotesExpanded)}
              >
                <div className="text-sm font-bold text-amber-700 flex items-center">
                  <FileText size={16} className="mr-1.5"/> 公司信息备注 ({lead.companyNotes.length}条)
                </div>
                <button className="text-amber-500 hover:text-amber-700 transition-colors">
                  {isNotesExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              
              {isNotesExpanded && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 fade-in duration-200 border-t border-amber-100/50 pt-3">
                  <div className="flex justify-end mb-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowNoteModal(true); }} 
                      className="text-amber-600 hover:text-amber-800 font-medium bg-amber-100/50 px-2.5 py-1.5 transition-colors text-xs"
                    >
                      + 追加备注
                    </button>
                  </div>
                  {lead.companyNotes.map((note) => (
                    <div key={note.id} className="text-sm text-slate-700 bg-white p-3 border border-amber-50 shadow-sm">
                      <div className="text-[10px] text-slate-400 mb-1.5 font-mono">{note.date}</div>
                      <div className="leading-relaxed whitespace-pre-wrap">{note.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(!lead?.companyNotes || lead.companyNotes.length === 0) && (
            <button 
              onClick={() => setShowNoteModal(true)} 
              className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center border border-dashed border-blue-200 hover:bg-blue-50 w-full justify-center py-3 transition-colors"
            >
              + 添加公司信息备注
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// 4. 历史跟进记录时间轴模块
const FollowUpHistorySection = ({ history }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white shadow-sm border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4">
      <div 
        className="border-b border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <History size={20} className="mr-2 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">历史跟进记录 ({history.length})</h2>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors" aria-label={isExpanded ? "收起" : "展开"}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {history.map((record) => (
              <div key={record.id} className="relative pl-6 group">
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 border-2 border-white ring-2 transition-colors ${
                  record.type === '线索无效' ? 'bg-red-400 ring-red-50' : 
                  record.type === '退回线索池' ? 'bg-orange-400 ring-orange-50' : 
                  'bg-slate-200 ring-slate-50 group-hover:bg-blue-400 group-hover:ring-blue-50'
                }`}></div>
                
                <div className={`rounded-xl p-4 border transition-colors ${
                  record.type === '线索无效' ? 'bg-red-50/50 border-red-100 hover:border-red-200' : 
                  record.type === '退回线索池' ? 'bg-orange-50/50 border-orange-100 hover:border-orange-200' : 
                  'bg-slate-50 border-slate-100 hover:border-blue-100'
                }`}>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800 flex items-center">
                        <Users size={14} className="mr-1 text-slate-400" /> {record.sales}
                      </span>
                      
                      <span className={`text-xs px-2 py-1 border shadow-sm font-medium ${
                        record.type === '线索无效' ? 'text-red-700 bg-red-100 border-red-200' :
                        record.type === '退回线索池' ? 'text-orange-700 bg-orange-100 border-orange-200' :
                        'text-slate-600 bg-white border-slate-200'
                      }`}>
                        操作: {record.type}
                      </span>
                      
                      {record.contact && record.contact !== '--' && (
                        <span className="text-xs text-slate-600 bg-white px-2 py-1 border border-slate-200 shadow-sm">
                          联系人: {record.contact}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center">
                      <Clock size={12} className="mr-1" /> {record.date}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-700 bg-white p-3 border border-slate-100 shadow-sm">
                    <div className="flex items-start">
                      <FileText size={14} className={`mr-1.5 mt-0.5 flex-shrink-0 ${
                        record.type === '线索无效' ? 'text-red-500' :
                        record.type === '退回线索池' ? 'text-orange-500' : 'text-blue-500'
                      }`} />
                      <div className="leading-relaxed whitespace-pre-wrap flex-1">{record.note}</div>
                    </div>
                  </div>

                  {record.tag && (
                    <div className="mt-3 flex items-center">
                      <span className={`text-[10px] px-2 py-0.5font-bold border ${
                        record.type === '线索无效' ? 'bg-red-50 text-red-600 border-red-100' :
                        record.type === '退回线索池' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        标记: {record.tag}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. 联系人区域
const ContactsSection = ({ showToast, onAddHistoryRecord }) => {
  const initialContacts = [
    {
      id: 1,
      name: "张一鸣",
      position: "销售副总裁 (VP of Sales)",
      tags: ["推荐触达", "决策者"],
      tagColor: "bg-green-100 text-green-700 border-green-200",
      phones: ["138-xxxx-8888", "010-8888xxxx"],
      wechat: "zhang_sales_vp",
      email: "zym@company.com",
      social: "抖音: 商业张sir (1.2w粉)",
      pitch: "张总您好，关注到贵司近期在快速扩充销售团队。我们提供的新一代CRM能直接对接大模型，帮您的团队提升30%的人效，不知您本周四下午是否有空交流10分钟？",
      aiAdvice: "建议通过微信添加，对方在朋友圈较为活跃，喜欢分享行业报告。切入点可以是探讨AI企业服务商业化路径。",
      notes: [
        { id: 101, text: "之前沟通感觉对价格比较敏感，需要多强调我们的投入产出比(ROI)。", date: "2024-03-25 10:30" }
      ]
    },
    {
      id: 2,
      name: "林晓",
      position: "IT总监 / CIO",
      tags: ["难触达", "技术评估者"],
      tagColor: "bg-orange-100 text-orange-700 border-orange-200",
      phones: ["139-xxxx-9999"],
      wechat: "linxiao_it",
      email: "linx@company.com",
      social: "小红书: IT圈的小林",
      pitch: "林总您好，我们CRM的OpenAPI非常完善，且支持私有化部署和数据加密，能够完美适配贵司自研的大模型底层。想给您发送一份API文档和安全白皮书参考。",
      aiAdvice: "电话接通率极低（历史数据<10%），建议直接发专业邮件附带白皮书，或通过脉脉申请技术交流。",
      notes: []
    }
  ];

  const [contacts, setContacts] = useState(initialContacts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', position: '', phones: '', wechat: '', email: '', social: '', note: ''
  });

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeNoteContactId, setActiveNoteContactId] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  // 初始化：自动展开有备注的联系人
  const [expandedNoteIds, setExpandedNoteIds] = useState(
    initialContacts.filter(c => c.notes && c.notes.length > 0).map(c => c.id)
  ); 

  const [copiedId, setCopiedId] = useState(null);
  
  const handleCopy = useCallback((text, type) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopiedId(text);
        showToast(`✅ ${type} 已复制`);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      showToast(`❌ 复制失败`);
    }
  }, [showToast]);

  const getCurrentDateStr = useCallback(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  const handleSaveNewContact = useCallback(() => {
    if (!formData.name.trim()) {
      showToast('❌ 姓名不能为空');
      return;
    }
    
    const dateStr = getCurrentDateStr();
    const newNoteId = Date.now();
    const newNotes = formData.note.trim() ? [{ id: newNoteId, text: formData.note.trim(), date: dateStr }] : [];
    const newContactId = Date.now();

    const newContact = {
      id: newContactId,
      name: formData.name,
      position: formData.position || "暂无职位信息",
      tags: ["销售手动添加"],
      tagColor: "bg-blue-50 text-blue-600 border-blue-200",
      phones: formData.phones ? formData.phones.split(new RegExp('[,，、/]')).map(p => p.trim()).filter(Boolean) : [],
      wechat: formData.wechat || "暂无",
      email: formData.email || "暂无",
      social: formData.social || "暂无",
      pitch: "这是您手动补充的联系人，当前暂无 AI 推荐破冰话术。",
      aiAdvice: "系统建议：尽快尝试通过现有联系方式建立初步破冰沟通，补全客户画像。",
      notes: newNotes
    };

    setContacts([newContact, ...contacts]);
    if (newNotes.length > 0) {
        setExpandedNoteIds([...expandedNoteIds, newContactId]); 
    }
    setShowAddModal(false);
    
    if (formData.note.trim()) {
      onAddHistoryRecord({
        id: Date.now(),
        date: dateStr,
        sales: '您自己',
        type: '新增联系人及备注',
        contact: formData.name,
        note: formData.note.trim(),
        tag: '信息补充'
      });
    }

    setFormData({ name: '', position: '', phones: '', wechat: '', email: '', social: '', note: '' });
    showToast('✅ 联系人及备注添加成功');
  }, [formData, showToast, onAddHistoryRecord, getCurrentDateStr, expandedNoteIds, contacts]);

  const handleSaveNote = useCallback(() => {
    if (!newNoteText.trim()) {
      showToast('❌ 备注内容不能为空');
      return;
    }

    const dateStr = getCurrentDateStr();
    const newNote = { id: Date.now(), text: newNoteText.trim(), date: dateStr };
    
    let contactName = '';
    
    setContacts(contacts.map(c => {
      if (c.id === activeNoteContactId) {
        contactName = c.name;
        return { ...c, notes: [...(c.notes || []), newNote] };
      }
      return c;
    }));

    onAddHistoryRecord({
      id: Date.now(),
      date: dateStr,
      sales: '您自己',
      type: '联系人备注追加',
      contact: contactName,
      note: newNoteText.trim(),
      tag: '信息补充'
    });

    setShowNoteModal(false);
    setNewNoteText('');
    setExpandedNoteIds(prev => !prev.includes(activeNoteContactId) ? [...prev, activeNoteContactId] : prev); 
    setActiveNoteContactId(null);
    showToast('✅ 备注追加成功并已同步至跟进记录');
  }, [newNoteText, activeNoteContactId, showToast, onAddHistoryRecord, getCurrentDateStr, contacts]);

  const toggleContactNotes = useCallback((id) => {
    setExpandedNoteIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  return (
    <div className="bg-white shadow-sm border border-slate-200 overflow-hidden mb-6">
      
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white shadow-2xl w-[520px] max-w-[90vw] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center"><UserPlus size={18} className="mr-2 text-blue-600" /> 新增联系人</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="关闭"><X size={18} /></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">姓名 <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="如: 王建国" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">职位/角色</label>
                  <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="如: 采购总监" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">手机号码 / 座机</label>
                  <input type="text" value={formData.phones} onChange={e => setFormData({...formData, phones: e.target.value})} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="多个号码用逗号分隔" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">微信号</label>
                  <input type="text" value={formData.wechat} onChange={e => setFormData({...formData, wechat: e.target.value})} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="如: wang_123" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">电子邮箱</label>
                  <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="如: wang@company.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">社交平台</label>
                  <input type="text" value={formData.social} onChange={e => setFormData({...formData, social: e.target.value})} className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="如: 脉脉: 王总" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center"><FileText size={14} className="mr-1.5 text-orange-500"/>联系人信息备注</label>
                  <span className="text-[10px] text-slate-400">将同步至跟进记录</span>
                </div>
                <textarea 
                  rows={3}
                  value={formData.note} 
                  onChange={e => setFormData({...formData, note: e.target.value})} 
                  className="w-full border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" 
                  placeholder="针对该联系人的特别备注说明（选填）..." 
                ></textarea>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNewContact} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">保存联系人</button>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white shadow-2xl w-[420px] max-w-[90vw] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center"><FileText size={16} className="mr-2 text-orange-500" /> 追加联系人备注</h3>
              <button onClick={() => {setShowNoteModal(false); setNewNoteText('');}} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="关闭"><X size={18} /></button>
            </div>
            <div className="p-5">
              <div className="mb-2 text-xs text-slate-500">
                正在为 <span className="font-bold text-slate-800">{contacts.find(c => c.id === activeNoteContactId)?.name}</span> 追加备注（保存后同步至跟进记录，且不可删除）。
              </div>
              <textarea 
                rows={4}
                value={newNoteText} 
                onChange={e => setNewNoteText(e.target.value)} 
                className="w-full border border-slate-300 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all resize-none" 
                placeholder="请输入最新的跟进备注或信息补充..." 
                autoFocus
              ></textarea>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => {setShowNoteModal(false); setNewNoteText('');}} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNote} className="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-200 transition-all">保存备注</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center"><Users size={20} className="mr-2 text-blue-600" />联系人图谱 (共发现 {contacts.length} 人)</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 transition-colors border border-blue-200 shadow-sm"
        >
          <UserPlus size={16} className="mr-1.5" /> 新增联系人
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {contacts.map((c) => (
          <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                <span className="text-sm text-slate-500">{c.position}</span>
                {c.tags.map(t => (
                  <span key={t} className={`px-2 py-0.5 text-xsborder ${c.tagColor}`}>{t}</span>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {c.phones && c.phones.length > 0 && c.phones.map(phone => (
                  <div key={phone} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 group">
                    <div className="flex items-center text-sm text-slate-700 font-mono"><Phone size={14} className="mr-2 text-slate-400" /> {phone}</div>
                    <button onClick={() => handleCopy(phone, '电话')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50transition-all" aria-label="复制电话">
                      {copiedId === phone ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
                {c.wechat && c.wechat !== "暂无" && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 group">
                    <div className="flex items-center text-sm text-slate-700 font-mono"><MessageCircle size={14} className="mr-2 text-green-500" /> {c.wechat}</div>
                    <button onClick={() => handleCopy(c.wechat, '微信号')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50transition-all" aria-label="复制微信号">
                      {copiedId === c.wechat ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
                {c.email && c.email !== "暂无" && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 group">
                    <div className="flex items-center text-sm text-slate-700 font-mono"><Mail size={14} className="mr-2 text-slate-400" /> {c.email}</div>
                    <button onClick={() => handleCopy(c.email, '邮箱')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50transition-all" aria-label="复制邮箱">
                      {copiedId === c.email ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
                {c.social && c.social !== "暂无" && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 group">
                    <div className="flex items-center text-sm text-slate-700 font-mono"><Share2 size={14} className="mr-2 text-pink-500" /> {c.social}</div>
                    <button onClick={() => handleCopy(c.social, '社交账号')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50transition-all" aria-label="复制社交账号">
                      {copiedId === c.social ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>

              {c.notes && c.notes.length > 0 && (
                <div className="bg-amber-50/40 border border-amber-100 mt-2 overflow-hidden">
                  <div 
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-amber-100/50 transition-colors"
                    onClick={() => toggleContactNotes(c.id)}
                  >
                    <span className="text-xs font-semibold text-amber-700 flex items-center">
                      <FileText size={14} className="mr-1.5"/> 联系人信息备注 ({c.notes.length}条)
                    </span>
                    <button className="text-amber-500 hover:text-amber-700 transition-colors">
                      {expandedNoteIds.includes(c.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  
                  {expandedNoteIds.includes(c.id) && (
                    <div className="px-3 pb-3 space-y-2 border-t border-amber-100/50 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                      <div className="flex justify-end mb-1">
                        <button 
                          onClick={() => {setActiveNoteContactId(c.id); setShowNoteModal(true);}} 
                          className="text-amber-600 hover:text-amber-800 font-medium bg-amber-100/50 px-2 py-1transition-colors text-xs"
                        >
                          + 追加备注
                        </button>
                      </div>
                      {c.notes.map((note) => (
                        <div key={note.id} className="text-sm text-slate-700 bg-white p-2.5 border border-amber-50 shadow-sm">
                          <div className="text-[10px] text-slate-400 mb-1 font-mono">{note.date}</div>
                          <div className="leading-relaxed whitespace-pre-wrap">{note.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(!c.notes || c.notes.length === 0) && (
                <div className="mt-1">
                  <button 
                    onClick={() => {setActiveNoteContactId(c.id); setShowNoteModal(true);}} 
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center border border-dashed border-blue-200 hover:bg-blue-50 w-full justify-center py-2 transition-colors"
                  >
                    + 添加联系人信息备注
                  </button>
                </div>
              )}

              <div className="bg-blue-50/50 p-4 border border-blue-100 mt-2">
                <div className="text-xs font-bold text-blue-800 mb-2 flex items-center">
                  <Sparkles size={12} className="mr-1" /> AI 推荐话术钩子
                </div>
                <div className="text-sm text-slate-700 bg-white p-3border border-blue-50 italic mb-3">"{c.pitch}"</div>
                <div className="text-xs font-bold text-blue-800 mb-1 flex items-center">
                  <CheckCircle2 size={12} className="mr-1" /> AI 跟进建议
                </div>
                <div className="text-sm text-slate-600">{c.aiAdvice}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. 悬浮跟进表单区
const ActionSection = ({ lead, showToast, onSaveDraft, onOpenDirectory, onSubmitSuccess }) => {
  const [actionType, setActionType] = useState('convert');
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [returnReason, setReturnReason] = useState('');
  
  const [nextPlan, setNextPlan] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = useCallback(() => {
    if (actionType === 'convert' && !nextPlan) {
      setValidationError('请选择下一步动作计划！');
      return;
    }
    setValidationError('');
    setIsOpen(false);
    onSubmitSuccess(actionType);
  }, [actionType, nextPlan, onSubmitSuccess]);

  const handleSaveDraftClick = useCallback(() => {
    if (lead) onSaveDraft(lead.id);
    showToast('💾 已暂存到草稿箱');
    setIsOpen(false);
  }, [lead, onSaveDraft, showToast]);

  const handleReturnConfirm = useCallback(() => {
    if (confirmText === '退回线索池') {
      setConfirmText('');
      setReturnReason('');
      setIsOpen(false);
      onSubmitSuccess('return');
    }
  }, [confirmText, onSubmitSuccess]);

  return (
    <>
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.08)] rounded-l-2xl bg-white border border-slate-200 border-r-0 overflow-hidden divide-y divide-slate-100 transition-transform duration-300 ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}>
        <button 
          onClick={onOpenDirectory} 
          className="p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all w-24 group"
          aria-label="线索目录"
        >
          <div className="bg-slate-50 group-hover:bg-indigo-100 p-2.5 group-hover:scale-110 transition-transform">
            <ListTodo size={22} className="text-slate-500 group-hover:text-indigo-600" />
          </div>
          <span className="text-xs font-bold text-center">线索目录</span>
        </button>

        <button 
          onClick={() => { setActionType('convert'); setValidationError(''); setIsOpen(true); }} 
          className="p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all w-24 group"
          aria-label="填写跟进"
        >
          <div className="bg-slate-50 group-hover:bg-blue-100 p-2.5 group-hover:scale-110 transition-transform">
            <Briefcase size={22} className="text-slate-500 group-hover:text-blue-600" />
          </div>
          <span className="text-xs font-bold text-center">填写跟进</span>
        </button>
        
        <button 
          onClick={() => { setActionType('invalid'); setValidationError(''); setIsOpen(true); }} 
          className="p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all w-24 group"
          aria-label="线索无效"
        >
          <div className="bg-slate-50 group-hover:bg-orange-100 p-2.5 group-hover:scale-110 transition-transform">
            <AlertCircle size={22} className="text-slate-500 group-hover:text-orange-600" />
          </div>
          <span className="text-xs font-bold text-center">线索无效</span>
        </button>
        
        <button 
          onClick={() => { setActionType('return'); setConfirmText(''); setReturnReason(''); setIsOpen(true); }} 
          className="p-4 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all w-24 group"
          aria-label="退回线索池"
        >
          <div className="bg-slate-50 group-hover:bg-red-100 p-2.5 group-hover:scale-110 transition-transform">
            <CornerUpLeft size={22} className="text-slate-500 group-hover:text-red-600" />
          </div>
          <span className="text-xs font-bold text-center">退回线索池</span>
        </button>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[140] transition-opacity animate-in fade-in duration-200" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className={`fixed top-0 right-0 h-full w-[480px] sm:w-[540px] bg-white shadow-2xl z-[150] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className={`bg-gradient-to-r ${actionType === 'convert' ? 'from-blue-600 to-indigo-600' : actionType === 'invalid' ? 'from-orange-500 to-red-500' : 'from-red-600 to-rose-600'} p-5 text-white flex justify-between items-center flex-shrink-0`}>
          <h2 className="text-lg font-bold flex items-center">
            {actionType === 'convert' ? <><Briefcase size={20} className="mr-2" /> 填写跟进记录</> : actionType === 'invalid' ? <><AlertCircle size={20} className="mr-2" /> 标记线索无效</> : <><CornerUpLeft size={20} className="mr-2" /> 退回线索池</>}
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 transition-colors" aria-label="关闭"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 custom-scrollbar">
          
          {actionType === 'invalid' ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">无效原因 <span className="text-red-500">*</span></label>
                  <select className="w-full border border-slate-300 p-3 text-sm bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                    <option value="">请选择原因...</option>
                    <option value="1">联系方式全部错误/空号</option>
                    <option value="2">公司已倒闭/注销</option>
                    <option value="3">非目标客户（无需求）</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">详细备注说明</label>
                  <textarea rows={5} className="w-full border border-slate-300 p-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-none" placeholder="输入补充说明..."></textarea>
                </div>
              </div>
            </div>
          ) : actionType === 'return' ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-700 font-medium flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    确认后线索将退回至线索池，请谨慎操作
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">为防止误操作，请输入确认文本 <span className="text-red-500">*</span></label>
                  <div className="bg-slate-50 p-4 border border-slate-200 mb-3">
                    <label className="block text-xs font-bold text-slate-700 mb-2">请输入：<span className="text-red-600 select-none font-mono bg-red-100/50 px-1.5 py-0.5border border-red-200">退回线索池</span></label>
                    <input 
                      type="text" 
                      value={confirmText} 
                      onChange={(e) => setConfirmText(e.target.value)} 
                      placeholder="请输入：退回线索池" 
                      className="w-full border border-slate-300 p-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">退回原因</label>
                  <textarea 
                    rows={5} 
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full border border-slate-300 p-3 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none resize-none" 
                    placeholder="请说明线索退回原因，如：客户表示近期不需要，暂时不考虑..."
                  ></textarea>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-6">
                
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center"><MessageCircle size={16} className="mr-1.5 text-blue-500"/> 核心跟进信息</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">对接联系人 <span className="text-red-500">*</span></label>
                      <select className="w-full border border-slate-300 p-2.5 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                        <option value="">必填：请选择联系人</option>
                        <option>王总 (CTO)</option>
                        <option>刘经理 (采购)</option>
                        <option>张总监 (IT部)</option>
                        <option>李经理 (业务侧)</option>
                        <option>其他联系人</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">沟通纪要 / 跟进详情 <span className="text-red-500">*</span></label>
                      <textarea rows={4} className="w-full border border-slate-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none" placeholder="例如：今天下午与张总通话，对方对AI模块感兴趣..."></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        上传凭证 <span className="text-slate-400 font-normal ml-1 text-xs">(选填)</span>
                      </label>
                      <div className="border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group">
                        <UploadCloud size={28} className="text-slate-400 group-hover:text-blue-500" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600">点击或拖拽文件上传</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                    <PieChart size={16} className="mr-1.5 text-blue-500"/> 
                    客户画像补充 
                    <span className="text-[10px] font-normal text-slate-400 ml-2 bg-slate-100 px-1.5 py-0.5border border-slate-200">预留扩展区</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">预计采购时间</label>
                      <select className="w-full border border-slate-300 p-2.5 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                        <option>请选择...</option>
                        <option>本月内</option>
                        <option>本季度内</option>
                        <option>半年内</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">预估预算规模</label>
                      <select className="w-full border border-slate-300 p-2.5 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                        <option>请选择...</option>
                        <option>5万以下</option>
                        <option>5-10万</option>
                        <option>10万以上</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <div className={`p-4 border flex flex-col gap-3 transition-colors ${validationError ? 'bg-red-50 border-red-300' : 'bg-blue-50/70 border-blue-100'}`}>
                    <label className={`text-sm font-bold flex items-center ${validationError ? 'text-red-700' : 'text-blue-800'}`}>
                      <Calendar size={16} className="mr-1.5" />下一步动作计划
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select 
                      value={nextPlan}
                      onChange={(e) => {setNextPlan(e.target.value); setValidationError('');}}
                      className={`w-full border p-3 text-sm bg-white outline-none focus:ring-2 shadow-sm ${validationError ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-blue-200 focus:border-blue-500 focus:ring-blue-100 text-slate-700'}`}
                    >
                      <option value="">必填：请选择计划</option>
                      <option value="demo">预约产品演示 (Demo)</option>
                      <option value="quote">发送报价单</option>
                      <option value="visit">线下拜访</option>
                    </select>
                    {validationError && (
                      <span className="text-xs text-red-600 font-medium flex items-center animate-in slide-in-from-top-1">
                        <AlertCircle size={12} className="mr-1" /> {validationError}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
          {actionType === 'return' ? (
            <>
              <button onClick={() => {setIsOpen(false); setConfirmText(''); setReturnReason('');}} className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button 
                disabled={confirmText !== '退回线索池'} 
                onClick={handleReturnConfirm}
                className={`px-8 py-2.5 text-sm font-bold text-white shadow-lg transition-all ${confirmText === '退回线索池' ? 'bg-red-600 hover:bg-red-700 shadow-red-200/50 hover:-translate-y-0.5' : 'bg-red-300 cursor-not-allowed opacity-70'}`}
              >
                执行退回
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSaveDraftClick} className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
                暂存草稿
              </button>
              <button onClick={handleSubmit} className={`px-8 py-2.5 text-sm font-bold text-white shadow-lg transition-all ${actionType === 'convert' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200/50' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200/50'}`}>
                提交 / 下一条
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// 主应用入口
/**
 * AITuigke.jsx
 * AI 推客模块
 * 提供逐条线索跟进流程，包含安排话术、公司信息展示、联系人管理、跟进历史及提交操作等功能。
 * 内部自管 Toast 状态，不依赖父组件 showToast 回调。
 */

export default function AITuigkeApp({ userRole = 'manager' }) {
  const [leads, setLeads] = useState(initialLeads);
  const [currentLeadId, setCurrentLeadId] = useState(initialLeads[0].id);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  /** 显示 Toast 提示
   * @param {string} msg - 提示内容
   * @param {'success'|'error'|'loading'} [type='success'] - 提示类型
   */
  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  }, []);
  
  const currentLead = useMemo(() => leads.find(l => l.id === currentLeadId), [leads, currentLeadId]);

  /** 将指定线索标记为草稿状态
   * @param {string} id - 线索 ID
   */
  const handleSaveDraft = useCallback((id) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'draft' } : l));
  }, []);

  /** 向指定线索添加一条跟进历史记录
   * @param {string} leadId - 线索 ID
   * @param {Object} record - 历史记录对象
   */
  const handleAddHistoryRecord = useCallback((leadId, record) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, history: [record, ...(l.history || [])] };
      }
      return l;
    }));
  }, []);

  /** 向指定线索添加公司备注
   * @param {string} leadId - 线索 ID
   * @param {string} text - 备注内容
   * @param {string} dateStr - 备注日期字符串
   */
  const handleAddCompanyNote = useCallback((leadId, text, dateStr) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, companyNotes: [...(l.companyNotes || []), { id: Date.now(), text, date: dateStr }] };
      }
      return l;
    }));
  }, []);

  /** 切换当前线索，带加载动画
   * @param {string} id - 目标线索 ID
   */
  const handleSelectLeadWithLoading = useCallback((id) => {
    setIsDirectoryOpen(false);
    if (id === currentLeadId) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setCurrentLeadId(id);
      setIsLoading(false);
    }, 600);
  }, [currentLeadId]);

  /**
   * 处理线索提交成功：标记当前线索已完成，自动迟延切换到下一条待跟进线索
   * @param {'submit'|'invalid'|'return'} type - 提交类型
   */
  const handleSubmitSuccess = useCallback((type) => {
    let msg = '🎉 提交成功，正在获取下一条线索...';
    if (type === 'invalid') msg = '✅ 已标记无效，正在获取下一条线索...';
    if (type === 'return') msg = '🔄 客户已退回公海，正在重新派单...';
    
    showToast(msg, 'loading');
    setLeads(prev => prev.map(l => l.id === currentLeadId ? { ...l, status: 'completed' } : l));
    
    setIsLoading(true);
    
    setTimeout(() => {
      const nextPending = leads.find(l => l.id !== currentLeadId && l.status === 'pending');
      if (nextPending) {
        setCurrentLeadId(nextPending.id);
      }
      showToast('✨ 新的线索已就绪', 'success');
      setIsLoading(false);
    }, 1500); 
  }, [currentLeadId, leads, showToast]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-100">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <DirectoryDrawer 
        isOpen={isDirectoryOpen} 
        onClose={() => setIsDirectoryOpen(false)}
        leads={leads}
        currentLeadId={currentLeadId}
        onSelectLead={handleSelectLeadWithLoading}
      />

      <div className="flex-1 overflow-y-auto">
          
          <div className="h-full flex flex-col overflow-y-auto pb-24 custom-scrollbar bg-slate-100">
              
              {isLoading ? (
                <SkeletonLoading />
              ) : (
                <div className="max-w-[1400px] mx-auto px-6 pt-6">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" key={currentLeadId}>
                    <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-slate-500 text-sm">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-slate-700 font-medium">线索 ID: #{currentLeadId}</span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center text-slate-600 font-medium">
                          <LinkIcon size={14} className="mr-1.5 text-slate-400" />
                          线索来源：{currentLead?.source || '全网企业公开库抓取'}
                        </span>
                        {currentLead?.status === 'draft' && <span className="bg-orange-100 text-orange-600 px-2 py-0.5text-xs font-bold border border-orange-200 ml-2">草稿暂存中</span>}
                        {currentLead?.daysUncontacted > 0 && (
                          <span className={`px-2 py-0.5text-xs font-bold border ml-2 ${currentLead.daysUncontacted >= 3 ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-200 text-slate-600 border-slate-300'}`}>
                            {currentLead.daysUncontacted} 天未跟进
                          </span>
                        )}
                      </div>
                      <span className="flex items-center text-slate-400"><RefreshCw size={12} className="mr-1"/>抓取更新时间: 10分钟前</span>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                      <div className="xl:col-span-7">
                        <CompanyInfoSection 
                          lead={currentLead} 
                          showToast={showToast}
                          onAddCompanyNote={handleAddCompanyNote}
                          onAddHistoryRecord={(record) => handleAddHistoryRecord(currentLeadId, record)}
                        />
                        <FollowUpHistorySection history={currentLead?.history} />
                      </div>
                      <div className="xl:col-span-5">
                        <ContactsSection 
                          showToast={showToast} 
                          onAddHistoryRecord={(record) => handleAddHistoryRecord(currentLeadId, record)} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

        <ActionSection 
          lead={currentLead} 
          showToast={showToast} 
          onSaveDraft={handleSaveDraft} 
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          onSubmitSuccess={handleSubmitSuccess}
        />

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
      `}} />
    </div>
  );
}

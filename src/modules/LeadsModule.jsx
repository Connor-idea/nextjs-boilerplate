import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, Search, Plus, UploadCloud, Bell, ChevronLeft, FileText, Edit, Trash2, 
  Phone, Mail, Clock, Sparkles, AlertCircle, ChevronDown, ChevronUp, MessageCircle, 
  UserPlus, Info, Globe, Share2, ChevronRight, X, Check, Menu, Home, 
  UserCheck, Briefcase, User, CheckSquare, Square, CheckCircle2, Link as LinkIcon, 
  Building2, RefreshCw, PlayCircle, ShieldAlert, History, Copy, MapPin, Undo2,
  Camera, Loader2, Image as ImageIcon, ScanLine, CalendarClock, Settings2, ListChecks,
  TrendingUp, BatteryMedium, BatteryFull, BatteryLow, ShieldCheck, Wand2, Database, AlertTriangle, Filter
} from 'lucide-react';

// === 模拟企业数据库 ===
const MOCK_COMPANY_DB = [
  "北京字节跳动科技有限公司", "上海腾讯企点科技有限公司", "深圳大疆创新科技有限公司",
  "杭州阿里巴巴集团有限公司", "广州小鹏汽车科技有限公司", "北京百度网讯科技有限公司",
  "华为技术有限公司", "小米科技有限责任公司", "网易（杭州）网络有限公司"
];

// === 模拟销售人员业绩负荷数据库 (扩充至8人) ===
const MOCK_REP_PERFORMANCE = {
  '张三': { intent: 32, label: '饱和', icon: BatteryFull, color: 'text-red-600 bg-red-50 border-red-200' },
  '李四': { intent: 5, label: '空闲', icon: BatteryLow, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '王五': { intent: 18, label: '正常', icon: BatteryMedium, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  '赵六': { intent: 8, label: '空闲', icon: BatteryLow, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '刘洋': { intent: 28, label: '偏高', icon: BatteryMedium, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  '孙琦': { intent: 2, label: '空闲', icon: BatteryLow, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '周七': { intent: 15, label: '正常', icon: BatteryMedium, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  '吴八': { intent: 22, label: '偏高', icon: BatteryMedium, color: 'text-orange-700 bg-orange-50 border-orange-200' }
};

const statusColors = { 
  '新线索': 'bg-blue-50 text-blue-700 border-blue-100', 
  '退回待分配': 'bg-orange-50 text-orange-700 border-orange-100', 
  '二次分配线索': 'bg-emerald-50 text-emerald-700 border-emerald-100', 
  '三次分配线索': 'bg-purple-50 text-purple-700 border-purple-100',
  '失效线索': 'bg-slate-100 text-slate-600 border-slate-200',
  '异常线索': 'bg-rose-50 text-rose-700 border-rose-100'
};

const teamMembers = Object.keys(MOCK_REP_PERFORMANCE);

const defaultMockContacts = [
  {
    id: 1, name: "张一鸣", position: "销售副总裁 (VP of Sales)", companyName: "北京字节跳动科技有限公司",
    address: "北京市海淀区中关村大街1号", website: "www.bytedance.com",
    tags: ["推荐触达", "决策者"], tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    phones: ["138-0013-8888", "010-8888xxxx"], wechat: "zhang_sales_vp", email: "zym@company.com", social: "抖音: 商业张sir",
    pitch: "张总您好，关注到贵司近期在快速扩充销售团队。我们提供的新一代CRM能直接对接大模型，帮您的团队提升30%的人效，不知您本周四下午是否有空交流10分钟？",
    aiAdvice: "建议通过微信添加，对方在朋友圈较为活跃，喜欢分享行业报告。切入点可以是探讨AI企业服务商业化路径。",
    note: "之前沟通感觉对价格比较敏感，需要多强调我们的投入产出比(ROI)。"
  }
];

// 初始化数据
const initialLeads = [
  { id: 1, name: '林晓', company: '北京字节跳动科技有限公司', industry: '人工智能', phone: '138-0013-8000', email: 'linx@company.com', status: '二次分配线索', source: '抖音', date: '2024-02-10', owner: '张三', isSelfAdded: false, score: 99, daysUncontacted: 3, trackStatus: 'pending', contacts: defaultMockContacts, history: [], companyNote: '重点跟进二期项目', qccLastFetchedAt: Date.now() - 10 * 60 * 1000 },
  { id: 11, name: '林晓', company: '北京字节跳动科技有限公司', industry: '人工智能', phone: '138-0013-8000', email: 'linx_2@company.com', status: '新线索', source: '批量导入', date: '2024-03-10', owner: '未分配', isSelfAdded: false, score: null, daysUncontacted: 0, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
  { id: 2, name: '李娜', company: '上海腾讯企点科技有限公司', industry: '企业服务', phone: '139-1234-5678', email: 'lina@example.com', status: '新线索', source: '名片录入', date: '2024-02-26', owner: '李四', isSelfAdded: true, score: 95, daysUncontacted: 0, trackStatus: 'completed', contacts: [], history: [], companyNote: '' },
  { id: 3, name: '王强', company: '深圳大疆创新科技有限公司', industry: '智能制造', phone: '137-9876-5432', email: 'wangqiang@example.com', status: '退回待分配', source: '展会画册', date: '2023-10-20', owner: '未分配', isSelfAdded: false, score: 88, daysUncontacted: 7, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
  { id: 4, name: '赵敏', company: '杭州阿里巴巴集团有限公司', industry: '电子商务', phone: '136-1111-2222', email: 'zhaomin@example.com', status: '失效线索', source: '小红书', date: '2023-10-15', owner: '王五', isSelfAdded: true, score: 60, daysUncontacted: 15, trackStatus: 'draft', contacts: [], history: [], companyNote: '' },
  { id: 5, name: '钱伟', company: '京东集团', industry: '电子商务', phone: '131-2222-3333', email: 'qianw@example.com', status: '新线索', source: '网络搜索', date: '2024-03-01', owner: '未分配', isSelfAdded: false, score: null, daysUncontacted: 2, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
  { id: 6, name: '周杰', company: '北京百度网讯科技有限公司', industry: '人工智能', phone: '未知号码', email: 'zhoujie@example.com', status: '异常线索', source: '信息流广告', date: '2024-03-05', owner: '未分配', isSelfAdded: false, score: null, daysUncontacted: 1, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
  { id: 7, name: '刘涛', company: '华为技术有限公司', industry: '通信电子', phone: '139-6666', email: 'liutao@example.com', status: '退回待分配', source: '网络搜索', date: '2024-03-06', owner: '未分配', isSelfAdded: false, score: 92, daysUncontacted: 5, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
  { id: 8, name: '吴磊', company: '小米科技有限责任公司', industry: '智能硬件', phone: '131-5555-4444', email: 'wulei@example.com', status: '三次分配线索', source: '批量导入', date: '2024-03-07', owner: '张三', isSelfAdded: false, score: 78, daysUncontacted: 0, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
  { id: 9, name: '陈晨', company: '网易（杭州）网络有限公司', industry: '游戏开发', phone: '138-1111-2222', email: 'chenchen@example.com', status: '新线索', source: '名片', date: '2024-03-08', owner: '未分配', isSelfAdded: false, score: 82, daysUncontacted: 0, trackStatus: 'pending', contacts: [], history: [], companyNote: '' },
];

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <CheckCircle2 size={48} className="mb-4 text-emerald-400 opacity-50" />
    <p className="font-bold">{text}</p>
  </div>
);

// === 全局 Toast 组件 ===
const Toast = ({ message, type = 'success' }) => {
  if (!message) return null;
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-3.5 shadow-lg border font-medium text-sm ${type === 'success' ? 'bg-white text-emerald-700 border-emerald-100' : 'bg-white text-red-700 border-red-100'}`}>
        {type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-red-500" />}
        {message}
      </div>
    </div>
  );
};

// === 辅助组件：公司联想输入 ===
function CompanyAutocomplete({ value, onChange, className, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.trim()) {
      setSuggestions(MOCK_COMPANY_DB.filter(c => c.toLowerCase().includes(val.toLowerCase())));
      setIsOpen(true);
    } else setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <input 
        type="text" value={value} onChange={handleInputChange} 
        onFocus={() => value && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={className} placeholder={placeholder || "请输入公司全称..."} autoComplete="off" 
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 shadow-xl max-h-48 overflow-auto py-2">
          {suggestions.map((c, i) => (
            <li key={i} onMouseDown={() => { onChange(c); setIsOpen(false); }} className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-2">
              <Building2 size={14} className="text-slate-400" /> {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// === 主程序组件 ===
export default function LeadsModule({ userRole, showToast, onSystemNotify, onNavigateToAIAssign }) {
  const [currentView, setCurrentView] = useState('list');
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingCleanupCount, setPendingCleanupCount] = useState(0);
  const currentUserName = '张三';
  
  const [autoAssignConfig, setAutoAssignConfig] = useState({
    enabled: true, mode: 'smart', time: '09:00', limitPerRep: 5, reps: ['张三', '李四', '王五', '孙琦']
  });
  const [assignLogs, setAssignLogs] = useState([
    { id: 101, date: '2024-04-07 09:00:00', type: '智能负载均衡', total: 17, details: '李四(10), 孙琦(5), 王五(2), 张三(0)', status: '成功', assignments: [] }
  ]);
  
  // Calculate pending cleanup items (duplicates + invalids)
  const calculatePendingCount = (leadList) => {
    const grouped = leadList.reduce((acc, curr) => {
      const key = `${curr.company}_${curr.name}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
    const duplicateCount = Object.values(grouped).filter(items => items.length > 1).length;
    
    const invalidCount = leadList.filter((l) => {
      if (!l.phone) return true;
      const purePhone = l.phone.replace(/-/g, '');
      return purePhone.length < 8 || /[a-zA-Z\u4e00-\u9fa5]/.test(purePhone);
    }).length;
    
    return duplicateCount + invalidCount;
  };
  
  const handleAutoAssignClick = () => setCurrentView('autoAssign');

  // Initialize pending cleanup count on load
  useEffect(() => {
    setPendingCleanupCount(calculatePendingCount(leads));
  }, []);

  const parseReasonPayload = (reasonInput) => {
    if (!reasonInput) {
      return { category: '主管业务调整', note: '', text: '主管业务调整' };
    }
    if (typeof reasonInput === 'string') {
      const text = reasonInput.trim() || '主管业务调整';
      return { category: text, note: '', text };
    }
    const category = (reasonInput.category || '').trim() || '主管业务调整';
    const note = (reasonInput.note || '').trim();
    const text = note ? `${category}（补充：${note}）` : category;
    return { category, note, text };
  };

  const notifyLeadReassigned = ({ leadName, company, fromOwner, toOwner, reason }) => {
    const parsedReason = parseReasonPayload(reason);
    const reasonText = parsedReason.text;
    onSystemNotify?.({
      type: 'lead-reassign',
      targetUser: fromOwner,
      title: '线索改派通知（发出）',
      message: `线索「${leadName} / ${company}」已由你移交给 ${toOwner}。原因：${reasonText}`
    });
    onSystemNotify?.({
      type: 'lead-reassign',
      targetUser: toOwner,
      title: '线索改派通知（接收）',
      message: `你已接收线索「${leadName} / ${company}」，来源负责人：${fromOwner}。原因：${reasonText}`
    });
  };

  const handleAddLead = (newLeadData) => {
    const defaultContact = {
       id: Date.now() + 1, name: newLeadData.name, position: newLeadData.position, companyName: newLeadData.companyName,
       phones: newLeadData.phone ? [newLeadData.phone] : [],
       wechat: newLeadData.wechat || '暂无', email: newLeadData.email || '暂无', social: newLeadData.social || '暂无', note: newLeadData.contactNote,
       tags: ["手工录入"], tagColor: "bg-blue-50 text-blue-700 border-blue-100", pitch: "新录入客户，暂无AI分析话术。", aiAdvice: "建议尽快破冰沟通补充画像。"
    };
    const lead = { 
      ...newLeadData, 
      id: Date.now(), 
      date: new Date().toISOString().split('T')[0], 
      company: newLeadData.companyName || '未知公司',
      status: '新线索', owner: currentUserName, isSelfAdded: true,
      score: 80, daysUncontacted: 0, trackStatus: 'pending', companyNote: newLeadData.companyNote || '', contacts: [defaultContact], history: [] 
    };
    const nextLeads = [lead, ...leads];
    setLeads(nextLeads);
    setPendingCleanupCount(calculatePendingCount(nextLeads));
    setCurrentView('list');
    showToast('✅ 线索已成功录入');
  };

  const handleBatchOcrAddLeads = (parsedLeads) => {
    const formatted = parsedLeads.map((l, index) => {
      const defaultContact = {
         id: Date.now() + index + 100, name: l.name, position: l.position, companyName: l.company,
         phones: l.phone ? [l.phone] : [], wechat: l.wechat || '暂无', email: l.email || '暂无', social: '暂无', note: '',
         tags: ["名片批量提取"], tagColor: "bg-blue-50 text-blue-700 border-blue-100", pitch: "批量名片录入客户。", aiAdvice: "建议尽快核对信息并跟进。"
      };
      return {
        id: Date.now() + index, date: new Date().toISOString().split('T')[0], 
        name: l.name, company: l.company, industry: l.industry || '未知行业', phone: l.phone, email: l.email, source: '展会名片批量扫描', owner: currentUserName, isSelfAdded: true,
        status: '新线索', score: 80 + Math.floor(Math.random() * 15), daysUncontacted: 0, trackStatus: 'pending', companyNote: '', contacts: [defaultContact], history: [] 
      };
    });
    const nextLeads = [...formatted, ...leads];
    setLeads(nextLeads);
    setPendingCleanupCount(calculatePendingCount(nextLeads));
    setCurrentView('list');
    showToast(`✅ 成功批量录入 ${formatted.length} 张名片线索`);
  };

  const handleReturnToPool = (id) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, owner: '未分配', status: '退回待分配', isSelfAdded: false } : l);
    setLeads(updatedLeads);
    if (selectedLead?.id === id) setSelectedLead(updatedLeads.find(x => x.id === id));
    showToast('🔄 线索已退回到线索池');
  };

  const handleUpdateLead = (updated) => { 
    setLeads(leads.map(l => l.id === updated.id ? updated : l)); setSelectedLead(updated); showToast('✅ 信息更新成功');
  };

  const handleAssign = (idsOrAssignments, ownerOrNull, reason = { category: '主管业务调整', note: '' }) => {
    let assignedData = [];
    const reassignNotices = [];
    const operationTime = new Date().toLocaleString();
    const reasonPayload = parseReasonPayload(reason);

    const appendAssignHistory = (lead, fromOwner, toOwner, assignReason) => {
      const actionType = fromOwner && fromOwner !== '未分配' && fromOwner !== toOwner ? '改派' : '分配';
      return [
        ...(lead.history || []),
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          type: actionType,
          time: operationTime,
          from: fromOwner || '未分配',
          to: toOwner,
          reason: actionType === '改派' ? assignReason.text : '首次分配',
          reasonCategory: actionType === '改派' ? assignReason.category : '首次分配',
          reasonNote: actionType === '改派' ? assignReason.note : ''
        }
      ];
    };

    if (Array.isArray(idsOrAssignments) && typeof idsOrAssignments[0] === 'object') {
      const assignments = idsOrAssignments;
      setLeads(leads.map(l => {
        const match = assignments.find(a => a.id === l.id);
        if (match) {
          const previousOwner = l.owner;
          const isReassign = previousOwner && previousOwner !== '未分配' && previousOwner !== match.owner;
          const finalReason = isReassign ? reasonPayload : { category: '首次分配', note: '', text: '首次分配' };
          if (isReassign) {
            reassignNotices.push({ leadName: l.name, company: l.company, fromOwner: previousOwner, toOwner: match.owner, reason: finalReason });
          }
          assignedData.push({ id: l.id, from: previousOwner || '未分配', to: match.owner, name: l.name, company: l.company, industry: l.industry || '未知行业', reason: finalReason.text, reasonCategory: finalReason.category, reasonNote: finalReason.note, time: operationTime });
          return {
            ...l,
            owner: match.owner,
            status: l.status === '新线索' ? '二次分配线索' : l.status,
            isSelfAdded: false,
            history: appendAssignHistory(l, previousOwner, match.owner, finalReason)
          };
        }
        return l;
      }));
      const detailsMap = {};
      assignments.forEach(a => { detailsMap[a.owner] = (detailsMap[a.owner] || 0) + 1; });
      const detailStr = Object.entries(detailsMap).map(([k,v]) => `${k}(${v})`).join(', ');
      setAssignLogs([{ id: Date.now(), date: operationTime, type: '主管 AI 智能分配', total: assignments.length, details: detailStr, status: '成功', reason: reasonPayload.text, reasonCategory: reasonPayload.category, reasonNote: reasonPayload.note, assignments: assignedData }, ...assignLogs]);
      reassignNotices.forEach(notifyLeadReassigned);
      showToast('✅ AI 智能分配已生效');
    } else {
      setLeads(leads.map(l => {
        if (idsOrAssignments.includes(l.id)) {
          const previousOwner = l.owner;
          const isReassign = previousOwner && previousOwner !== '未分配' && previousOwner !== ownerOrNull;
          const finalReason = isReassign ? reasonPayload : { category: '首次分配', note: '', text: '首次分配' };
          if (isReassign) {
            reassignNotices.push({ leadName: l.name, company: l.company, fromOwner: previousOwner, toOwner: ownerOrNull, reason: finalReason });
          }
          assignedData.push({ id: l.id, from: previousOwner || '未分配', to: ownerOrNull, name: l.name, company: l.company, industry: l.industry || '未知行业', reason: finalReason.text, reasonCategory: finalReason.category, reasonNote: finalReason.note, time: operationTime });
          return {
            ...l,
            owner: ownerOrNull,
            status: l.status === '新线索' ? '二次分配线索' : l.status,
            isSelfAdded: false,
            history: appendAssignHistory(l, previousOwner, ownerOrNull, finalReason)
          };
        }
        return l;
      }));
      setAssignLogs([{ id: Date.now(), date: operationTime, type: '主管手动分配', total: idsOrAssignments.length, details: `${ownerOrNull}(${idsOrAssignments.length})`, status: '成功', reason: reasonPayload.text, reasonCategory: reasonPayload.category, reasonNote: reasonPayload.note, assignments: assignedData }, ...assignLogs]);
      reassignNotices.forEach(notifyLeadReassigned);
      showToast(`✅ 已成功分配给 ${ownerOrNull}`);
    }
  };

  const handleRevokeAssign = (logId) => {
    const log = assignLogs.find(l => l.id === logId);
    if (!log || log.status === '已撤回') return;

    const leadIdsToRevoke = (log.assignments || []).map(a => a.id);
    setLeads(prevLeads => prevLeads.map(l => leadIdsToRevoke.includes(l.id) ? { ...l, owner: '未分配', status: '退回待分配', isSelfAdded: false } : l));
    setAssignLogs(prevLogs => prevLogs.map(l => l.id === logId ? { ...l, status: '已撤回' } : l));
    showToast('✅ 派发已成功撤回，线索已返回线索池');
  };

  const handleSimulateAutoAssign = () => {
    const unassignedLeads = leads.filter(l => l.owner === '未分配' && l.status !== '失效线索' && l.status !== '异常线索');
    if (unassignedLeads.length === 0) return showToast('❌ 当前线索池中没有可分配的有效线索', 'error');
    if (autoAssignConfig.reps.length === 0) return showToast('❌ 请至少选择一名接收线索的销售', 'error');

    let leadIndex = 0;
    let assignDetails = [];
    let totalAssigned = 0;
    let updatedLeads = [...leads];
    let assignedData = [];

    for (const rep of autoAssignConfig.reps) {
      let dynamicLimit = autoAssignConfig.limitPerRep;
      
      if (autoAssignConfig.mode === 'smart') {
         const workload = MOCK_REP_PERFORMANCE[rep]?.intent || 0;
         if (workload >= 30) dynamicLimit = 1; 
         else if (workload >= 20) dynamicLimit = 3; 
         else if (workload >= 10) dynamicLimit = 6; 
         else dynamicLimit = 15; 
      }

      let assignedToRep = 0;
      while (assignedToRep < dynamicLimit && leadIndex < unassignedLeads.length) {
        const leadToUpdate = unassignedLeads[leadIndex];
        updatedLeads = updatedLeads.map(l => l.id === leadToUpdate.id ? { ...l, owner: rep, status: '二次分配线索' } : l);
        assignedData.push({ id: leadToUpdate.id, to: rep, name: leadToUpdate.name, company: leadToUpdate.company, industry: leadToUpdate.industry || '未知行业' });
        assignedToRep++;
        totalAssigned++;
        leadIndex++;
      }
      if (assignedToRep > 0) assignDetails.push(`${rep}(${assignedToRep})`);
    }

    if (totalAssigned > 0) {
      setLeads(updatedLeads);
      const newLog = {
        id: Date.now(), date: new Date().toLocaleString(), 
        type: autoAssignConfig.mode === 'smart' ? '智能负载均衡' : '固定定时分配', 
        total: totalAssigned, details: assignDetails.join(', '), status: '成功', assignments: assignedData
      };
      setAssignLogs([newLog, ...assignLogs]);
      showToast(`✅ 成功模拟执行分配策略，共派发 ${totalAssigned} 条线索`);
    } else {
      showToast('❌ 当前销售的分配限额已满或没有足够线索', 'error');
    }
  };

  const handleBatchDelete = (ids) => {
    setLeads(leads.filter(l => !ids.includes(l.id)));
    if (selectedLead && ids.includes(selectedLead.id)) { setCurrentView('list'); setSelectedLead(null); }
    showToast(`✅ 成功删除 ${ids.length} 条线索`);
  };

  const handleBatchImport = (importedLeads) => {
    const formatted = importedLeads.map((l, index) => ({
      ...l,
      company: l.company || l.companyName || '未知公司',
      id: Date.now() + index,
      date: new Date().toISOString().split('T')[0],
      status: '新线索',
      source: '批量导入',
      industry: l.industry || '未知行业',
      history: [],
      owner: '未分配',
      score: 80,
      daysUncontacted: 0,
      trackStatus: 'pending',
      companyNote: '',
      contacts: [],
      isSelfAdded: false
    }));
    setLeads([...formatted, ...leads]); setCurrentView('list'); showToast('✅ 线索批量导入成功');
  };

  const filteredLeads = leads.filter(l => userRole === 'manager' ? true : (l.owner === currentUserName || l.owner === '未分配'));

  return (
    <div className="w-full overflow-y-auto custom-scrollbar p-6 md:p-8 bg-[#F8FAFD]">
      <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300">
        {currentView === 'list' && (
          <LeadListView 
            allLeads={leads} setAllLeads={setLeads}
            leads={filteredLeads} userRole={userRole} teamMembers={teamMembers} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onAdd={() => setCurrentView('add')} onImport={() => setCurrentView('import')} onBatchOcr={() => setCurrentView('batchOcr')}
            onDataClean={() => setCurrentView('dataClean')} onAutoAssign={handleAutoAssignClick}
            onDetail={(l, edit) => { setSelectedLead(l); setIsEditMode(edit); setCurrentView('detail'); }} 
            onAssign={handleAssign} onReturn={handleReturnToPool} onBatchDelete={handleBatchDelete} showToast={showToast}
            autoAssignConfig={autoAssignConfig} setAutoAssignConfig={setAutoAssignConfig} 
            assignLogs={assignLogs} handleSimulateAutoAssign={handleSimulateAutoAssign} handleRevokeAssign={handleRevokeAssign}
            pendingCleanupCount={pendingCleanupCount}
            onAIAssign={onNavigateToAIAssign}
          />
        )}
        {currentView === 'add' && <AddLeadView onCancel={() => setCurrentView('list')} onSave={handleAddLead} showToast={showToast} />}
        {currentView === 'import' && <ImportLeadView onCancel={() => setCurrentView('list')} onConfirm={handleBatchImport} onPartialImport={(importedLeads) => { const formatted = importedLeads.map((l, index) => ({ ...l, company: l.company || l.companyName || '未知公司', id: Date.now() + index, date: new Date().toISOString().split('T')[0], status: '新线索', source: '批量导入', industry: l.industry || '未知行业', history: [], owner: '未分配', score: 80, daysUncontacted: 0, trackStatus: 'pending', companyNote: '', contacts: [], isSelfAdded: false })); setLeads(prev => [...formatted, ...prev]); }} showToast={showToast} existingLeads={leads} />}
        {currentView === 'batchOcr' && <BatchOcrView onCancel={() => setCurrentView('list')} onSaveBatch={handleBatchOcrAddLeads} showToast={showToast} />}
        {currentView === 'dataClean' && <DataCleaningModal leads={leads} setLeads={setLeads} showToast={showToast} onClose={() => setCurrentView('list')} />}
        {currentView === 'autoAssign' && <AutoAssignView onClose={() => setCurrentView('list')} autoAssignConfig={autoAssignConfig} setAutoAssignConfig={setAutoAssignConfig} assignLogs={assignLogs} handleSimulateAutoAssign={handleSimulateAutoAssign} handleRevokeAssign={handleRevokeAssign} leads={leads} teamMembers={teamMembers} showToast={showToast} />}
        {currentView === 'detail' && selectedLead && (
          <LeadDetailView lead={selectedLead} isEdit={isEditMode} setIsEdit={setIsEditMode} userRole={userRole} onBack={() => setCurrentView('list')} onSave={handleUpdateLead} onReturn={handleReturnToPool} showToast={showToast} leads={leads} setLeads={setLeads} setSelectedLead={setSelectedLead} />
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 2px solid #F8FAFD; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />
    </div>
  );
}

// === 视图 1：线索列表 ===
function LeadListView({ allLeads, setAllLeads, leads, userRole, teamMembers, searchQuery, setSearchQuery, onAdd, onImport, onBatchOcr, onDataClean, onAutoAssign, onDetail, onAssign, onReturn, onBatchDelete, showToast, autoAssignConfig, setAutoAssignConfig, assignLogs, handleSimulateAutoAssign, handleRevokeAssign, pendingCleanupCount, onAIAssign }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTo, setAssignTo] = useState(teamMembers[0] || '');
  const [reassignReasonCategory, setReassignReasonCategory] = useState('');
  const [reassignReasonNote, setReassignReasonNote] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [jumpPage, setJumpPage] = useState('');

  const [showAIAssignModal, setShowAIAssignModal] = useState(false);
  const [aiAssignPreview, setAiAssignPreview] = useState([]);
  const [revokeConfirmLog, setRevokeConfirmLog] = useState(null);

  // 高级筛选状态 (默认常驻展示，无下拉框)
  const [filterOwner, setFilterOwner] = useState([]);
  const [filterIndustry, setFilterIndustry] = useState([]);
  const [filterSource, setFilterSource] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  
  const filterOptions = {
    industries: ['人工智能', '企业服务', '智能制造', '电子商务', '通信电子', '游戏开发'],
    sources: ['名片录入', '批量导入', '小红书', '抖音', '名片', '展会画册', '网络搜索', '信息流广告'],
    statuses: ['新线索', '退回待分配', '失效线索', '二次分配线索', '三次分配线索', '异常线索']
  };

  const displayLeads = leads.filter(l => 
    (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.company.toLowerCase().includes(searchQuery.toLowerCase())) && 
    (filterOwner.length === 0 || filterOwner.includes(l.owner)) &&
    (filterIndustry.length === 0 || filterIndustry.includes(l.industry)) &&
    (filterSource.length === 0 || filterSource.some(s => l.source.includes(s))) &&
    (filterStatus.length === 0 || filterStatus.includes(l.status))
  );

  useEffect(() => { setCurrentPage(1); setSelectedIds([]); }, [searchQuery, filterOwner, userRole, filterIndustry, filterSource, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(displayLeads.length / itemsPerPage));
  const paginatedLeads = displayLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isAllSelected = displayLeads.length > 0 && selectedIds.length === displayLeads.length;
  const isCurrentPageSelected = paginatedLeads.length > 0 && paginatedLeads.every(l => selectedIds.includes(l.id));

  const handleSelectAllToggle = () => { isAllSelected ? setSelectedIds([]) : setSelectedIds(displayLeads.map(l => l.id)); };
  const handlePageSelectToggle = () => {
    if (isCurrentPageSelected) {
      const pageIds = paginatedLeads.map(l => l.id);
      setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)));
    } else {
      const newIds = new Set([...selectedIds, ...paginatedLeads.map(l => l.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };
  const handleInvertSelection = () => {
    const allIds = displayLeads.map(l => l.id);
    setSelectedIds(allIds.filter(id => !selectedIds.includes(id)));
  };
  const toggleSelection = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const selectedLeadRecords = leads.filter((l) => selectedIds.includes(l.id));
  const reassignedLeads = selectedLeadRecords.filter((l) => l.owner && l.owner !== '未分配' && l.owner !== assignTo);
  const requiresReassignReason = reassignedLeads.length > 0;

  const openAssignModal = (ids) => {
    setSelectedIds(ids);
    setAssignTo(teamMembers[0] || '');
    setReassignReasonCategory('');
    setReassignReasonNote('');
    setShowAssignModal(true);
  };

  const confirmManualAssign = () => {
    if (!assignTo) {
      showToast('❌ 请选择要分配给的销售人员', 'error');
      return;
    }
    if (requiresReassignReason && !reassignReasonCategory.trim()) {
      showToast('❌ 检测到改派场景，请先选择改派原因模板', 'error');
      return;
    }

    onAssign(
      selectedIds,
      assignTo,
      requiresReassignReason
        ? { category: reassignReasonCategory.trim(), note: reassignReasonNote.trim() }
        : { category: '主管分配', note: '' }
    );
    setShowAssignModal(false);
    setSelectedIds([]);
    setReassignReasonCategory('');
    setReassignReasonNote('');
  };

  const handleOpenAIAssign = () => {
    if (selectedIds.length === 0) {
      return showToast('❌ 请选择至少一条线索进行AI智能分配', 'error');
    }
    const selectedLeads = displayLeads.filter(l => selectedIds.includes(l.id));
    onAIAssign(selectedLeads);
    setSelectedIds([]);
  };

  const handlePreviewOwnerChange = (leadId, newOwner) => {
    setAiAssignPreview(prev => prev.map(item => item.id === leadId ? { ...item, owner: newOwner } : item));
  };

  const confirmAIAssign = () => {
    if (aiAssignPreview.length === 0) {
      return showToast('❌ 当前没有可确认的AI分配预览', 'error');
    }
    onAssign(aiAssignPreview, null);
    setShowAIAssignModal(false);
    setSelectedIds([]);
  };

  const openRevokeConfirm = (log) => {
    setRevokeConfirmLog(log);
  };

  const confirmRevokeAssign = () => {
    if (!revokeConfirmLog) return;
    handleRevokeAssign(revokeConfirmLog.id);
    setRevokeConfirmLog(null);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300">
      
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-2xl font-bold text-slate-800">销售线索管理列表</h2>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 pb-5 gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button onClick={onBatchOcr} className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-1.5">
              <ScanLine size={16} /> 名片识别
            </button>
            {userRole === 'manager' && (
              <>
                <button onClick={onImport} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5">
                  <UploadCloud size={16} /> 批量导入
                </button>
                <button onClick={onDataClean} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5 relative">
                  <ShieldCheck size={16} className="text-indigo-600" /> 数据清洗
                  {pendingCleanupCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{pendingCleanupCount}</span>
                  )}
                </button>
                <button onClick={onAutoAssign} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5">
                  <CalendarClock size={16} className="text-indigo-600" /> 自动分配策略
                </button>
              </>
            )}
            <button onClick={onAdd} className="bg-blue-600 text-white px-5 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 shadow-sm transition-colors">
              <Plus size={16} /> 录入新线索
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="检索联系人或公司..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm w-full lg:w-60 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
        </div>

        {/* 高级筛选多行面板 (常驻展开，无动画) */}
        <div className="px-6 py-2 bg-slate-50/50 border-y border-slate-100">
          {/* 负责人筛选 (仅主管可见) */}
          {userRole === 'manager' && (
            <div className="flex items-start gap-4 py-3 border-b border-slate-100/80">
              <div className="text-sm font-bold text-slate-700 w-16 shrink-0 pt-1">当前负责人</div>
              <div className="flex flex-wrap gap-2 flex-1">
                <button onClick={() => setFilterOwner([])} className={`px-3 py-1 text-xs font-medium transition-all ${filterOwner.length === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>不限</button>
                <button onClick={() => setFilterOwner(prev => prev.includes('未分配') ? prev.filter(x => x !== '未分配') : [...prev, '未分配'])} className={`px-3 py-1 text-xs font-medium transition-all ${filterOwner.includes('未分配') ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>未分配</button>
                {teamMembers.map(opt => (
                  <button key={opt} onClick={() => setFilterOwner(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])} className={`px-3 py-1 text-xs font-medium transition-all ${filterOwner.includes(opt) ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
                ))}
              </div>
            </div>
          )}
          {/* 行业筛选 */}
          <div className="flex items-start gap-4 py-3 border-b border-slate-100/80">
            <div className="text-sm font-bold text-slate-700 w-16 shrink-0 pt-1">行业</div>
            <div className="flex flex-wrap gap-2 flex-1">
              <button onClick={() => setFilterIndustry([])} className={`px-3 py-1 text-xs font-medium transition-all ${filterIndustry.length === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>不限</button>
              {filterOptions.industries.map(opt => (
                <button key={opt} onClick={() => setFilterIndustry(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])} className={`px-3 py-1 text-xs font-medium transition-all ${filterIndustry.includes(opt) ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
              ))}
            </div>
          </div>
          {/* 线索来源筛选 */}
          <div className="flex items-start gap-4 py-3 border-b border-slate-100/80">
            <div className="text-sm font-bold text-slate-700 w-16 shrink-0 pt-1">来源</div>
            <div className="flex flex-wrap gap-2 flex-1">
              <button onClick={() => setFilterSource([])} className={`px-3 py-1 text-xs font-medium transition-all ${filterSource.length === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>不限</button>
              {filterOptions.sources.map(opt => (
                <button key={opt} onClick={() => setFilterSource(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])} className={`px-3 py-1 text-xs font-medium transition-all ${filterSource.includes(opt) ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
              ))}
            </div>
          </div>
          {/* 线索状态筛选 */}
          <div className="flex items-start gap-4 py-3">
            <div className="text-sm font-bold text-slate-700 w-16 shrink-0 pt-1">状态</div>
            <div className="flex flex-wrap gap-2 flex-1">
              <button onClick={() => setFilterStatus([])} className={`px-3 py-1 text-xs font-medium transition-all ${filterStatus.length === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>不限</button>
              {filterOptions.statuses.map(opt => (
                <button key={opt} onClick={() => setFilterStatus(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])} className={`px-3 py-1 text-xs font-medium transition-all ${filterStatus.includes(opt) ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        {userRole === 'manager' && (
          <div className={`flex items-center gap-3 px-6 py-3 bg-slate-50/80 border-b border-slate-100 transition-opacity ${selectedIds.length > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
            <span className="text-xs text-slate-500 font-semibold mr-2">已选中 <span className="text-blue-600">{selectedIds.length}</span> 项</span>
            <button onClick={handleOpenAIAssign} className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 text-xs font-medium hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors shadow-sm">AI智能分配</button>
            <button onClick={() => openAssignModal(selectedIds)} className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-sm">批量分配/改派</button>
            <button onClick={() => { setDeleteTargetIds(selectedIds); setShowDeleteModal(true); }} className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 text-xs font-medium hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm">批量删除</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-semibold">
              <tr>
                {userRole === 'manager' && (
                   <th className="px-6 py-4 w-14 text-center">
                     <input type="checkbox" checked={isCurrentPageSelected} onChange={handlePageSelectToggle} className="w-4 h-4text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" />
                   </th>
                )}
                <th className="px-6 py-4">公司</th>
                <th className="px-6 py-4">行业</th>
                <th className="px-6 py-4">联系人</th>
                <th className="px-6 py-4">线索来源</th>
                <th className="px-6 py-4">线索状态</th>
                <th className="px-6 py-4">负责人</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedLeads.length > 0 ? paginatedLeads.map(l => {
                const canEdit = userRole === 'manager' || (userRole === 'sales' && l.isSelfAdded);
                const canReturn = userRole === 'sales' && !l.isSelfAdded && l.owner !== '未分配';
                const canAssign = userRole === 'manager';

                return (
                  <tr key={l.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(l.id) ? 'bg-blue-50/30' : ''}`}>
                    {userRole === 'manager' && (
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" className="w-4 h-4text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" checked={selectedIds.includes(l.id)} onChange={() => toggleSelection(l.id)} />
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600">{l.company}</td>
                    <td className="px-6 py-4 text-slate-500">{l.industry || '--'}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{l.name}</td>
                    <td className="px-6 py-4 text-slate-500">{l.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[11px] font-medium border ${statusColors[l.status] || 'bg-slate-50 border-slate-200'}`}>{l.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2 mt-0.5">
                      {l.owner !== '未分配' && <div className="w-6 h-6 bg-slate-100 flex items-center justify-center text-[10px] font-bold">{l.owner[0]}</div>}
                      <span className={l.owner === '未分配' ? 'text-orange-500 font-semibold' : ''}>{l.owner}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => onDetail(l, false)} className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 font-medium text-xs transition-colors">查看</button>
                        {canAssign && <button onClick={() => openAssignModal([l.id])} className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 font-medium text-xs transition-colors">{l.owner !== '未分配' ? '改派' : '分配'}</button>}
                        {canEdit && <button onClick={() => onDetail(l, true)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors">编辑</button>}
                        {canReturn && <button onClick={() => onReturn(l.id)} className="px-3 py-1.5 text-orange-600 hover:bg-orange-50 font-medium text-xs transition-colors">退回</button>}
                        {userRole === 'manager' && <button onClick={() => { setDeleteTargetIds([l.id]); setShowDeleteModal(true); }} className="px-3 py-1.5 text-red-500 hover:bg-red-50 font-medium text-xs transition-colors">删除</button>}
                      </div>
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan={8} className="px-8 py-24 text-center text-slate-400 font-medium">暂无匹配的线索数据</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {userRole === 'manager' && (
              <>
                <button onClick={handleSelectAllToggle} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors shadow-sm">
                  {isAllSelected ? '取消全选' : '全选'}
                </button>
                <button onClick={handleInvertSelection} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors shadow-sm">反选</button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>每页:</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-slate-50 border border-slate-200 px-2 py-1 outline-none focus:border-blue-400 cursor-pointer">
                <option value={5}>5 条</option><option value={10}>10 条</option><option value={20}>20 条</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center font-medium transition-colors ${currentPage === p ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}>{p}</button>
              ))}
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ChevronRight size={16} /></button>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span>跳至:</span>
              <input type="text" value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onBlur={() => { const val = Number(jumpPage); if (val >= 1 && val <= totalPages) setCurrentPage(val); setJumpPage(''); }} onKeyDown={(e) => { if (e.key === 'Enter') { const val = Number(jumpPage); if (val >= 1 && val <= totalPages) setCurrentPage(val); setJumpPage(''); } }} className="w-10 h-7 border border-slate-200 outline-none focus:border-blue-400 text-center bg-slate-50 transition-colors" />
              <span>页，共 {displayLeads.length} 条</span>
            </div>
          </div>
        </div>
      </div>

      {/* 分配 Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-8 w-[520px] shadow-2xl scale-in-center flex flex-col border border-slate-100">
            <div className="w-14 h-14 bg-blue-50 flex items-center justify-center text-blue-600 mb-6"><UserPlus size={28}/></div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">{requiresReassignReason ? '手动改派线索' : '手动分配线索'}</h3>
            <p className="text-sm text-slate-500 mb-6">您即将处理已选中的 <span className="text-blue-600 font-semibold">{selectedIds.length}</span> 条线索：无负责人线索可直接分配，已分配线索将按改派流程执行。</p>
            <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-medium mb-4 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer">
              {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {requiresReassignReason && (
              <div className="mb-6 bg-orange-50 border border-orange-200 p-4">
                <p className="text-xs font-bold text-orange-700 mb-2">检测到改派场景：将有 {reassignedLeads.length} 条线索从原负责人改派给 {assignTo || '目标销售'}</p>
                <p className="text-xs text-slate-600 mb-3">请先选择改派原因模板，可选填补充备注；系统会将结构化原因同步给双方销售。</p>
                <select
                  value={reassignReasonCategory}
                  onChange={(e) => setReassignReasonCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-3 text-sm mb-3 outline-none focus:border-blue-500"
                >
                  <option value="">请选择改派原因</option>
                  <option value="原负责人请长假">原负责人请长假</option>
                  <option value="原负责人离职或转岗">原负责人离职或转岗</option>
                  <option value="负载均衡调整">负载均衡调整</option>
                  <option value="行业匹配度调整">行业匹配度调整</option>
                  <option value="主管策略调整">主管策略调整</option>
                </select>
                <textarea
                  value={reassignReasonNote}
                  onChange={(e) => setReassignReasonNote(e.target.value)}
                  placeholder="补充备注（可选）：如请假周期、交接要求、重点跟进节点"
                  className="w-full bg-white border border-slate-200 p-3 text-sm h-20 resize-none outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-auto">
              <button onClick={() => setShowAssignModal(false)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={confirmManualAssign} className="px-6 py-2.5 text-sm font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">确认分配</button>
            </div>
          </div>
        </div>
      )}

      {/* 撤回确认 Modal */}
      {revokeConfirmLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-8 w-[520px] shadow-2xl scale-in-center flex flex-col border border-slate-100">
            <div className="w-14 h-14 bg-orange-50 flex items-center justify-center text-orange-600 mb-6"><Undo2 size={28}/></div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">确认撤回本次派发？</h3>
            <p className="text-sm text-slate-500 mb-6">
              撤回后，本次派发记录将标记为“已撤回”，并将对应线索退回至线索池（未分配）。
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 mb-6">
              <div>派发时间：{revokeConfirmLog.date}</div>
              <div className="mt-1">分配类型：{revokeConfirmLog.type}</div>
              <div className="mt-1">派发总数：{revokeConfirmLog.total}</div>
            </div>
            <div className="flex justify-end gap-3 mt-auto">
              <button onClick={() => setRevokeConfirmLog(null)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={confirmRevokeAssign} className="px-6 py-2.5 text-sm font-medium bg-orange-600 text-white shadow-sm hover:bg-orange-700 transition-colors">确认撤回</button>
            </div>
          </div>
        </div>
      )}


      {/* 删除 Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-8 w-[420px] shadow-2xl scale-in-center border border-slate-100">
            <div className="w-14 h-14 bg-red-50 flex items-center justify-center text-red-600 mb-6"><AlertCircle size={28}/></div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">确认删除线索？</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">您即将删除选定的 <span className="text-red-600 font-semibold">{deleteTargetIds.length}</span> 条线索。删除后数据将无法恢复。</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={() => { onBatchDelete(deleteTargetIds); setShowDeleteModal(false); setSelectedIds([]); }} className="px-6 py-2.5 text-sm font-medium bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === 内嵌弹窗组件：数据清洗中心 (Data Cleaning Modal) ===
function DataCleaningModal({ leads, setLeads, showToast, onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [activeTab, setActiveTab] = useState('dupes');
  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({
    company: '',
    name: '',
    industry: '',
    source: '',
    phone: '',
    email: '',
    wechat: ''
  });
  
  const [results, setResults] = useState({ duplicates: [], invalids: [], needsEnhance: [] });

  const buildScanResults = (leadList) => {
    const grouped = leadList.reduce((acc, curr) => {
      const key = `${curr.company}_${curr.name}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
    const duplicates = Object.entries(grouped)
      .filter(([, items]) => items.length > 1)
      .map(([key, items]) => ({ key, items }));

    const invalids = leadList.filter((l) => {
      if (!l.phone) return true;
      const purePhone = l.phone.replace(/-/g, '');
      return purePhone.length < 8 || /[a-zA-Z\u4e00-\u9fa5]/.test(purePhone);
    });

    const needsEnhance = leadList.filter((l) => l.score === null);
    return { duplicates, invalids, needsEnhance };
  };

  const applyLeadsAndRefresh = (nextLeads) => {
    setLeads(nextLeads);
    setPendingCleanupCount(calculatePendingCount(nextLeads));
    if (hasScanned) {
      setResults(buildScanResults(nextLeads));
    }
  };

  const openEditLead = (lead) => {
    setEditingLead(lead);
    setEditForm({
      company: lead.company || '',
      name: lead.name || '',
      industry: lead.industry || '',
      source: lead.source || '',
      phone: lead.phone || '',
      email: lead.email || '',
      wechat: lead.wechat || ''
    });
  };

  const closeEditLead = () => {
    setEditingLead(null);
  };

  const handleSaveEditedLead = () => {
    if (!editingLead) return;
    if (!editForm.company.trim() || !editForm.name.trim()) {
      showToast('❌ 公司名与联系人名称不能为空', 'error');
      return;
    }
    const nextLeads = leads.map((lead) => {
      if (lead.id !== editingLead.id) return lead;
      return {
        ...lead,
        company: editForm.company.trim(),
        name: editForm.name.trim(),
        industry: editForm.industry.trim() || '未知行业',
        source: editForm.source.trim() || lead.source,
        phone: editForm.phone.trim(),
        email: editForm.email.trim(),
        wechat: editForm.wechat.trim()
      };
    });
    applyLeadsAndRefresh(nextLeads);
    closeEditLead();
    showToast('✅ 线索信息已更新');
  };

  const handleDeleteLead = (leadId) => {
    const nextLeads = leads.filter((lead) => lead.id !== leadId);
    applyLeadsAndRefresh(nextLeads);
    showToast('✅ 线索已删除');
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setResults(buildScanResults(leads));
      setIsScanning(false); setHasScanned(true);
      showToast('✅ 全库数据体检完成，已生成健康报告');
    }, 2000);
  };

  const handleMergeDupes = (groupKey) => {
    const group = results.duplicates.find(g => g.key === groupKey);
    if (!group) return;
    
    const sorted = [...group.items].sort((a,b) => b.id - a.id);
    const leadToKeep = { ...sorted[0] };
    const othersToMerge = sorted.slice(1);
    const idsToDelete = othersToMerge.map(l => l.id);
    
    // Detect field conflicts between duplicate records
    const fieldKeys = ['phone', 'email', 'wechat', 'industry', 'position', 'source', 'date'];
    const conflicts = {};
    let hasConflicts = false;
    
    fieldKeys.forEach(field => {
      const values = [leadToKeep[field], ...othersToMerge.map(l => l[field])]
        .map(v => v && typeof v === 'string' ? v.trim() : v)
        .filter(v => v && v !== '');
      const uniqueValues = [...new Set(values)];
      
      if (uniqueValues.length > 1) {
        conflicts[field] = uniqueValues;
        hasConflicts = true;
      }
    });
    
    // Show conflict notification if conflicts detected
    if (hasConflicts) {
      const conflictFields = Object.keys(conflicts)
        .map(f => `【${f}】: ${conflicts[f].join(' / ')}`)
        .join('\n');
      
      showToast(
        `⚠️ 检测到字段冲突，请仔细核对:\n${conflictFields}\n\n非重复信息已自动合并，归属人保持不变。`,
        'warning'
      );
    }
    
    // Merge: only replace leadToKeep fields if all source leads have identical non-empty values
    fieldKeys.forEach(field => {
      if (conflicts[field]) {
        // Has conflict - keep original (leadToKeep) value
        return;
      }
      
      // No conflict - check if we can merge from other leads
      const valueFromOthers = othersToMerge.find(l => {
        const val = l[field];
        return val && (typeof val !== 'string' || val.trim() !== '');
      });
      if (valueFromOthers && valueFromOthers[field]) {
        leadToKeep[field] = valueFromOthers[field];
      }
    });
    
    // Keep owner unchanged - do not modify the owner field
    // leadToKeep.owner stays as is
    
    const nextLeads = leads.map((lead) => 
      lead.id === leadToKeep.id ? leadToKeep : lead
    ).filter((lead) => !idsToDelete.includes(lead.id));
    
    applyLeadsAndRefresh(nextLeads);
    
    if (hasConflicts) {
      showToast(`✅ 已合并线索 ${idsToDelete.length} 条，保留记录 #${leadToKeep.id}（有字段冲突需要手工验证）`, 'success');
    } else {
      showToast(`✅ 成功合并重复线索，无冲突信息。保留记录 #${leadToKeep.id}`);
    }
  };

  const handleMarkInvalid = (id) => {
    const nextLeads = leads.map((lead) => lead.id === id ? { ...lead, status: '失效线索', owner: '未分配' } : lead);
    applyLeadsAndRefresh(nextLeads);
    showToast('✅ 已将该线索标记为失效并退回公海');
  };

  const handleBatchEnhance = () => {
    const idsToEnhance = results.needsEnhance.map(l => l.id);
    if (idsToEnhance.length === 0) return;

    const nextLeads = leads.map((lead) => idsToEnhance.includes(lead.id) ? { ...lead, score: 85 + Math.floor(Math.random() * 14) } : lead);
    applyLeadsAndRefresh(nextLeads);
    showToast('✅ AI 已完成全量扫描并智能补充了画像评分！');
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex flex-col gap-4 bg-white relative">
          <button onClick={onClose} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
            <ChevronLeft size={16} className="mr-1" /> 返回线索列表
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 flex items-center justify-center text-indigo-600"><ShieldCheck size={28}/></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">数据清洗中心</h2>
              <p className="text-sm text-slate-500 mt-1">定期体检线索池，通过 AI 剔除冗余与失效数据，保持线索库高转化率</p>
            </div>
          </div>
        </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
            <div className="p-8 space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {!hasScanned ? (
                <div className="flex flex-col items-center justify-center w-full py-10">
                  <Database size={64} className="text-slate-300 mb-6" />
                  <button onClick={handleScan} disabled={isScanning} className="bg-indigo-600 text-white px-8 py-3.5 text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:bg-indigo-400">
                    {isScanning ? <Loader2 size={18} className="animate-spin"/> : <Search size={18}/>}
                    {isScanning ? '正在全库扫描中...' : '开始全库数据体检'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 w-full justify-between items-center">
                  <div className="flex gap-4">
                    <div className="bg-rose-50 text-rose-700 px-5 py-2.5 border border-rose-100 flex flex-col items-center">
                      <span className="text-2xl font-black">{results.duplicates.length + results.invalids.length}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">异常项待处理</span>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-5 py-2.5 border border-blue-100 flex flex-col items-center">
                      <span className="text-2xl font-black">{results.needsEnhance.length}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">待 AI 完善补充</span>
                    </div>
                  </div>
                  <button onClick={handleScan} disabled={isScanning} className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50">
                    {isScanning ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>}
                    重新扫描
                  </button>
                </div>
              )}
            </div>

            {hasScanned && (
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                  <button onClick={() => setActiveTab('dupes')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'dupes' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                    <Copy size={16}/> 撞单去重处理 <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 text-[10px] ml-1">{results.duplicates.length} 组</span>
                  </button>
                  <button onClick={() => setActiveTab('invalids')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'invalids' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                    <AlertTriangle size={16}/> 无效联系方式诊断 <span className="bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] ml-1">{results.invalids.length} 个</span>
                  </button>
                  <button onClick={() => setActiveTab('enhance')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'enhance' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                    <Wand2 size={16}/> AI 画像补全 <span className="bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] ml-1">{results.needsEnhance.length} 个</span>
                  </button>
                </div>

                <div className="p-6 bg-white min-h-[300px]">
                  {activeTab === 'dupes' && (
                    <div className="space-y-6">
                      {results.duplicates.length === 0 ? <EmptyState text="太棒了，线索库中没有检测到重复撞单！" /> : 
                        <div className="grid gap-6">
                          {results.duplicates.map((group, i) => (
                            <div key={i} className="border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-2">
                                   <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 text-xs font-bold">疑似重复群组 #{i+1}</span>
                                   <span className="font-bold text-slate-800">{group.key.replace('_', ' - ')}</span>
                                 </div>
                                 <button onClick={() => handleMergeDupes(group.key)} className="bg-indigo-600 text-white px-4 py-2 text-xs font-bold hover:bg-indigo-700 shadow-sm transition-colors">一键合并 (保留最新)</button>
                              </div>
                              <div className="space-y-2">
                                 {group.items.map(item => (
                                   <div key={item.id} className="flex justify-between items-center bg-white border border-slate-200 p-3">
                                     <div className="flex items-center gap-4 text-sm">
                                       <span className="text-slate-400 font-mono w-16">ID: {item.id}</span>
                                       <span className="text-slate-600 font-medium w-32">{item.phone}</span>
                                       <span className="text-slate-500 text-xs">录入时间: {item.date}</span>
                                       <span className="text-slate-500 text-xs">来源: {item.source}</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                       <span className="text-xs bg-slate-100 px-2 py-1 font-medium text-slate-600 border border-slate-200">归属: {item.owner}</span>
                                       <button onClick={() => openEditLead(item)} className="px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">编辑</button>
                                       <button onClick={() => handleDeleteLead(item.id)} className="px-2.5 py-1 text-[11px] font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">删除</button>
                                     </div>
                                   </div>
                                 ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                    </div>
                  )}

                  {activeTab === 'invalids' && (
                    <div className="space-y-6">
                      {results.invalids.length === 0 ? <EmptyState text="当前线索库联系方式格式良好！" /> : 
                        <div className="overflow-x-auto border border-rose-100 shadow-sm">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-bold">
                              <tr>
                                <th className="px-6 py-4">公司与联系人</th>
                                <th className="px-6 py-4">异常联络方式</th>
                                <th className="px-6 py-4">来源与录入人</th>
                                <th className="px-6 py-4 text-right">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-rose-50">
                              {results.invalids.map(l => (
                                <tr key={l.id} className="bg-white hover:bg-rose-50/30 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{l.company}</div>
                                    <div className="text-xs text-slate-500 mt-1">{l.name}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="bg-rose-100 text-rose-700 px-3 py-1.5 font-mono font-bold inline-flex items-center gap-2">
                                      <AlertCircle size={14}/> {l.phone || '空缺'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-xs text-slate-600">
                                    <div>来源: {l.source}</div>
                                    <div className="mt-1">归属: {l.owner}</div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button onClick={() => openEditLead(l)} className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-4 py-2 text-xs font-bold transition-colors shadow-sm">
                                        手工录入修正
                                      </button>
                                      <button onClick={() => handleMarkInvalid(l.id)} className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 text-xs font-bold transition-colors shadow-sm">
                                        直接标记为失效
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      }
                    </div>
                  )}

                  {activeTab === 'enhance' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center mb-6 bg-blue-50 border border-blue-100 p-5">
                        <div>
                          <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2"><Wand2 size={18}/> 启动大模型补全引擎</h4>
                          <p className="text-sm text-blue-700/80">共有 {results.needsEnhance.length} 条线索处于“裸数据”状态。利用 AI 结合公司全网动态进行打标与意向评估。</p>
                        </div>
                        <button onClick={handleBatchEnhance} disabled={results.needsEnhance.length === 0} className="bg-blue-600 text-white px-6 py-3 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50">一键批量执行 AI 完善</button>
                      </div>
                      
                      {results.needsEnhance.length === 0 ? <EmptyState text="线索库质量极高，暂无需要 AI 补充的裸数据！" /> : 
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.needsEnhance.map(l => (
                            <div key={l.id} className="border border-slate-200 p-4 bg-white flex flex-col justify-between opacity-70">
                              <div>
                                <div className="font-bold text-slate-800 truncate mb-1" title={l.company}>{l.company}</div>
                                <div className="text-xs text-slate-500">{l.name} | {l.industry || '未知行业'}</div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <span className="w-2 h-2 bg-slate-200"></span> 缺少评分与标签画像
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[220] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-[640px] max-w-[92vw] border border-slate-200 shadow-2xl p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">编辑线索信息</h3>
            <p className="text-sm text-slate-500 mb-6">支持修改撞单线索信息或手工修正无效联系方式。</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">公司名</label>
                <input value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">联系人名称</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">行业</label>
                <input value={editForm.industry} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">来源</label>
                <input value={editForm.source} onChange={(e) => setEditForm({ ...editForm, source: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">联系电话</label>
                <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">邮箱</label>
                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">微信号</label>
                <input value={editForm.wechat} onChange={(e) => setEditForm({ ...editForm, wechat: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={closeEditLead} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveEditedLead} className="px-6 py-2.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">保存修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadDetailView({ lead, isEdit, setIsEdit, userRole, onBack, onSave, showToast, leads, setLeads, setSelectedLead, onReturn }) {
  const [form, setForm] = useState({ ...lead });
  useEffect(() => { setForm({ ...lead }); }, [lead]);

  const formatFetchTime = (timestamp) => {
    if (!timestamp) return '未抓取';
    const diffMinutes = Math.floor((Date.now() - Number(timestamp)) / (1000 * 60));
    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}小时前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}天前`;
  };

  const handleTriggerQccScrape = () => {
    if (!lead?.company) {
      showToast?.('❌ 公司名称为空，无法触发抓取', 'error');
      return;
    }

    const queryUrl = `https://www.qcc.com/web/search?key=${encodeURIComponent(lead.company)}`;
    const payload = {
      leadId: lead.id,
      companyName: lead.company,
      source: 'qichacha',
      queryUrl
    };

    window.dispatchEvent(new CustomEvent('crm:trigger-company-scrape', { detail: payload }));
    window.open(queryUrl, '_blank', 'noopener,noreferrer');

    const now = Date.now();
    const updatedLeads = leads.map((item) => item.id === lead.id ? { ...item, qccLastFetchedAt: now } : item);
    setLeads(updatedLeads);
    setSelectedLead(updatedLeads.find((item) => item.id === lead.id));
    showToast?.('✅ 已触发企查查抓取，请在插件页完成信息补充');
  };
  
  const handleSaveEdit = () => { 
    if(!form.company) return showToast("❌ 公司全称为必填项", "error"); 
    const finalForm = { ...form };
    if (finalForm.contacts && finalForm.contacts.length > 0) {
      finalForm.name = finalForm.contacts[0].name;
      finalForm.phone = finalForm.contacts[0].phones && finalForm.contacts[0].phones.length > 0 ? finalForm.contacts[0].phones[0] : '';
    }
    onSave(finalForm); setIsEdit(false); 
  };
  
  const canEdit = userRole === 'manager' || (userRole === 'sales' && lead.isSelfAdded);
  const canReturn = userRole === 'sales' && !lead.isSelfAdded && lead.owner !== '未分配';

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"><ChevronLeft size={16} className="mr-1" /> 返回线索列表</button>
        <div className="flex gap-3">
          {canReturn && (
            <button onClick={() => { onReturn(lead.id); onBack(); }} className="px-5 py-2.5 bg-white border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 flex items-center gap-2 transition-colors shadow-sm"><Undo2 size={16} /> 退回线索池</button>
          )}
          {canEdit && (
            !isEdit ? (
              <button onClick={() => setIsEdit(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors text-slate-700 shadow-sm"><Edit size={16} className="text-blue-600" />编辑线索信息</button>
            ) : (
              <><button onClick={() => setIsEdit(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">取消编辑</button><button onClick={handleSaveEdit} className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">保存更改</button></>
            )
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-slate-500 text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-slate-600 bg-white border border-slate-200 shadow-sm px-3 py-1 text-xs">ID: #{lead.id}</span>
          <span className="flex items-center text-slate-600"><LinkIcon size={16} className="mr-1.5 text-slate-400" />来源：{lead.source}</span>
          {lead.trackStatus === 'draft' && <span className="bg-orange-50 text-orange-700 px-3 py-1 border border-orange-100 text-xs font-medium ml-2">草稿暂存中</span>}
          {lead.daysUncontacted > 0 && <span className={`px-3 py-1 border text-xs font-medium ml-2 ${lead.daysUncontacted >= 3 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{lead.daysUncontacted} 天未跟进</span>}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[15px] text-slate-500 flex items-center gap-2">
            <RefreshCw size={16} className="text-slate-300" /> 抓取更新时间: {formatFetchTime(lead?.qccLastFetchedAt)}
          </span>
          <button
            onClick={handleTriggerQccScrape}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <Globe size={15} /> 插件抓取补全
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start pb-20">
        <div className="xl:col-span-7 space-y-6">
          {isEdit ? (
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-lg text-slate-800">编辑公司信息</h3>
              </div>
              <div className="p-8 bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">公司全称 <span className="text-red-500">*</span></label><CompanyAutocomplete value={form.company} onChange={v => setForm({...form, company: v})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors" /></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">所属行业</label><input type="text" value={form.industry || ''} onChange={e => setForm({...form, industry: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm font-medium bg-white outline-none focus:border-blue-500 transition-colors" placeholder="如: 互联网/制造" /></div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-2">线索来源</label><select value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm font-medium bg-white outline-none focus:border-blue-500 transition-colors"><option>名片</option><option>老客户转介绍</option><option>私域运营</option><option>网络搜索</option><option>线下录入</option><option>批量名片识别</option></select></div>
                  <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">线索状态 (管理用)</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm font-medium bg-white outline-none focus:border-blue-500 transition-colors">{Object.keys(statusColors).map(s => <option key={s}>{s}</option>)}</select></div>
                  <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">业务背景描述</label><textarea value={form.mainBusiness || ''} onChange={e => setForm({...form, mainBusiness: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors h-24 resize-none" /></div>
                  <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-2">公司补充备注</label><textarea value={form.companyNote || ''} onChange={e => setForm({...form, companyNote: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors h-24 resize-none" placeholder="在此输入有关该公司的额外备注信息..." /></div>
                </div>
              </div>
            </div>
          ) : (
            <CompanyInfoSection lead={lead} />
          )}
          {!isEdit && <FollowUpHistorySection history={lead.history} />}
        </div>
        <div className="xl:col-span-5">
          {isEdit ? (
            <ContactsSection contacts={form.contacts || []} onUpdateContacts={newContacts => setForm({...form, contacts: newContacts})} isEdit={true} showToast={showToast} />
          ) : (
            <ContactsSection contacts={lead.contacts || []} onUpdateContacts={newContacts => { const updated = leads.map(l => l.id === lead.id ? { ...l, contacts: newContacts } : l); setLeads(updated); setSelectedLead(updated.find(x => x.id === lead.id)); }} isEdit={false} showToast={showToast} />
          )}
        </div>
      </div>
    </div>
  );
}

const CompanyInfoSection = ({ lead }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-8 pb-6 bg-white border-b border-slate-100">
        <div className="flex justify-between items-start gap-5">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{lead?.company || '加载中...'}</h2>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">存续</span>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5"><Building2 size={14} className="mr-1.5 text-blue-500"/> {lead?.industry || '未知行业'}</span>
              <span className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5">成立: 2019-06-11</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-orange-50 px-6 py-4 border border-orange-100 shadow-sm relative overflow-hidden group">
            <Sparkles size={64} className="absolute -right-2 -top-2 opacity-10 text-orange-500 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
            <div className="flex items-center text-[11px] text-orange-700 font-semibold mb-1 relative z-10 group/tooltip">
              <Sparkles size={14} className="mr-1" />AI 推荐评分
              <Info size={14} className="ml-1 text-orange-400" />
            </div>
            <div className="flex items-baseline relative z-10">
              {lead?.score ? (
                <><span className="text-4xl font-bold text-orange-600">{lead.score}</span><span className="text-sm font-semibold text-orange-400 ml-1">/100</span></>
              ) : (
                <span className="text-sm font-bold text-orange-400 py-2">待 AI 完善</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#f8faff] p-6 border border-blue-100 relative overflow-hidden">
            <Sparkles size={140} className="absolute -top-4 -right-4 opacity-10 pointer-events-none text-blue-500" />
            <div className="flex items-center text-blue-800 font-semibold mb-3 relative z-10 text-sm"><Sparkles size={20} className="mr-2" />AI 业务需求分析</div>
            <div className="relative z-10 text-sm text-slate-700 leading-relaxed">
              基于该公司近期招聘了大量“大客户销售”，判断其正处于<span className="font-semibold text-blue-800 bg-blue-100/50 px-1.5 py-0.5 ml-1">销售团队扩张期</span>。极大概率需要采购CRM系统。
            </div>
          </div>
        </div>
        {lead?.companyNote && (
          <div className="border-t border-slate-100 pt-6 mt-6">
            <div className="bg-amber-50/60 p-5 border border-amber-100">
              <div className="text-xs font-semibold text-amber-800 mb-2 flex items-center"><FileText size={16} className="mr-1.5" /> 公司补充备注 / 业务背景</div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{lead.companyNote}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FollowUpHistorySection = ({ history }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center"><History size={20} className="mr-3 text-blue-600" /><h2 className="text-base font-bold text-slate-800">跟进历史轨迹 ({history.length})</h2></div>
        <button className="text-slate-400 bg-slate-50 p-2">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
      </div>
      {isExpanded && (
        <div className="p-8">
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
            {history.map((record) => (
              <div key={record.id} className="relative pl-8 group">
                <div className="absolute -left-[11px] top-1.5 w-5 h-5 bg-white border-[4px] border-blue-200 group-hover:border-blue-500 transition-colors"></div>
                <div className="bg-slate-50/50 p-5 border border-slate-200">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div className="flex items-center gap-2"><span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1">{record.sales}</span><span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 border border-blue-100">{record.type}</span></div>
                    <span className="text-xs text-slate-400 font-medium flex items-center"><Clock size={12} className="mr-1" /> {record.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 bg-white p-4 border border-slate-100 shadow-sm">{record.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ContactsSection = ({ contacts, onUpdateContacts, isEdit, showToast }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', position: '', companyName: '', address: '', website: '', phones: '', wechat: '', email: '', note: '' });

  const handleCopy = (text, type) => {
    try {
      const textArea = document.createElement("textarea"); textArea.value = text;
      document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);
      showToast(`✅ ${type} 已复制`);
    } catch { showToast(`❌ 复制失败`, 'error'); }
  };

  const handleSaveNewContact = () => {
    if (!formData.name.trim()) return showToast('❌ 姓名不能为空', 'error');
    const newContact = {
      id: Date.now(), name: formData.name, position: formData.position || "暂无职位", companyName: formData.companyName || "", address: formData.address || "", website: formData.website || "",
      tags: ["手工添加"], tagColor: "bg-slate-100 text-slate-600 border-slate-200", phones: formData.phones ? formData.phones.split(/[,，、/]/).map(p => p.trim()).filter(Boolean) : [], 
      wechat: formData.wechat || "暂无", email: formData.email || "暂无", social: "暂无", pitch: "手工录入联系人，暂无AI分析话术。", aiAdvice: "建议尽快跟进补充业务画像。", note: formData.note.trim()
    };
    onUpdateContacts([newContact, ...(contacts || [])]); setShowAddModal(false); setFormData({ name: '', position: '', companyName: '', address: '', website: '', phones: '', wechat: '', email: '', note: '' }); showToast('✅ 联系人新增成功');
  };

  if (isEdit) {
    const handleContactFieldChange = (id, field, value) => { onUpdateContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c)); };
    return (
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-6 p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center border-b border-slate-100 pb-4"><Users size={20} className="mr-2 text-blue-600" /> 编辑联系人名片</h3>
        {(contacts || []).map((c) => (
          <div key={c.id} className="p-6 border border-slate-200 relative bg-slate-50/50 hover:border-blue-300 transition-colors">
            <button onClick={() => onUpdateContacts(contacts.filter(item => item.id !== c.id))} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white p-2 shadow-sm hover:bg-red-50 transition-colors"><Trash2 size={16}/></button>
            <div className="grid grid-cols-2 gap-5 pr-8">
              <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">姓名 <span className="text-red-500">*</span></label><input value={c.name} onChange={e => handleContactFieldChange(c.id, 'name', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">职位 / 角色</label><input value={c.position} onChange={e => handleContactFieldChange(c.id, 'position', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              
              <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-1.5">所属公司名称</label><input value={c.companyName || ''} onChange={e => handleContactFieldChange(c.id, 'companyName', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-semibold text-slate-500 mb-1.5">电话 (逗号分隔) <span className="text-red-500">*</span></label><input value={(c.phones || []).join(', ')} onChange={e => handleContactFieldChange(c.id, 'phones', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-semibold text-slate-500 mb-1.5">微信号</label><input value={c.wechat === '暂无' ? '' : c.wechat} onChange={e => handleContactFieldChange(c.id, 'wechat', e.target.value || '暂无')} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-semibold text-slate-500 mb-1.5">电子邮箱</label><input value={c.email === '暂无' ? '' : c.email} onChange={e => handleContactFieldChange(c.id, 'email', e.target.value || '暂无')} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-semibold text-slate-500 mb-1.5">社交平台</label><input value={c.social || ''} onChange={e => handleContactFieldChange(c.id, 'social', e.target.value)} className="w-full bg-white border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
              <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-1.5">个人专属备注信息</label><textarea value={c.note || ''} onChange={e => handleContactFieldChange(c.id, 'note', e.target.value)} rows="3" className="w-full bg-white border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"></textarea></div>
            </div>
          </div>
        ))}
        <button onClick={() => onUpdateContacts([...(contacts || []), { id: Date.now(), name: '', position: '', companyName: '', address: '', website: '', phones: [], wechat: '暂无', email: '暂无', social: '暂无', tags: ["手工录入"], tagColor: "bg-slate-100 text-slate-600 border-slate-200", pitch: "手工补充联系人，暂无AI话术。", aiAdvice: "建议尽快破冰沟通补充画像。", note: '' }])} className="w-full py-4 border border-dashed border-blue-300 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors flex justify-center items-center gap-2"><Plus size={18}/>增加名片条目</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="border-b border-slate-100 p-6 bg-white flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center"><Users size={20} className="mr-2 text-blue-600" />联系人图谱 ({(contacts || []).length})</h2>
        <button onClick={() => setShowAddModal(true)} className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 transition-colors"><UserPlus size={16} className="mr-1.5" /> 手工补充联系人</button>
      </div>
      <div className="divide-y divide-slate-100">
        {(contacts || []).length === 0 && <div className="p-10 text-center text-slate-400 text-sm font-medium">暂无联系人名片数据</div>}
        {(contacts || []).map((c) => (
          <div key={c.id} className="p-8 hover:bg-slate-50/50 transition-colors">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{c.name || '未知联系人'}</h3>
                <span className="text-sm font-medium text-slate-500 border-l border-slate-300 pl-3">{c.position}</span>
                {c.companyName && <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 border border-slate-200">{c.companyName}</span>}
                {c.tags.map(t => <span key={t} className={`px-2.5 py-1 text-xs font-medium border ${c.tagColor}`}>{t}</span>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {c.phones && c.phones.length > 0 && c.phones.map(phone => (
                  <div key={phone} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3.5 group hover:border-slate-300 transition-colors">
                    <div className="flex items-center text-sm font-medium text-slate-800"><Phone size={16} className="mr-3 text-slate-400" /> {phone}</div>
                    <button onClick={() => handleCopy(phone, '电话')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Copy size={16} /></button>
                  </div>
                ))}
                {c.wechat && c.wechat !== "暂无" && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3.5 group hover:border-slate-300 transition-colors">
                    <div className="flex items-center text-sm font-medium text-slate-800"><MessageCircle size={16} className="mr-3 text-emerald-500" /> {c.wechat}</div>
                    <button onClick={() => handleCopy(c.wechat, '微信')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Copy size={16} /></button>
                  </div>
                )}
                {c.email && c.email !== "暂无" && (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3.5 group hover:border-slate-300 transition-colors col-span-1 sm:col-span-2">
                    <div className="flex items-center text-sm font-medium text-slate-800"><Mail size={16} className="mr-3 text-blue-500" /> {c.email}</div>
                    <button onClick={() => handleCopy(c.email, '邮箱')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Copy size={16} /></button>
                  </div>
                )}
              </div>
              {c.note && (
                <div className="bg-amber-50/50 p-5 border border-amber-100/50 mt-1">
                  <div className="text-xs font-semibold text-amber-800 mb-2 flex items-center"><FileText size={16} className="mr-1.5" /> 个人专属备注</div>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.note}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 flex justify-between items-center z-10">
              <h3 className="font-bold text-slate-800 flex items-center text-lg"><UserPlus size={20} className="mr-2 text-blue-600" /> 手工录入联系人名片</h3>
              <button onClick={() => setShowAddModal(false)} className="bg-slate-50 p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-2">公司全称</label><CompanyAutocomplete value={formData.companyName} onChange={val => setFormData({...formData, companyName: val})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-2">姓名</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-2">职位/头衔</label><input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" /></div>
                
                <div><label className="block text-xs font-semibold text-slate-600 mb-2">电话 (逗号分隔)</label><input type="text" value={formData.phones} onChange={e => setFormData({...formData, phones: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-2">微信</label><input type="text" value={formData.wechat} onChange={e => setFormData({...formData, wechat: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" /></div>
                
                <div><label className="block text-xs font-semibold text-slate-600 mb-2">电子邮箱</label><input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-2">网站</label><input type="text" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" placeholder="如: www.example.com" /></div>

                <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-2">公司/联系地址</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500" /></div>
                
                <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-2">个人专属备注</label><textarea rows="4" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 text-sm outline-none focus:border-blue-500 resize-none"></textarea></div>
              </div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
              <button onClick={handleSaveNewContact} className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">保存入库</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// === GB/T 4754-2017 国民经济行业分类（门类→大类→中类→小类）===
const GB_T_4754 = [
  { code:'A', name:'农、林、牧、渔业', children:[
    { code:'01', name:'农业', children:[
      { code:'011', name:'谷物种植', children:[{code:'0111',name:'稻谷种植'},{code:'0112',name:'小麦种植'},{code:'0113',name:'玉米种植'},{code:'0114',name:'豆类种植'},{code:'0115',name:'薯类种植'},{code:'0116',name:'棉花种植'},{code:'0117',name:'麻类种植'},{code:'0118',name:'糖料种植'},{code:'0119',name:'其他谷物种植'}]},
      { code:'012', name:'蔬菜、食用菌及园艺作物种植', children:[{code:'0121',name:'蔬菜种植'},{code:'0122',name:'食用菌种植'},{code:'0123',name:'花卉种植'},{code:'0129',name:'其他园艺作物种植'}]},
      { code:'013', name:'水果种植', children:[{code:'0131',name:'仁果类和核果类水果种植'},{code:'0132',name:'葡萄种植'},{code:'0133',name:'柑橘类种植'},{code:'0134',name:'热带、亚热带水果种植'},{code:'0139',name:'其他水果种植'}]},
      { code:'014', name:'坚果、含油果、香料和饮料作物种植', children:[{code:'0141',name:'坚果种植'},{code:'0142',name:'含油果种植'},{code:'0143',name:'香料作物种植'},{code:'0144',name:'茶及其他饮料作物种植'}]},
      {code:'015',name:'中草药材种植'},{code:'016',name:'烟草种植'},{code:'017',name:'其他农业'},
    ]},
    { code:'02', name:'林业', children:[{code:'021',name:'林木育种和育苗'},{code:'022',name:'造林和更新'},{code:'023',name:'森林经营和管护'},{code:'024',name:'木材和竹材采运'},{code:'025',name:'林业辅助活动'}]},
    { code:'03', name:'牧业', children:[
      { code:'031', name:'牲畜饲养', children:[{code:'0311',name:'牛的饲养'},{code:'0312',name:'马的饲养'},{code:'0313',name:'猪的饲养'},{code:'0314',name:'羊的饲养'},{code:'0315',name:'家禽饲养'},{code:'0316',name:'兔的饲养'},{code:'0319',name:'其他牲畜饲养'}]},
      {code:'032',name:'狩猎和捕捉动物'},
    ]},
    { code:'04', name:'渔业', children:[
      { code:'041', name:'水产养殖', children:[{code:'0411',name:'海水养殖'},{code:'0412',name:'内陆养殖'}]},
      { code:'042', name:'水产捕捞', children:[{code:'0421',name:'海洋捕捞'},{code:'0422',name:'内陆捕捞'}]},
    ]},
    {code:'05',name:'农、林、牧、渔专业及辅助性活动'},
  ]},
  { code:'B', name:'采矿业', children:[
    { code:'06', name:'煤炭开采和洗选业', children:[{code:'061',name:'烟煤和无烟煤的开采洗选'},{code:'062',name:'褐煤的开采洗选'},{code:'069',name:'其他煤炭采选'}]},
    { code:'07', name:'石油和天然气开采业', children:[{code:'071',name:'石油开采'},{code:'072',name:'天然气开采'}]},
    { code:'08', name:'黑色金属矿采选业', children:[{code:'081',name:'铁矿采选'},{code:'089',name:'其他黑色金属矿采选'}]},
    { code:'09', name:'有色金属矿采选业', children:[{code:'091',name:'常用有色金属矿采选'},{code:'092',name:'贵金属矿采选'},{code:'093',name:'稀有稀土金属矿采选'}]},
    { code:'10', name:'非金属矿采选业', children:[{code:'101',name:'土砂石开采'},{code:'102',name:'化学矿开采'},{code:'103',name:'采盐'},{code:'109',name:'其他非金属矿采选'}]},
    {code:'11',name:'开采专业及辅助性活动'},{code:'12',name:'其他采矿业'},
  ]},
  { code:'C', name:'制造业', children:[
    { code:'13', name:'农副食品加工业', children:[{code:'131',name:'谷物磨制'},{code:'132',name:'饲料加工'},{code:'133',name:'植物油加工'},{code:'134',name:'制糖业'},{code:'135',name:'屠宰及肉类加工'},{code:'136',name:'水产品加工'},{code:'137',name:'蔬菜、菌类、水果和坚果加工'},{code:'139',name:'其他农副食品加工'}]},
    { code:'14', name:'食品制造业', children:[{code:'141',name:'焙烤食品制造'},{code:'142',name:'糖果、巧克力及蜜饯制造'},{code:'143',name:'方便食品制造'},{code:'144',name:'液体乳及乳制品制造'},{code:'145',name:'罐头食品制造'},{code:'146',name:'调味品、发酵制品制造'},{code:'149',name:'其他食品制造'}]},
    { code:'15', name:'酒、饮料和精制茶制造业', children:[
      { code:'151', name:'酒的制造', children:[{code:'1511',name:'酒精制造'},{code:'1512',name:'白酒制造'},{code:'1513',name:'啤酒制造'},{code:'1514',name:'黄酒制造'},{code:'1515',name:'葡萄酒制造'},{code:'1519',name:'其他酒制造'}]},
      { code:'152', name:'饮料制造', children:[{code:'1521',name:'碳酸饮料制造'},{code:'1522',name:'瓶（桶）装饮用水制造'},{code:'1523',name:'果蔬汁及果蔬汁饮料制造'},{code:'1524',name:'含乳饮料和植物蛋白饮料制造'},{code:'1525',name:'固体饮料制造'},{code:'1529',name:'茶饮料及其他饮料制造'}]},
      {code:'153',name:'精制茶加工'},
    ]},
    { code:'16', name:'烟草制品业', children:[{code:'161',name:'烟叶复烤'},{code:'162',name:'卷烟制造'},{code:'169',name:'其他烟草制品制造'}]},
    { code:'17', name:'纺织业', children:[{code:'171',name:'棉纺织及印染精加工'},{code:'172',name:'毛纺织及染整精加工'},{code:'173',name:'麻纺织及染整精加工'},{code:'174',name:'丝绢纺织及印染精加工'},{code:'175',name:'化纤织造及印染精加工'},{code:'176',name:'针织或钩针编织物及其制品制造'},{code:'177',name:'家用纺织制成品制造'},{code:'178',name:'产业用纺织制成品制造'}]},
    { code:'18', name:'纺织服装、服饰业', children:[{code:'181',name:'机织服装制造'},{code:'182',name:'针织或钩针编织服装制造'},{code:'183',name:'服饰制造'}]},
    { code:'19', name:'皮革、毛皮、羽毛及其制品和制鞋业', children:[{code:'191',name:'皮革鞣制加工'},{code:'192',name:'皮革制品制造'},{code:'193',name:'毛皮鞣制及制品加工'},{code:'194',name:'羽毛（绒）加工及制品制造'},{code:'195',name:'制鞋业'}]},
    { code:'20', name:'木材加工和木、竹、藤、棕、草制品业', children:[{code:'201',name:'木材加工'},{code:'202',name:'人造板制造'},{code:'203',name:'木制品制造'},{code:'204',name:'竹、藤、棕、草制品制造'}]},
    { code:'21', name:'家具制造业', children:[{code:'211',name:'木质家具制造'},{code:'212',name:'竹、藤家具制造'},{code:'213',name:'金属家具制造'},{code:'214',name:'塑料家具制造'},{code:'219',name:'其他家具制造'}]},
    { code:'22', name:'造纸和纸制品业', children:[{code:'221',name:'纸浆制造'},{code:'222',name:'造纸'},{code:'223',name:'纸制品制造'}]},
    { code:'23', name:'印刷和记录媒介复制业', children:[{code:'231',name:'印刷'},{code:'232',name:'装订及印刷相关服务'},{code:'233',name:'记录媒介复制'}]},
    { code:'24', name:'文教、工美、体育和娱乐用品制造业', children:[{code:'241',name:'文具制造'},{code:'242',name:'笔的制造'},{code:'243',name:'教学用模型及教具制造'},{code:'244',name:'工艺美术品制造'},{code:'245',name:'体育用品制造'},{code:'246',name:'玩具制造'},{code:'247',name:'游艺器材及娱乐用品制造'}]},
    { code:'25', name:'石油、煤炭及其他燃料加工业', children:[{code:'251',name:'精炼石油产品制造'},{code:'252',name:'煤炭加工'},{code:'253',name:'核燃料加工'},{code:'259',name:'其他燃料加工业'}]},
    { code:'26', name:'化学原料和化学制品制造业', children:[{code:'261',name:'基础化学原料制造'},{code:'262',name:'化学肥料制造'},{code:'263',name:'农药制造'},{code:'264',name:'涂料、油墨、颜料及类似产品制造'},{code:'265',name:'合成材料制造'},{code:'266',name:'专用化学产品制造'},{code:'267',name:'炸药、火工及焰火产品制造'},{code:'268',name:'日用化学产品制造'}]},
    { code:'27', name:'医药制造业', children:[{code:'271',name:'化学药品原料药制造'},{code:'272',name:'化学药品制剂制造'},{code:'273',name:'中药饮片加工'},{code:'274',name:'中成药生产'},{code:'275',name:'兽用药品制造'},{code:'276',name:'生物药品制品制造'},{code:'277',name:'卫生材料及医药用品制造'}]},
    { code:'28', name:'化学纤维制造业', children:[{code:'281',name:'纤维素纤维原料及纤维制造'},{code:'282',name:'合成纤维制造'}]},
    { code:'29', name:'橡胶和塑料制品业', children:[{code:'291',name:'橡胶制品业'},{code:'292',name:'塑料制品业'}]},
    { code:'30', name:'非金属矿物制品业', children:[{code:'301',name:'水泥、石灰和石膏制造'},{code:'302',name:'石膏、水泥制品及类似制品制造'},{code:'303',name:'砖瓦、石材等建筑材料制造'},{code:'304',name:'玻璃制造'},{code:'305',name:'玻璃制品制造'},{code:'306',name:'玻璃纤维和玻璃纤维增强塑料制品制造'},{code:'307',name:'陶瓷制品制造'},{code:'308',name:'耐火材料制品制造'},{code:'309',name:'石墨及其他非金属矿物制品制造'}]},
    { code:'31', name:'黑色金属冶炼和压延加工业', children:[{code:'311',name:'炼铁'},{code:'312',name:'炼钢'},{code:'313',name:'钢压延加工'},{code:'314',name:'铁合金冶炼'}]},
    { code:'32', name:'有色金属冶炼和压延加工业', children:[{code:'321',name:'常用有色金属冶炼'},{code:'322',name:'贵金属冶炼'},{code:'323',name:'稀有稀土金属冶炼'},{code:'324',name:'有色金属压延加工'}]},
    { code:'33', name:'金属制品业', children:[{code:'331',name:'结构性金属制品制造'},{code:'332',name:'金属工具制造'},{code:'333',name:'集装箱及金属包装容器制造'},{code:'334',name:'金属丝绳及其制品制造'},{code:'335',name:'建筑、安全用金属制品制造'},{code:'336',name:'金属表面处理及热处理加工'},{code:'337',name:'搪瓷制品制造'},{code:'338',name:'金属制日用品制造'},{code:'339',name:'其他金属制品制造'}]},
    { code:'34', name:'通用设备制造业', children:[{code:'341',name:'锅炉及原动设备制造'},{code:'342',name:'金属加工机械制造'},{code:'343',name:'物料搬运机械制造'},{code:'344',name:'泵、阀门、压缩机及类似机械制造'},{code:'345',name:'轴承、齿轮和传动部件制造'},{code:'346',name:'烘炉、风机、衡器、包装等设备制造'},{code:'347',name:'文化、办公用机械制造'},{code:'348',name:'通用零部件制造'},{code:'349',name:'其他通用设备制造'}]},
    { code:'35', name:'专用设备制造业', children:[{code:'351',name:'采矿、冶金、建筑专用设备制造'},{code:'352',name:'化工、木材、非金属加工专用设备制造'},{code:'353',name:'食品、饮料、烟草及饲料生产专用设备制造'},{code:'354',name:'印刷、制药、日化及日用品生产专用设备制造'},{code:'355',name:'纺织、服装和皮革加工专用设备制造'},{code:'356',name:'电子和电工机械专用设备制造'},{code:'357',name:'农、林、牧、渔专用机械制造'},{code:'358',name:'医疗仪器设备及器械制造'},{code:'359',name:'其他专用设备制造'}]},
    { code:'36', name:'汽车制造业', children:[
      { code:'361', name:'汽车整车制造', children:[{code:'3611',name:'载客汽车制造'},{code:'3612',name:'载货汽车制造'},{code:'3619',name:'其他汽车整车制造'}]},
      {code:'362',name:'汽车用发动机制造'},{code:'363',name:'改装汽车制造'},{code:'364',name:'低速汽车制造'},{code:'365',name:'电车制造'},{code:'366',name:'汽车车身、挂车制造'},
      { code:'367', name:'汽车零部件及配件制造', children:[{code:'3671',name:'汽车车身附件及零件制造'},{code:'3672',name:'汽车驾驶系统及零件制造'},{code:'3679',name:'其他汽车零部件及配件制造'}]},
    ]},
    { code:'37', name:'铁路、船舶、航空航天和其他运输设备制造业', children:[{code:'371',name:'铁路运输设备制造'},{code:'372',name:'城市轨道交通设备制造'},{code:'373',name:'船舶及相关装置制造'},{code:'374',name:'航空、航天器及设备制造'},{code:'375',name:'摩托车制造'},{code:'376',name:'自行车和残疾人座车制造'},{code:'377',name:'助动车制造'},{code:'379',name:'其他运输设备制造'}]},
    { code:'38', name:'电气机械和器材制造业', children:[{code:'381',name:'电机制造'},{code:'382',name:'输配电及控制设备制造'},{code:'383',name:'电线、电缆、光缆及电工器材制造'},{code:'384',name:'电池制造'},{code:'385',name:'家用电力器具制造'},{code:'386',name:'非电力家用器具制造'},{code:'387',name:'照明器具制造'},{code:'389',name:'其他电气机械及器材制造'}]},
    { code:'39', name:'计算机、通信和其他电子设备制造业', children:[
      { code:'391', name:'计算机制造', children:[{code:'3911',name:'计算机整机制造'},{code:'3912',name:'计算机零部件制造'},{code:'3913',name:'计算机外围设备制造'},{code:'3919',name:'其他计算机制造'}]},
      { code:'392', name:'通信设备制造', children:[{code:'3921',name:'通信系统设备制造'},{code:'3922',name:'通信终端设备制造'}]},
      {code:'393',name:'广播电视设备制造'},{code:'394',name:'雷达及配套设备制造'},{code:'395',name:'非专业视听设备制造'},{code:'396',name:'智能消费设备制造'},
      { code:'397', name:'电子器件制造', children:[{code:'3971',name:'电子真空器件制造'},{code:'3972',name:'半导体分立器件制造'},{code:'3973',name:'集成电路制造'},{code:'3974',name:'显示器件制造'},{code:'3975',name:'半导体照明器件制造'},{code:'3979',name:'其他电子器件制造'}]},
      {code:'398',name:'电子元件及电子专用材料制造'},{code:'399',name:'其他电子设备制造'},
    ]},
    { code:'40', name:'仪器仪表制造业', children:[{code:'401',name:'通用仪器仪表制造'},{code:'402',name:'专用仪器仪表制造'},{code:'403',name:'钟表与计时仪器制造'},{code:'404',name:'光学仪器制造'},{code:'405',name:'衡器制造'},{code:'409',name:'其他仪器仪表制造'}]},
    { code:'41', name:'其他制造业', children:[{code:'411',name:'日用杂品制造'},{code:'419',name:'其他未列明制造业'}]},
    { code:'42', name:'废弃资源综合利用业', children:[{code:'421',name:'金属废料和碎屑加工处理'},{code:'422',name:'非金属废料和碎屑加工处理'}]},
    { code:'43', name:'金属制品、机械和设备修理业', children:[{code:'431',name:'金属制品修理'},{code:'432',name:'通用设备修理'},{code:'433',name:'专用设备修理'},{code:'434',name:'铁路、船舶、航空航天等运输设备修理'},{code:'435',name:'电气设备修理'},{code:'436',name:'仪器仪表修理'},{code:'439',name:'其他机械和设备修理业'}]},
  ]},
  { code:'D', name:'电力、热力、燃气及水生产和供应业', children:[
    { code:'44', name:'电力、热力生产和供应业', children:[
      { code:'441', name:'电力生产', children:[{code:'4411',name:'火力发电'},{code:'4412',name:'热电联产'},{code:'4413',name:'水力发电'},{code:'4414',name:'核力发电'},{code:'4415',name:'风力发电'},{code:'4416',name:'太阳能发电'},{code:'4419',name:'其他电力生产'}]},
      {code:'442',name:'电力供应'},{code:'443',name:'热力生产和供应'},
    ]},
    { code:'45', name:'燃气生产和供应业', children:[{code:'451',name:'天然气生产和供应业'},{code:'452',name:'液化石油气生产和供应业'},{code:'459',name:'其他燃气生产和供应业'}]},
    { code:'46', name:'水的生产和供应业', children:[{code:'461',name:'自来水生产和供应'},{code:'462',name:'污水处理及其再生利用'},{code:'469',name:'其他水的处理、利用与分配'}]},
  ]},
  { code:'E', name:'建筑业', children:[
    { code:'47', name:'房屋建筑业', children:[{code:'471',name:'住宅房屋建筑'},{code:'472',name:'厂房及工业厂区建筑'},{code:'473',name:'商业及其他非住宅建筑'}]},
    { code:'48', name:'土木工程建筑业', children:[{code:'481',name:'铁路工程建筑'},{code:'482',name:'公路工程建筑'},{code:'483',name:'市政道路工程建筑'},{code:'484',name:'港口与航运工程建筑'},{code:'485',name:'水利工程建筑'},{code:'486',name:'矿山工程建筑'},{code:'487',name:'架线和管道工程建筑'},{code:'489',name:'其他土木工程建筑'}]},
    { code:'49', name:'建筑安装业', children:[{code:'491',name:'电气安装'},{code:'492',name:'管道和设备安装'},{code:'493',name:'建筑智能化工程施工'},{code:'499',name:'其他建筑安装'}]},
    { code:'50', name:'建筑装饰、装修和其他建筑业', children:[{code:'501',name:'建筑装饰和装修业'},{code:'502',name:'建筑工程后期服务和墙体保温及防水作业'},{code:'509',name:'其他建筑业'}]},
  ]},
  { code:'F', name:'批发和零售业', children:[
    { code:'51', name:'批发业', children:[{code:'511',name:'农、林、牧、渔产品批发'},{code:'512',name:'食品、饮料及烟草制品批发'},{code:'513',name:'纺织、服装及家庭用品批发'},{code:'514',name:'文化、体育用品及器材批发'},{code:'515',name:'医药及医疗器材批发'},{code:'516',name:'矿产品、建材及化工产品批发'},{code:'517',name:'机械设备、五金交电及电子产品批发'},{code:'518',name:'贸易经纪与代理'},{code:'519',name:'其他批发业'}]},
    { code:'52', name:'零售业', children:[{code:'521',name:'综合零售'},{code:'522',name:'食品、饮料及烟草制品专门零售'},{code:'523',name:'纺织、服装及日用品专门零售'},{code:'524',name:'文化、体育用品及器材专门零售'},{code:'525',name:'医药及医疗器材专门零售'},{code:'526',name:'汽车、摩托车、燃料及零配件专门零售'},{code:'527',name:'家用电器及电子产品专门零售'},{code:'528',name:'五金、家具及室内装饰材料专门零售'},{code:'529',name:'其他零售业'}]},
  ]},
  { code:'G', name:'交通运输、仓储和邮政业', children:[
    { code:'53', name:'铁路运输业', children:[{code:'531',name:'铁路旅客运输'},{code:'532',name:'铁路货物运输'},{code:'539',name:'其他铁路运输'}]},
    { code:'54', name:'道路运输业', children:[{code:'541',name:'城市公共交通业'},{code:'542',name:'道路旅客运输'},{code:'543',name:'道路货物运输'}]},
    { code:'55', name:'水上运输业', children:[{code:'551',name:'水上旅客运输'},{code:'552',name:'水上货物运输'}]},
    { code:'56', name:'航空运输业', children:[{code:'561',name:'航空旅客运输'},{code:'562',name:'航空货物运输'},{code:'569',name:'其他航空运输'}]},
    {code:'57',name:'管道运输业'},
    { code:'58', name:'多式联运和运输代理业', children:[{code:'581',name:'多式联运'},{code:'582',name:'装卸搬运'},{code:'583',name:'运输代理业'},{code:'589',name:'其他运输代理业'}]},
    { code:'59', name:'装卸搬运和仓储业', children:[{code:'591',name:'装卸搬运'},{code:'592',name:'通用仓储'},{code:'593',name:'冷链仓储'},{code:'599',name:'其他仓储业'}]},
    { code:'60', name:'邮政业', children:[{code:'601',name:'邮政基本服务'},{code:'602',name:'快递服务'}]},
  ]},
  { code:'H', name:'住宿和餐饮业', children:[
    { code:'61', name:'住宿业', children:[{code:'611',name:'旅游饭店'},{code:'612',name:'一般旅馆'},{code:'613',name:'民宿服务'},{code:'619',name:'其他住宿业'}]},
    { code:'62', name:'餐饮业', children:[{code:'621',name:'正餐服务'},{code:'622',name:'快餐服务'},{code:'623',name:'饮料及冷饮服务'},{code:'629',name:'其他餐饮业'}]},
  ]},
  { code:'I', name:'信息传输、软件和信息技术服务业', children:[
    { code:'63', name:'电信、广播电视和卫星传输服务', children:[
      { code:'631', name:'电信', children:[{code:'6311',name:'固定电信服务'},{code:'6312',name:'移动电信服务'},{code:'6319',name:'其他电信服务'}]},
      {code:'632',name:'广播电视传输服务'},{code:'633',name:'卫星传输服务'},
    ]},
    { code:'64', name:'互联网和相关服务', children:[
      { code:'641', name:'互联网接入及相关服务', children:[{code:'6411',name:'互联网接入服务'},{code:'6419',name:'其他互联网接入及相关服务'}]},
      {code:'642',name:'互联网信息服务'},
      { code:'649', name:'其他互联网服务', children:[{code:'6491',name:'互联网安全服务'},{code:'6492',name:'互联网数据服务'},{code:'6499',name:'其他未列明互联网服务'}]},
    ]},
    { code:'65', name:'软件和信息技术服务业', children:[
      { code:'651', name:'软件开发', children:[{code:'6511',name:'基础软件开发'},{code:'6512',name:'支撑软件开发'},{code:'6513',name:'应用软件开发'},{code:'6519',name:'其他软件开发'}]},
      {code:'652',name:'集成电路设计'},
      { code:'653', name:'信息系统集成和物联网技术服务', children:[{code:'6531',name:'信息系统集成服务'},{code:'6532',name:'物联网技术服务'}]},
      { code:'654', name:'运行维护服务', children:[{code:'6541',name:'信息系统运行维护服务'},{code:'6549',name:'其他运行维护服务'}]},
      { code:'655', name:'信息处理和存储支持服务', children:[{code:'6551',name:'信息处理服务'},{code:'6552',name:'数据存储服务'}]},
      {code:'656',name:'信息技术咨询服务'},
      { code:'657', name:'数字内容服务', children:[{code:'6571',name:'互联网游戏服务'},{code:'6572',name:'数字出版'},{code:'6579',name:'其他数字内容服务'}]},
      { code:'659', name:'其他信息技术服务业', children:[{code:'6591',name:'人工智能基础层服务'},{code:'6592',name:'人工智能技术层服务'},{code:'6593',name:'人工智能应用层服务'},{code:'6599',name:'其他未列明信息技术服务业'}]},
    ]},
  ]},
  { code:'J', name:'金融业', children:[
    { code:'66', name:'货币金融服务', children:[{code:'661',name:'中央银行服务'},{code:'662',name:'货币银行服务'},{code:'663',name:'非货币银行服务'}]},
    { code:'67', name:'资本市场服务', children:[{code:'671',name:'证券市场服务'},{code:'672',name:'公开募集基金服务'},{code:'673',name:'非公开募集基金服务'},{code:'674',name:'期货市场服务'},{code:'679',name:'其他资本市场服务'}]},
    { code:'68', name:'保险业', children:[{code:'681',name:'人寿保险'},{code:'682',name:'财产保险'},{code:'683',name:'再保险'},{code:'684',name:'商业养老金及健康保险'},{code:'685',name:'保险辅助服务'}]},
    { code:'69', name:'其他金融业', children:[{code:'691',name:'金融信托与管理服务'},{code:'692',name:'控股公司服务'},{code:'693',name:'非金融机构的资金融通服务'},{code:'699',name:'其他未列明金融业'}]},
  ]},
  { code:'K', name:'房地产业', children:[
    { code:'70', name:'房地产业', children:[
      { code:'701', name:'房地产开发经营', children:[{code:'7010',name:'房地产开发经营'}]},
      { code:'702', name:'物业管理', children:[{code:'7020',name:'物业管理'}]},
      { code:'703', name:'房地产中介服务', children:[{code:'7031',name:'房地产租赁经营'},{code:'7039',name:'其他房地产中介服务'}]},
      {code:'709',name:'其他房地产业'},
    ]},
  ]},
  { code:'L', name:'租赁和商务服务业', children:[
    { code:'71', name:'租赁业', children:[{code:'711',name:'机械设备租赁'},{code:'712',name:'文化及日用品出租'},{code:'719',name:'其他租赁业'}]},
    { code:'72', name:'商务服务业', children:[
      { code:'721', name:'企业管理服务', children:[{code:'7211',name:'投资与资产管理服务'},{code:'7212',name:'创业投资服务'},{code:'7213',name:'企业总部管理服务'},{code:'7219',name:'其他企业管理服务'}]},
      {code:'722',name:'法律服务'},
      { code:'723', name:'咨询与调查', children:[{code:'7231',name:'会计、审计及税务服务'},{code:'7232',name:'市场调查和民意调查'},{code:'7233',name:'管理咨询'},{code:'7239',name:'其他咨询活动'}]},
      {code:'724',name:'广告业'},
      { code:'725', name:'人力资源服务', children:[{code:'7251',name:'职业中介活动'},{code:'7252',name:'劳动力外包服务'},{code:'7253',name:'人力资源管理咨询'},{code:'7254',name:'人才市场活动'},{code:'7259',name:'其他人力资源服务'}]},
      {code:'726',name:'旅行社及相关服务'},{code:'727',name:'知识产权服务'},{code:'728',name:'包装服务'},{code:'729',name:'其他商务服务业'},
    ]},
  ]},
  { code:'M', name:'科学研究和技术服务业', children:[
    { code:'73', name:'研究和试验发展', children:[{code:'731',name:'自然科学研究和试验发展'},{code:'732',name:'工程和技术研究和试验发展'},{code:'733',name:'农业科学研究和试验发展'},{code:'734',name:'医学研究和试验发展'},{code:'735',name:'社会人文科学研究和试验发展'}]},
    { code:'74', name:'专业技术服务业', children:[{code:'741',name:'气象服务'},{code:'742',name:'地震服务'},{code:'743',name:'海洋服务'},{code:'744',name:'测绘及地理信息服务'},{code:'745',name:'质检技术服务'},{code:'746',name:'环境监测及治理服务'},{code:'747',name:'工程技术与设计服务'},{code:'748',name:'工业设计服务'},{code:'749',name:'其他专业技术服务'}]},
    { code:'75', name:'科技推广和应用服务业', children:[{code:'751',name:'技术推广服务'},{code:'752',name:'知识产权服务'},{code:'753',name:'科技中介服务'},{code:'754',name:'地质勘查业'}]},
  ]},
  { code:'N', name:'水利、环境和公共设施管理业', children:[
    { code:'76', name:'水利管理业', children:[{code:'761',name:'防洪除涝设施管理'},{code:'762',name:'水资源管理'},{code:'763',name:'水文服务'},{code:'769',name:'其他水利管理业'}]},
    { code:'77', name:'生态保护和环境治理业', children:[{code:'771',name:'自然保护区管理'},{code:'772',name:'野生动植物保护'},{code:'773',name:'造林和林场管理服务'},{code:'774',name:'水土流失防治服务'},{code:'775',name:'地质灾害防治服务'},{code:'779',name:'其他生态保护'}]},
    { code:'78', name:'公共设施管理业', children:[{code:'781',name:'市政设施管理'},{code:'782',name:'城市绿化管理'},{code:'783',name:'游览景区管理'},{code:'789',name:'其他公共设施管理业'}]},
    {code:'79',name:'土地管理业'},
  ]},
  { code:'O', name:'居民服务、修理和其他服务业', children:[
    { code:'80', name:'居民服务业', children:[{code:'801',name:'家庭服务业'},{code:'802',name:'托儿所服务'},{code:'803',name:'养老服务业'},{code:'804',name:'残障人福利服务'},{code:'809',name:'其他居民服务业'}]},
    { code:'81', name:'机动车、电子产品和日用产品修理业', children:[{code:'811',name:'汽车、摩托车等修理与维护'},{code:'812',name:'计算机和通讯设备修理'},{code:'813',name:'家用电器修理'},{code:'814',name:'日用产品修理'},{code:'819',name:'其他修理业'}]},
    { code:'82', name:'其他服务业', children:[{code:'821',name:'洗染服务'},{code:'822',name:'理发及美容服务'},{code:'823',name:'洗浴和保健养生服务'},{code:'824',name:'摄影扩印服务'},{code:'825',name:'殡葬服务'},{code:'826',name:'宠物服务'},{code:'827',name:'婚姻服务'},{code:'829',name:'其他未列明居民服务'}]},
  ]},
  { code:'P', name:'教育', children:[
    { code:'83', name:'教育', children:[{code:'831',name:'学前教育'},{code:'832',name:'初等教育'},{code:'833',name:'中等教育'},{code:'834',name:'高等教育'},{code:'835',name:'特殊教育'},{code:'836',name:'职业技能培训'},{code:'837',name:'教育辅助活动'},{code:'839',name:'其他教育'}]},
  ]},
  { code:'Q', name:'卫生和社会工作', children:[
    { code:'84', name:'卫生', children:[
      { code:'841', name:'医院', children:[{code:'8411',name:'综合医院'},{code:'8412',name:'中医医院'},{code:'8413',name:'中西医结合医院'},{code:'8414',name:'民族医院'},{code:'8415',name:'专科医院'},{code:'8419',name:'其他医院'}]},
      {code:'842',name:'基层医疗卫生服务'},{code:'843',name:'专业公共卫生服务'},{code:'849',name:'其他卫生活动'},
    ]},
    { code:'85', name:'社会工作', children:[{code:'851',name:'有住宿的社会工作活动'},{code:'852',name:'无住宿的社会工作活动'}]},
  ]},
  { code:'R', name:'文化、体育和娱乐业', children:[
    { code:'86', name:'新闻和出版业', children:[{code:'861',name:'新闻业'},{code:'862',name:'出版业'}]},
    { code:'87', name:'广播、电视、电影和录音制作业', children:[{code:'871',name:'广播'},{code:'872',name:'电视'},{code:'873',name:'电影和影视节目制作、发行及放映'},{code:'874',name:'录音制作业'},{code:'875',name:'多媒体、游戏动漫和数字出版物出版'}]},
    { code:'88', name:'文化艺术业', children:[{code:'881',name:'艺术表演'},{code:'882',name:'图书馆、文化馆及档案馆'},{code:'883',name:'文物及文化保护'},{code:'884',name:'文化创意和设计服务'},{code:'889',name:'其他文化艺术业'}]},
    { code:'89', name:'体育', children:[{code:'891',name:'体育组织'},{code:'892',name:'体育场地设施管理'},{code:'893',name:'体育健身休闲活动'},{code:'899',name:'其他体育业'}]},
    { code:'90', name:'娱乐业', children:[{code:'901',name:'游乐及主题公园'},{code:'902',name:'室内娱乐活动'},{code:'903',name:'休闲观光游览活动'},{code:'909',name:'其他娱乐业'}]},
  ]},
  { code:'S', name:'公共管理、社会保障和社会组织', children:[
    {code:'91',name:'中国共产党机关'},
    { code:'92', name:'国家机构', children:[{code:'921',name:'国家权力机关'},{code:'922',name:'国家行政机关'},{code:'923',name:'国家监察机关'},{code:'924',name:'国家司法机关'},{code:'925',name:'人民政协机关'}]},
    {code:'93',name:'人民政协、民主党派'},
    { code:'94', name:'社会保障', children:[{code:'941',name:'社会保障'}]},
    { code:'95', name:'群众团体、社会团体和其他成员组织', children:[{code:'951',name:'群众团体'},{code:'952',name:'社会团体'},{code:'953',name:'基金会'},{code:'959',name:'其他会员组织'}]},
    { code:'96', name:'基层群众自治组织及其他组织', children:[{code:'961',name:'基层群众自治组织'},{code:'969',name:'其他组织'}]},
  ]},
  { code:'T', name:'国际组织', children:[
    { code:'97', name:'国际组织', children:[{code:'970',name:'国际组织'}]},
  ]},
];

// === 行业四级联动多选组件（门类→大类→中类→小类）===
function IndustryMultiSelect({ value = [], onChange }) {
  const [l1, setL1] = useState('');
  const [l2, setL2] = useState('');
  const [l3, setL3] = useState('');
  const [l4, setL4] = useState('');

  const section   = GB_T_4754.find(s => s.code === l1);
  const majorList = section?.children || [];
  const major     = majorList.find(m => m.code === l2);
  const medList   = major?.children || [];
  const medium    = medList.find(m => m.code === l3);
  const minorList = medium?.children || [];

  const currentLabel = (() => {
    if (l4) { const it = minorList.find(m => m.code === l4); if (it) return `${it.code} ${it.name}`; }
    if (l3) { const it = medList.find(m => m.code === l3);   if (it) return `${it.code} ${it.name}`; }
    if (l2) { const it = majorList.find(m => m.code === l2); if (it) return `${it.code} ${it.name}`; }
    if (l1 && section) return `${section.code} ${section.name}`;
    return '';
  })();

  const handleAdd = () => {
    if (!currentLabel || value.includes(currentLabel)) return;
    onChange([...value, currentLabel]);
  };
  const remove = (item) => onChange(value.filter(v => v !== item));

  const selectCls = "bg-slate-50 border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        <select value={l1} onChange={e => { setL1(e.target.value); setL2(''); setL3(''); setL4(''); }} className={selectCls}>
          <option value="">-- 门类 --</option>
          {GB_T_4754.map(s => <option key={s.code} value={s.code}>{s.code} {s.name}</option>)}
        </select>
        <select value={l2} onChange={e => { setL2(e.target.value); setL3(''); setL4(''); }} disabled={!l1 || majorList.length === 0} className={selectCls}>
          <option value="">-- 大类 --</option>
          {majorList.map(m => <option key={m.code} value={m.code}>{m.code} {m.name}</option>)}
        </select>
        <select value={l3} onChange={e => { setL3(e.target.value); setL4(''); }} disabled={!l2 || medList.length === 0} className={selectCls}>
          <option value="">-- 中类 --</option>
          {medList.map(m => <option key={m.code} value={m.code}>{m.code} {m.name}</option>)}
        </select>
        <select value={l4} onChange={e => setL4(e.target.value)} disabled={!l3 || minorList.length === 0} className={selectCls}>
          <option value="">-- 小类 --</option>
          {minorList.map(m => <option key={m.code} value={m.code}>{m.code} {m.name}</option>)}
        </select>
      </div>
      <button type="button" onClick={handleAdd} disabled={!currentLabel || value.includes(currentLabel)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        + 添加行业标签
      </button>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {value.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 font-medium">
              {v}
              <button type="button" onClick={() => remove(v)} className="text-blue-400 hover:text-blue-700 text-sm leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// === 全新重构的单条线索录入表单 (AddLeadView) ===
function AddLeadView({ onCancel, onSave, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    position: '',
    companyName: '',
    companyEmail: '',
    phone: '',
    email: '',
    wechat: '',
    xiaohongshu: '',
    douyin: '',
    contactNote: '',
    companyNote: '',
    industries: []
  });

  const filterOptions = {
    sources: ['名片', '小红书', '微信', '抖音', '网页搜索', '展会'],
  };

  const handleSubmit = () => {
    // 1. 线索来源必填校验
    if (!formData.source.trim()) {
      showToast('❌ 线索来源为必填项', 'error');
      return;
    }

    // 2. 姓名与公司二选一校验
    const hasNameOrCompany = !!(formData.name.trim() || formData.companyName.trim());
    if (!hasNameOrCompany) {
      showToast('❌ 请至少填写「联系人姓名」或「公司名称」中的一项', 'error');
      return;
    }

    // 3. 联系方式组合校验（至少填写一项）
    const hasContactMethod = !!(formData.phone.trim() || formData.email.trim() || formData.companyEmail.trim() || formData.wechat.trim() || formData.xiaohongshu.trim() || formData.douyin.trim());
    if (!hasContactMethod) {
      showToast('❌ 请至少填写一种联系方式（手机号/邮箱/微信/小红书/抖音）', 'error');
      return;
    }

    // 4. 手机号格式校验（如果填写了）
    if (formData.phone.trim()) {
      const purePhone = formData.phone.replace(/-/g, '');
      if (purePhone.length < 8 || /[a-zA-Z\u4e00-\u9fa5]/.test(purePhone)) {
        showToast('❌ 手机号格式不正确，需要8位以上的数字', 'error');
        return;
      }
    }

    // 5. 邮箱格式校验（如果填写了）
    if (formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showToast('❌ 个人邮箱格式不正确', 'error');
        return;
      }
    }

    if (formData.companyEmail.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
        showToast('❌ 公司邮箱格式不正确', 'error');
        return;
      }
    }

    // 构建统一结构并抛出
    const socialArr = [];
    if (formData.xiaohongshu) socialArr.push(`小红书:${formData.xiaohongshu}`);
    if (formData.douyin) socialArr.push(`抖音:${formData.douyin}`);

    onSave({
      name: formData.name || '未知联系人',
      source: formData.source,
      position: formData.position,
      companyName: formData.companyName || '未知公司', 
      phone: formData.phone,
      email: formData.email || formData.companyEmail,
      wechat: formData.wechat,
      social: socialArr.join(' | ') || '暂无',
      contactNote: formData.contactNote,
      companyNote: formData.companyNote,
      industry: formData.industries.join('、') || '未知行业',
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 pb-20">
      <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"><ChevronLeft size={16} className="mr-1" /> 返回线索列表</button>
      
      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        {/* 表单头部 */}
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">录入新线索</h2>
            <p className="text-sm text-slate-500 mt-2">
              手动创建市场线索。请注意：姓名与公司名至少填一项，联系方式至少填一项。
            </p>
          </div>
        </div>

        {/* 核心表单区域 */}
        <div className="p-10">
          
          {/* 独立第一行：线索来源 */}
          <section className="mb-10 bg-blue-50/40 p-6 border border-blue-100/50 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm shrink-0 text-blue-600 hidden md:flex">
              <LinkIcon size={20} />
            </div>
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-bold text-slate-800 mb-2">线索来源渠道 <span className="text-rose-500">*</span></label>
              <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full bg-white border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer shadow-sm">
                <option value="" disabled>请选择获取该线索的来源...</option>
                {filterOptions.sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </section>

          {/* 左右双列布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 左列：公司全局信息 */}
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Building2 size={18} className="text-blue-600"/> 公司与业务信息
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">公司全称</label>
                  <CompanyAutocomplete value={formData.companyName} onChange={val => setFormData({...formData, companyName: val})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all" placeholder="请输入关联公司全称..." />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">所属行业</label>
                  <IndustryMultiSelect value={formData.industries} onChange={v => setFormData({...formData, industries: v})} />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">公司统一邮箱</label>
                  <input type="text" value={formData.companyEmail} onChange={e => setFormData({...formData, companyEmail: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all" placeholder="如: contact@company.com" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">公司全局备注</label>
                  <textarea value={formData.companyNote} onChange={e => setFormData({...formData, companyNote: e.target.value})} rows="5" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all resize-none" placeholder="记录该公司的预算、业务痛点、采购周期等背景信息..."></textarea>
                </div>
              </div>
            </div>

            {/* 右列：联系人明细 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <User size={18} className="text-emerald-600"/> 个人联系人明细
                </h3>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">联系人姓名</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all" placeholder="如: 王建国" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">职位/头衔</label>
                    <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all" placeholder="如: 采购总监" />
                  </div>
                </div>

                {/* 联络矩阵：使用双列紧凑布局 */}
                <div className="grid grid-cols-2 gap-5 p-5 bg-slate-50/50 border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">手机号</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all" placeholder="常用联系手机" />
                    {formData.phone && (
                      <div className="mt-1 text-[11px] flex items-center gap-1">
                        {(() => {
                          const purePhone = formData.phone.replace(/-/g, '');
                          const isValid = purePhone.length >= 8 && !/[a-zA-Z\u4e00-\u9fa5]/.test(purePhone);
                          return isValid ? (
                            <span className="text-emerald-600">✓ 格式有效</span>
                          ) : (
                            <span className="text-rose-500">⚠ 格式错误: 需8位数字以上</span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">微信号</label>
                    <input type="text" value={formData.wechat} onChange={e => setFormData({...formData, wechat: e.target.value})} className="w-full bg-white border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all" placeholder="微信号码" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">个人邮箱</label>
                    <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all" placeholder="如: personal@gmail.com" />
                    {formData.email && (
                      <div className="mt-1 text-[11px] flex items-center gap-1">
                        {(() => {
                          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
                          return isValid ? (
                            <span className="text-emerald-600">✓ 邮箱格式有效</span>
                          ) : (
                            <span className="text-rose-500">⚠ 邮箱格式错误</span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">小红书 ID</label>
                    <input type="text" value={formData.xiaohongshu} onChange={e => setFormData({...formData, xiaohongshu: e.target.value})} className="w-full bg-white border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all" placeholder="小红书号" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">抖音 ID</label>
                    <input type="text" value={formData.douyin} onChange={e => setFormData({...formData, douyin: e.target.value})} className="w-full bg-white border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all" placeholder="抖音号" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">联系人专属备注</label>
                  <textarea value={formData.contactNote} onChange={e => setFormData({...formData, contactNote: e.target.value})} rows="3" className="w-full bg-slate-50 border border-slate-200 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all resize-none" placeholder="记录该联系人的沟通偏好、性格特征等..."></textarea>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 表单底栏 */}
        <div className="px-10 py-6 bg-slate-50 flex justify-end gap-4 border-t border-slate-100 mt-4">
          <button onClick={onCancel} className="px-8 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">取消录入</button>
          <button onClick={handleSubmit} className="px-10 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2">
             <Check size={18}/> 保存并入库
          </button>
        </div>
      </div>
    </div>
  );
}

// === 视图 3B：名片识别 (完整流程) ===
function BatchOcrView({ onCancel, onSaveBatch, showToast }) {
  const [stage, setStage] = useState('upload'); // upload -> recognizing -> review
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [listFilter, setListFilter] = useState('all');
  const [recognitionProgress, setRecognitionProgress] = useState(0);
  const [processingRowId, setProcessingRowId] = useState(null);
  const [isAppendingRecognizing, setIsAppendingRecognizing] = useState(false);

  const maxCards = 10;
  const existingContacts = [
    { phone: '13812345678', name: '张三', company: '阿里巴巴' },
    { phone: '13998765432', name: '李四', company: '腾讯' }
  ];

  const normalizePhone = (v) => (v || '').replace(/\D/g, '');

  const validateRows = (rows) => {
    const duplicateMap = {};
    rows.forEach((r) => {
      const key = `${(r.name || '').trim().toLowerCase()}@@${(r.company || '').trim().toLowerCase()}@@${normalizePhone(r.phone)}`;
      duplicateMap[key] = (duplicateMap[key] || 0) + 1;
    });

    return rows.map((r) => {
      const errors = [];
      const warnings = [];
      const phone = normalizePhone(r.phone);

      if (!r.name?.trim()) errors.push('姓名必填');
      if (!r.company?.trim()) errors.push('公司必填');
      if (phone && !/^1[3-9]\d{9}$/.test(phone)) errors.push('电话格式错误');
      if (r.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim())) errors.push('邮箱格式错误');

      const sysDuplicate = existingContacts.some((c) => c.phone === phone || ((c.name || '').toLowerCase() === (r.name || '').toLowerCase() && (c.company || '').toLowerCase() === (r.company || '').toLowerCase()));
      if (sysDuplicate) warnings.push('系统已存在相似联系人');

      const batchKey = `${(r.name || '').trim().toLowerCase()}@@${(r.company || '').trim().toLowerCase()}@@${phone}`;
      const inBatchDuplicate = duplicateMap[batchKey] > 1 && (r.name || r.company || phone);
      if (inBatchDuplicate) warnings.push('本次识别结果内存在重复');

      const isDuplicate = sysDuplicate || inBatchDuplicate;
      const status = errors.length > 0 ? 'error' : isDuplicate ? 'duplicate' : 'ok';
      return { ...r, errors, warnings, isDuplicate, status };
    });
  };

  const generateMockRecognition = (file, id, preferSuccess = false) => {
    const base = file.name.replace(/\.[^.]+$/, '');
    const failChance = preferSuccess ? 0.15 : 0.35;
    const shouldFail = Math.random() < failChance;
    const rawPhone = `13${String(100000000 + id).slice(-9)}`;

    if (shouldFail) {
      return {
        id,
        fileName: file.name,
        imageUrl: URL.createObjectURL(file),
        name: '',
        position: '待识别',
        company: '',
        phone: rawPhone.slice(0, 9),
        email: `${base}@`,
        industry: '',
        wechat: '',
      };
    }

    return {
      id,
      fileName: file.name,
      imageUrl: URL.createObjectURL(file),
      name: base.slice(0, 6) || `联系人${id}`,
      position: '销售总监',
      company: `${base.slice(0, 6) || '示例'}科技有限公司`,
      phone: rawPhone,
      email: `${base.toLowerCase().replace(/\s+/g, '') || `user${id}`}@example.com`,
      industry: '企业服务',
      wechat: `wx_${id}`,
    };
  };

  const resetAll = () => {
    ocrResults.forEach((r) => {
      if (r.imageUrl) URL.revokeObjectURL(r.imageUrl);
    });
    setStage('upload');
    setUploadedFiles([]);
    setOcrResults([]);
    setSelectedResults(new Set());
    setActiveId(null);
    setRecognitionProgress(0);
    setProcessingRowId(null);
  };

  const handleFileUpload = (e, appendMode = false) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => ['image/jpeg', 'image/png', 'image/jpg'].includes(f.type));
    e.target.value = '';

    if (validFiles.length === 0) {
      showToast('❌ 请上传有效图片文件 (JPG/PNG)', 'error');
      return;
    }

    const currentCount = appendMode ? ocrResults.length : 0;
    const remaining = maxCards - currentCount;
    if (remaining <= 0) {
      showToast(`❌ 当前已达上限 ${maxCards} 张，请先删除后再添加`, 'error');
      return;
    }
    if (validFiles.length > maxCards || validFiles.length > remaining) {
      showToast('❌ 此次上传超过十张', 'error');
      return;
    }

    if (appendMode) {
      setIsAppendingRecognizing(true);
    } else {
      setUploadedFiles(validFiles);
      setStage('recognizing');
    }
    setRecognitionProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setRecognitionProgress(100);
        const rawRows = validFiles.map((file, idx) => generateMockRecognition(file, Date.now() + idx, false));
        const validated = validateRows(rawRows);

        if (appendMode) {
          const newIdSet = new Set(validated.map((r) => r.id));
          const merged = validateRows([...ocrResults, ...validated]);
          setUploadedFiles((prev) => [...prev, ...validFiles]);
          setOcrResults(merged);
          setSelectedResults((prev) => {
            const next = new Set([...prev].filter((id) => merged.some((r) => r.id === id && r.status === 'ok')));
            merged.forEach((row) => {
              if (newIdSet.has(row.id) && row.status === 'ok') next.add(row.id);
            });
            return next;
          });
          setActiveId(validated[0]?.id || activeId || merged[0]?.id || null);
          setIsAppendingRecognizing(false);
          showToast(`✅ 新增识别完成，共 ${validated.length} 张名片`);
        } else {
          setOcrResults(validated);
          setSelectedResults(new Set(validated.filter((r) => r.status === 'ok').map((r) => r.id)));
          setActiveId(validated[0]?.id || null);
          setStage('review');
          showToast(`✅ 识别完成，共 ${validated.length} 张名片`);
        }
      } else {
        setRecognitionProgress(progress);
      }
    }, 250);
  };

  const handleEdit = (id, field, value) => {
    const updated = ocrResults.map((r) => r.id === id ? { ...r, [field]: value } : r);
    const validated = validateRows(updated);
    setOcrResults(validated);

    const validIds = new Set(validated.filter((r) => r.status === 'ok').map((r) => r.id));
    setSelectedResults((prev) => new Set([...prev].filter((x) => validIds.has(x))));
  };

  const toggleSelect = (id) => {
    const row = ocrResults.find((r) => r.id === id);
    if (!row || row.status !== 'ok') return;
    const next = new Set(selectedResults);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedResults(next);
  };

  const handleDeleteRow = (id) => {
    const current = ocrResults.find((r) => r.id === id);
    if (current?.imageUrl) URL.revokeObjectURL(current.imageUrl);

    const filtered = ocrResults.filter((r) => r.id !== id);
    const validated = validateRows(filtered);
    setOcrResults(validated);
    setSelectedResults(new Set([...selectedResults].filter((x) => x !== id && validated.some((r) => r.id === x && r.status === 'ok'))));
    if (activeId === id) setActiveId(validated[0]?.id || null);
    showToast('✅ 已删除该条名片记录');
  };

  const handleReRecognize = (id) => {
    const row = ocrResults.find((r) => r.id === id);
    const file = uploadedFiles.find((f) => f.name === row?.fileName);
    if (!row || !file) {
      showToast('❌ 未找到原始名片文件，无法重识别', 'error');
      return;
    }

    setProcessingRowId(id);
    setTimeout(() => {
      const refreshed = generateMockRecognition(file, id, true);
      const merged = ocrResults.map((r) => r.id === id ? { ...refreshed, imageUrl: r.imageUrl } : r);
      const validated = validateRows(merged);
      setOcrResults(validated);
      if (validated.find((r) => r.id === id)?.status === 'ok') {
        setSelectedResults((prev) => new Set([...prev, id]));
        showToast('✅ 该名片已重新识别成功');
      } else {
        showToast('⚠️ 重识别后仍有错误，请手动修正字段', 'error');
      }
      setProcessingRowId(null);
    }, 900);
  };

  const handleConfirm = () => {
    const selected = ocrResults.filter((r) => selectedResults.has(r.id) && r.status === 'ok');
    if (selected.length === 0) {
      showToast('❌ 请至少选择 1 条可导入名片', 'error');
      return;
    }
    const payload = selected.map(({ errors, warnings, isDuplicate, status, imageUrl, fileName, ...rest }) => rest);
    onSaveBatch(payload);
  };

  const activeRow = ocrResults.find((r) => r.id === activeId) || null;
  const okCount = ocrResults.filter((r) => r.status === 'ok').length;
  const errorCount = ocrResults.filter((r) => r.status === 'error').length;
  const duplicateCount = ocrResults.filter((r) => r.status === 'duplicate').length;
  const filteredRows = ocrResults.filter((r) => {
    if (listFilter === 'error') return r.status === 'error';
    if (listFilter === 'ok') return r.status === 'ok';
    if (listFilter === 'duplicate') return r.status === 'duplicate';
    return true;
  });
  const selectableFilteredIds = filteredRows.filter((r) => r.status === 'ok').map((r) => r.id);
  const selectedInFilteredCount = selectableFilteredIds.filter((id) => selectedResults.has(id)).length;

  const handleSelectAllFiltered = () => {
    const next = new Set(selectedResults);
    selectableFilteredIds.forEach((id) => next.add(id));
    setSelectedResults(next);
  };

  const handleInvertFiltered = () => {
    const next = new Set(selectedResults);
    selectableFilteredIds.forEach((id) => {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    });
    setSelectedResults(next);
  };

  useEffect(() => {
    if (stage !== 'review') return;
    if (!filteredRows.some((r) => r.id === activeId)) {
      setActiveId(filteredRows[0]?.id || null);
    }
  }, [listFilter, ocrResults, stage]);

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-4">
              <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors w-fit">
                <ChevronLeft size={16} className="mr-1" /> 返回线索列表
              </button>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">名片识别工作台</h3>
                <p className="text-sm text-slate-500 mt-1">单次最多 10 张，错误数据支持重识别；左图右侧可编辑校对</p>
              </div>
            </div>
            {stage === 'review' && (
              <>
                <input type="file" multiple accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleFileUpload(e, true)} className="hidden" id="ocrAppendInput" />
                <label htmlFor="ocrAppendInput" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">添加名片</label>
              </>
            )}
          </div>
        </div>

        <div className="p-8">
          {stage === 'upload' && (
            <div className="max-w-3xl mx-auto">
              <div className="border-2 border-dashed border-slate-300 p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <input type="file" multiple accept="image/jpeg,image/png,image/jpg" onChange={handleFileUpload} className="hidden" id="ocrImageInput" />
                <label htmlFor="ocrImageInput" className="cursor-pointer block">
                  <Camera size={40} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">上传名片图片（JPG/PNG）</p>
                  <p className="text-xs text-slate-500 mt-1">一次最多 {maxCards} 张；超过请分批识别</p>
                </label>
              </div>
            </div>
          )}

          {stage === 'recognizing' && (
            <div className="max-w-xl mx-auto py-14 text-center">
              <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-700 font-medium">正在识别名片信息...</p>
              <div className="w-full mt-4 h-2 bg-slate-200 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${recognitionProgress}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">{recognitionProgress}%</p>
            </div>
          )}

          {stage === 'review' && (
            <>
              {isAppendingRecognizing && (
                <div className="mb-6 border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 size={18} className="text-blue-600 animate-spin" />
                    <p className="text-sm font-bold text-blue-700">正在识别新增名片，请稍候...</p>
                  </div>
                  <div className="w-full mt-3 h-2 bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${recognitionProgress}%` }} />
                  </div>
                  <p className="text-xs text-blue-700 mt-2">{recognitionProgress}%</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-1 w-full lg:w-[430px] flex flex-col h-full min-h-[620px]">
                  <div className="border border-slate-200 flex flex-col flex-1 min-h-0">
                    <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-2">
                      <button onClick={() => setListFilter('all')} className={`px-3 py-1.5 text-xs font-bold border transition-colors ${listFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>全部（{ocrResults.length}）</button>
                      <button onClick={() => setListFilter('error')} className={`px-3 py-1.5 text-xs font-bold border transition-colors ${listFilter === 'error' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>错误（{errorCount}）</button>
                      <button onClick={() => setListFilter('ok')} className={`px-3 py-1.5 text-xs font-bold border transition-colors ${listFilter === 'ok' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>可导入（{okCount}）</button>
                      <button onClick={() => setListFilter('duplicate')} className={`px-3 py-1.5 text-xs font-bold border transition-colors ${listFilter === 'duplicate' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>重复（{duplicateCount}）</button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto">
                      {filteredRows.length === 0 && <div className="p-8 text-center text-sm text-slate-400">当前筛选条件下暂无数据</div>}
                      {filteredRows.map((row) => {
                        const isSelectable = row.status === 'ok';
                        const isSelected = selectedResults.has(row.id);
                        return (
                          <div
                            key={row.id}
                            onClick={() => setActiveId(row.id)}
                            className={`w-full text-left p-3 border-b border-slate-100 transition-colors cursor-pointer ${activeId === row.id ? 'bg-blue-50' : 'hover:bg-slate-50'} ${!isSelectable ? 'opacity-60' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center gap-2">
                                <input
                                  type="checkbox"
                                  disabled={!isSelectable}
                                  checked={isSelected}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => toggleSelect(row.id)}
                                  className="accent-blue-600 disabled:opacity-50 cursor-pointer"
                                />
                              </div>
                              <img src={row.imageUrl} alt={row.fileName} className="w-16 h-16 object-cover border border-slate-200" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-700 truncate">{row.fileName}</p>
                                <p className="text-xs text-slate-500 truncate mt-1">{row.name || '未识别姓名'} / {row.company || '未识别公司'}</p>
                                <div className="mt-2 flex gap-1 flex-wrap">
                                  {row.status === 'ok' && <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700">可导入</span>}
                                  {row.status === 'error' && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700">识别错误（不可选）</span>}
                                  {row.status === 'duplicate' && <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700">重复冲突（不可选）</span>}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRow(row.id);
                                }}
                                className="self-center p-1 text-slate-400 hover:text-red-600 transition-colors"
                                title="删除此条"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50 p-3 flex flex-wrap items-center gap-2">
                      <button onClick={handleSelectAllFiltered} disabled={selectableFilteredIds.length === 0} className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors">全选</button>
                      <button onClick={handleInvertFiltered} disabled={selectableFilteredIds.length === 0} className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors">反选</button>
                      <span className="ml-auto text-xs text-slate-500">已选 {selectedInFilteredCount}/{selectableFilteredIds.length}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 border border-slate-200 p-5">
                  {activeRow ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-2">原图预览</p>
                        <div className="border border-slate-200 bg-slate-50 p-2">
                          <img src={activeRow.imageUrl} alt={activeRow.fileName} className="w-full h-[360px] object-contain bg-white" />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => handleReRecognize(activeRow.id)} disabled={processingRowId === activeRow.id} className="px-4 py-2 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-60 transition-colors flex items-center gap-1">
                            {processingRowId === activeRow.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 重新识别
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="mb-3">
                          <p className="text-xs font-bold text-slate-500">识别数据（可编辑）</p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">姓名</label>
                            <input type="text" value={activeRow.name || ''} onChange={(e) => handleEdit(activeRow.id, 'name', e.target.value)} className="w-full border border-slate-200 p-2.5 text-sm bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">职位</label>
                            <input type="text" value={activeRow.position || ''} onChange={(e) => handleEdit(activeRow.id, 'position', e.target.value)} className="w-full border border-slate-200 p-2.5 text-sm bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">公司</label>
                            <input type="text" value={activeRow.company || ''} onChange={(e) => handleEdit(activeRow.id, 'company', e.target.value)} className="w-full border border-slate-200 p-2.5 text-sm bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">电话</label>
                            <input type="text" value={activeRow.phone || ''} onChange={(e) => handleEdit(activeRow.id, 'phone', e.target.value)} className="w-full border border-slate-200 p-2.5 text-sm bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">邮箱</label>
                            <input type="text" value={activeRow.email || ''} onChange={(e) => handleEdit(activeRow.id, 'email', e.target.value)} className="w-full border border-slate-200 p-2.5 text-sm bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">微信</label>
                            <input type="text" value={activeRow.wechat || ''} onChange={(e) => handleEdit(activeRow.id, 'wechat', e.target.value)} className="w-full border border-slate-200 p-2.5 text-sm bg-white" />
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {activeRow.errors?.map((err, idx) => <span key={`e-${idx}`} className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700">{err}</span>)}
                          {activeRow.warnings?.map((w, idx) => <span key={`w-${idx}`} className="px-2 py-1 text-xs font-bold bg-orange-100 text-orange-700">{w}</span>)}
                          {activeRow.status === 'ok' && <span className="px-2 py-1 text-xs font-bold bg-emerald-100 text-emerald-700">当前可导入</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[420px] flex items-center justify-center text-slate-400">请选择左侧名片查看详情</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {stage === 'review' && (
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-sm text-slate-600">已选择 {selectedResults.size} 条可导入名片</span>
            <button
              onClick={handleConfirm}
              disabled={selectedResults.size === 0}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Check size={16} /> 导入线索池
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === 视图 3C：批量导入工作台（独立页面） ===
function ImportLeadView({ onCancel, onConfirm, onPartialImport, showToast, existingLeads = [] }) {
  const [stage, setStage] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [importData, setImportData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeGroup, setActiveGroup] = useState('all');

  const pageSize = 50;
  const enrichmentApiEndpoint = '/api/leads/enrich';

  const normalizeText = (v) => (v || '').trim().toLowerCase();
  const normalizePhone = (v) => (v || '').replace(/\D/g, '');
  const normalizeEmail = (v) => (v || '').trim().toLowerCase();

  const groupPredicate = useCallback((row, groupKey) => {
    if (groupKey === 'ok') return row.status === 'ok';
    if (groupKey === 'error') return row.status === 'error';
    if (groupKey === 'duplicate') return row.status === 'duplicate';
    if (groupKey === 'missing') return (row.missingFields || []).length > 0;
    if (groupKey === 'enriched') return Boolean(row.enrichmentSource);
    return true;
  }, []);

  const matchesActiveGroup = useCallback((row) => groupPredicate(row, activeGroup), [activeGroup, groupPredicate]);

  const getIndustryByCompany = (company) => {
    if (!company) return '未知行业';
    if (/科技|智能|AI|网络|软件/i.test(company)) return '人工智能';
    if (/汽车|新能源/i.test(company)) return '智能制造';
    if (/传媒|广告|抖音|小红书/i.test(company)) return '数字营销';
    if (/金融|银行|证券/i.test(company)) return '金融服务';
    return '企业服务';
  };

  const parseCsvLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const parseCsvText = (text) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (!lines.length) return [];

    const header = parseCsvLine(lines[0]).map((h) => h.replace(/^\uFEFF/, '').trim().toLowerCase());
    const indexMap = {
      name: header.findIndex((h) => ['姓名', '姓名*', 'name'].includes(h)),
      companyName: header.findIndex((h) => ['公司', '公司*', '公司名称', 'company', 'companyname'].includes(h)),
      position: header.findIndex((h) => ['职位', 'position'].includes(h)),
      phone: header.findIndex((h) => ['电话', '手机号', 'phone', 'mobile'].includes(h)),
      email: header.findIndex((h) => ['邮箱', 'email'].includes(h)),
      industry: header.findIndex((h) => ['行业', 'industry'].includes(h))
    };

    const hasHeader = Object.values(indexMap).some((idx) => idx !== -1);
    const dataLines = hasHeader ? lines.slice(1) : lines;

    return dataLines
      .map((line, idx) => {
        const cols = parseCsvLine(line);
        const item = {
          id: idx + 1,
          name: (indexMap.name !== -1 ? cols[indexMap.name] : cols[0] || '').trim(),
          companyName: (indexMap.companyName !== -1 ? cols[indexMap.companyName] : cols[1] || '').trim(),
          position: (indexMap.position !== -1 ? cols[indexMap.position] : cols[2] || '').trim(),
          phone: (indexMap.phone !== -1 ? cols[indexMap.phone] : cols[3] || '').trim(),
          email: (indexMap.email !== -1 ? cols[indexMap.email] : cols[4] || '').trim(),
          industry: (indexMap.industry !== -1 ? cols[indexMap.industry] : cols[5] || '').trim()
        };
        return item;
      })
      .filter((item) => Object.values(item).some((v) => String(v).trim() !== ''));
  };

  const parseExcelFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) return [];

    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const pickValue = (obj, candidates) => {
      for (const key of Object.keys(obj)) {
        const normalized = String(key).trim().toLowerCase();
        if (candidates.includes(normalized)) return String(obj[key] || '').trim();
      }
      return '';
    };

    return rawRows
      .map((row, idx) => ({
        id: idx + 1,
        name: pickValue(row, ['姓名', '姓名*', 'name']),
        companyName: pickValue(row, ['公司', '公司*', '公司名称', 'company', 'companyname']),
        position: pickValue(row, ['职位', 'position']),
        phone: pickValue(row, ['电话', '手机号', 'phone', 'mobile']),
        email: pickValue(row, ['邮箱', 'email']),
        industry: pickValue(row, ['行业', 'industry'])
      }))
      .filter((item) => Object.values(item).some((v) => String(v).trim() !== ''));
  };

  const validateAndAnnotate = (rows) => {
    const existingNameCompanySet = new Set(existingLeads.map((l) => `${normalizeText(l.name)}@@${normalizeText(l.company || l.companyName)}`).filter((x) => x !== '@@'));
    const existingPhoneSet = new Set(existingLeads.map((l) => normalizePhone(l.phone)).filter(Boolean));
    const existingEmailSet = new Set(existingLeads.map((l) => normalizeEmail(l.email)).filter(Boolean));

    const nameCompanyCount = {};
    const phoneCount = {};
    const emailCount = {};

    rows.forEach((row) => {
      const nameCompanyKey = `${normalizeText(row.name)}@@${normalizeText(row.companyName)}`;
      const phoneKey = normalizePhone(row.phone);
      const emailKey = normalizeEmail(row.email);

      if (nameCompanyKey !== '@@') nameCompanyCount[nameCompanyKey] = (nameCompanyCount[nameCompanyKey] || 0) + 1;
      if (phoneKey) phoneCount[phoneKey] = (phoneCount[phoneKey] || 0) + 1;
      if (emailKey) emailCount[emailKey] = (emailCount[emailKey] || 0) + 1;
    });

    return rows.map((row) => {
      const errors = [];
      const duplicateReasons = [];
      const missingFields = [];

      const nameCompanyKey = `${normalizeText(row.name)}@@${normalizeText(row.companyName)}`;
      const phoneKey = normalizePhone(row.phone);
      const emailKey = normalizeEmail(row.email);

      if (!row.name?.trim()) {
        errors.push('姓名必填');
        missingFields.push('name');
      }
      if (!row.companyName?.trim()) {
        errors.push('公司必填');
        missingFields.push('companyName');
      }
      if (!row.position?.trim()) missingFields.push('position');
      if (!row.phone?.trim()) missingFields.push('phone');
      if (!row.email?.trim()) missingFields.push('email');
      if (!row.industry?.trim()) missingFields.push('industry');

      if (row.phone?.trim() && !/^1[3-9]\d{9}$/.test(phoneKey)) errors.push('电话格式错误');
      if (row.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) errors.push('邮箱格式错误');

      if (nameCompanyKey !== '@@' && existingNameCompanySet.has(nameCompanyKey)) duplicateReasons.push('与现有线索姓名+公司重复');
      if (phoneKey && existingPhoneSet.has(phoneKey)) duplicateReasons.push('与现有线索电话重复');
      if (emailKey && existingEmailSet.has(emailKey)) duplicateReasons.push('与现有线索邮箱重复');
      if (nameCompanyKey !== '@@' && nameCompanyCount[nameCompanyKey] > 1) duplicateReasons.push('本次导入中姓名+公司重复');
      if (phoneKey && phoneCount[phoneKey] > 1) duplicateReasons.push('本次导入中电话重复');
      if (emailKey && emailCount[emailKey] > 1) duplicateReasons.push('本次导入中邮箱重复');

      return {
        ...row,
        errors,
        duplicateReasons,
        missingFields,
        isDuplicate: duplicateReasons.length > 0,
        status: errors.length > 0 ? 'error' : (duplicateReasons.length > 0 ? 'duplicate' : 'ok')
      };
    });
  };

  const revalidateAndSet = (rows, keepSelection = true) => {
    const validated = validateAndAnnotate(rows);
    setImportData(validated);

    const validIds = new Set(validated.filter((r) => r.status === 'ok').map((r) => r.id));
    if (!keepSelection) {
      setSelectedRows(validIds);
    } else {
      const nextSelection = new Set([...selectedRows].filter((id) => validIds.has(id)));
      setSelectedRows(nextSelection);
    }
  };

  const normalizeEnrichment = (row, payload, fallbackSource = '爬虫服务') => {
    const safe = payload || {};
    const confidenceRaw = Number(safe.confidence);
    const confidence = Number.isFinite(confidenceRaw) ? Math.max(0, Math.min(100, Math.round(confidenceRaw))) : null;
    return {
      ...row,
      position: safe.position || row.position,
      companyName: safe.companyName || row.companyName,
      industry: safe.industry || row.industry,
      phone: safe.phone || row.phone,
      email: safe.email || row.email,
      enrichmentSource: safe.source || fallbackSource,
      enrichmentConfidence: confidence,
      enrichmentCompanyId: safe.companyId || row.enrichmentCompanyId || null,
      enrichmentWebsite: safe.website || row.enrichmentWebsite || null,
      enrichmentTraceId: safe.crawlTraceId || row.enrichmentTraceId || null,
      enrichmentTime: new Date().toLocaleString()
    };
  };

  const enrichByCrawlerService = async (rows) => {
    const requestId = `req-${Date.now()}`;
    const payload = {
      requestId,
      schemaVersion: '2026-04-16',
      records: rows.map((row) => ({
        id: row.id,
        name: row.name,
        companyName: row.companyName,
        position: row.position,
        phone: row.phone,
        email: row.email,
        industry: row.industry,
        missingFields: row.missingFields || [],
        metadata: {
          source: 'crm-bulk-import',
          importedAt: new Date().toISOString()
        }
      })),
      options: {
        enrichMissingOnly: true,
        withCompanyIdentity: true,
        withTrace: true
      }
    };

    const response = await fetch(enrichmentApiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`enrichment api failed: ${response.status}`);
    }

    const data = await response.json();
    const records = Array.isArray(data?.records)
      ? data.records
      : (Array.isArray(data?.data?.records) ? data.data.records : []);
    const resultMap = new Map(records.map((item) => [item.id, item]));

    return rows.map((row) => {
      const matched = resultMap.get(row.id);
      if (!matched) return row;
      return normalizeEnrichment(row, matched, '爬虫服务');
    });
  };

  const enrichWithFallback = async (rows) => {
    try {
      const enrichedRows = await enrichByCrawlerService(rows);
      return { rows: enrichedRows, mode: 'api' };
    } catch (error) {
      const localEnrichedRows = rows.map((row) => {
        if (!row.missingFields?.length) return row;
        const localPayload = {
          position: row.position?.trim() ? row.position : '待确认',
          companyName: row.companyName?.trim() ? row.companyName : `${row.name || '未知'}科技有限公司`,
          industry: row.industry?.trim() ? row.industry : getIndustryByCompany(row.companyName),
          phone: row.phone?.trim() ? row.phone : `13${String(100000000 + row.id).slice(-9)}`,
          email: row.email?.trim() ? row.email : `lead${row.id}@example.com`,
          website: row.companyName?.trim() ? `https://www.${row.companyName.replace(/\s+/g, '').replace(/[（(].*?[）)]/g, '').replace(/有限公司|集团|科技|股份/g, '').toLowerCase()}.com` : null,
          companyId: `CMP-LOCAL-${String(row.id).padStart(6, '0')}`,
          crawlTraceId: `TRACE-LOCAL-${Date.now()}-${row.id}`,
          source: '本地规则回退',
          confidence: 72
        };
        return normalizeEnrichment(row, localPayload, '本地规则回退');
      });
      return { rows: localEnrichedRows, mode: 'fallback' };
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['姓名*', '公司*', '职位', '电话', '邮箱', '行业'];
    const examples = [
      ['张三', '北京示例科技有限公司', '销售总监', '13800138000', 'zhangsan@example.com', '企业服务'],
      ['李四', '上海未来智能有限公司', '市场经理', '13900139000', 'lisi@example.com', '人工智能']
    ];
    const csvRows = [headers.join(','), ...examples.map((row) => row.join(','))];
    const csvContent = `\uFEFF${csvRows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = '线索批量导入模板.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast?.('✅ 已下载导入模板，请按模板填写后上传');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setStage('upload');
    setActiveGroup('all');
    showToast?.(`已选择文件：${file.name}`);
  };

  const handleRecognize = async () => {
    if (!selectedFile) {
      showToast?.('❌ 请先选择导入文件', 'error');
      return;
    }

    const lowerName = selectedFile.name.toLowerCase();
    if (!(lowerName.endsWith('.csv') || lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls'))) {
      showToast?.('❌ 文件类型不支持，请上传 csv / xlsx / xls 文件', 'error');
      return;
    }

    setIsProcessing(true);
    setStage('processing');

    try {
      let parsedRows = [];
      if (lowerName.endsWith('.csv')) {
        const content = await selectedFile.text();
        parsedRows = parseCsvText(content);
      } else {
        parsedRows = await parseExcelFile(selectedFile);
      }

      if (!parsedRows.length) {
        showToast?.('❌ 未识别到有效数据，请检查模板列名和内容', 'error');
        setIsProcessing(false);
        setStage('upload');
        return;
      }

      const validated = validateAndAnnotate(parsedRows);
      setImportData(validated);
      setSelectedRows(new Set(validated.filter((r) => r.status === 'ok').map((r) => r.id)));
      setCurrentPage(1);
      setActiveGroup('all');
      setStage('review');
      showToast?.(`✅ 识别完成，共 ${validated.length} 条，已自动完成格式校验与查重`);
    } catch (error) {
      showToast?.('❌ 文件识别失败，请检查文件内容', 'error');
      setStage('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (id, field, value) => {
    const updatedRows = importData.map((row) => row.id === id ? { ...row, [field]: value } : row);
    revalidateAndSet(updatedRows);
  };

  const handleDeleteRow = (id) => {
    const updatedRows = importData.filter((row) => row.id !== id);
    setImportData(updatedRows);
    setSelectedRows(new Set([...selectedRows].filter((x) => x !== id)));
    setCurrentPage(1);
    revalidateAndSet(updatedRows);
    showToast?.('✅ 已删除该条记录');
  };

  const toggleRow = (id) => {
    const row = importData.find((x) => x.id === id);
    if (!row || row.status !== 'ok') return;
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const handleToggleSelectAllCurrentPage = (checked) => {
    const groupedRows = importData.filter(matchesActiveGroup);
    const visibleRows = groupedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const validIds = visibleRows.filter((row) => row.status === 'ok').map((row) => row.id);
    const next = new Set(selectedRows);
    validIds.forEach((id) => {
      if (checked) next.add(id);
      else next.delete(id);
    });
    setSelectedRows(next);
  };

  const handleAutoFillMissing = async () => {
    const targetIds = selectedRows.size > 0 ? selectedRows : new Set(importData.map((r) => r.id));
    setIsAutoFilling(true);

    const toEnrich = importData.filter((row) => targetIds.has(row.id));

    try {
      const { rows: enrichedRows, mode } = await enrichWithFallback(toEnrich);
      const enrichedMap = new Map(enrichedRows.map((row) => [row.id, row]));
      const mergedRows = importData.map((row) => enrichedMap.get(row.id) || row);

      revalidateAndSet(mergedRows);
      if (mode === 'api') {
        showToast?.('✅ 已调用爬虫补全服务，缺失信息已补齐并完成复检');
      } else {
        showToast?.('⚠️ 爬虫服务不可用，已自动切换本地规则补全并完成复检', 'error');
      }
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleImport = () => {
    const selected = importData.filter((item) => selectedRows.has(item.id) && item.status === 'ok');
    if (selected.length === 0) {
      showToast?.('❌ 无可导入记录，请先修复错误/重复并勾选有效记录', 'error');
      return;
    }

    const payload = selected.map(({ id, status, errors, duplicateReasons, missingFields, isDuplicate, ...rest }) => rest);
    const selectedIds = new Set(selected.map(item => item.id));
    const remaining = importData.filter(item => !selectedIds.has(item.id));
    const hasNonOkRemaining = remaining.some(item => item.status !== 'ok');

    if (hasNonOkRemaining && onPartialImport) {
      onPartialImport(payload);
      setImportData(remaining);
      setSelectedRows(new Set());
      showToast?.(`✅ 已导入 ${selected.length} 条线索，仍有 ${remaining.length} 条待处理`);
    } else {
      onConfirm(payload);
      showToast?.(`✅ 已成功导入 ${selected.length} 条线索到线索池`);
    }
  };

  const totalRows = importData.length;
  const okRows = importData.filter((r) => r.status === 'ok').length;
  const errorRows = importData.filter((r) => r.status === 'error').length;
  const duplicateRows = importData.filter((r) => r.status === 'duplicate').length;
  const missingRows = importData.filter((r) => (r.missingFields || []).length > 0).length;
  const enrichedRows = importData.filter((r) => r.enrichmentSource).length;
  const confidenceRows = importData.filter((r) => typeof r.enrichmentConfidence === 'number');
  const averageConfidence = confidenceRows.length > 0
    ? Math.round(confidenceRows.reduce((sum, row) => sum + row.enrichmentConfidence, 0) / confidenceRows.length)
    : null;

  const groupedRows = importData.filter(matchesActiveGroup);
  const groupedCount = groupedRows.length;
  const totalPages = Math.max(1, Math.ceil(groupedCount / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = groupedRows.slice(pageStart, pageStart + pageSize);
  const pageSelectable = pageRows.filter((r) => r.status === 'ok').map((r) => r.id);
  const pageAllSelected = pageSelectable.length > 0 && pageSelectable.every((id) => selectedRows.has(id));

  const statCards = [
    { key: 'all', label: '识别总数', count: totalRows, cardClass: 'border-slate-200 bg-slate-50', labelClass: 'text-slate-500', valueClass: 'text-slate-800' },
    { key: 'ok', label: '可导入', count: okRows, cardClass: 'border-emerald-200 bg-emerald-50', labelClass: 'text-emerald-600', valueClass: 'text-emerald-700' },
    { key: 'error', label: '格式错误', count: errorRows, cardClass: 'border-red-200 bg-red-50', labelClass: 'text-red-600', valueClass: 'text-red-700' },
    { key: 'duplicate', label: '重复数据', count: duplicateRows, cardClass: 'border-orange-200 bg-orange-50', labelClass: 'text-orange-600', valueClass: 'text-orange-700' },
    { key: 'missing', label: '缺失字段', count: missingRows, cardClass: 'border-indigo-200 bg-indigo-50', labelClass: 'text-indigo-600', valueClass: 'text-indigo-700' },
    { key: 'enriched', label: '补全覆盖', count: averageConfidence !== null ? `${enrichedRows} (${averageConfidence}%)` : enrichedRows, cardClass: 'border-cyan-200 bg-cyan-50', labelClass: 'text-cyan-700', valueClass: 'text-cyan-700' }
  ];

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex justify-center mb-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <span className={`px-3 py-1 border ${stage === 'upload' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>1 上传文件</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className={`px-3 py-1 border ${stage === 'processing' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>2 识别数据</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className={`px-3 py-1 border ${stage === 'review' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>3 校验与补全</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="px-3 py-1 border bg-slate-100 text-slate-600 border-slate-200">4 确认导入</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-4">
              <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors w-fit">
                <ChevronLeft size={16} className="mr-1" /> 返回线索列表
              </button>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">批量导入线索工作台</h3>
                <p className="text-sm text-slate-500 mt-1">支持大批量导入，识别后自动执行格式校验、重复检测和缺失补全</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <FileText size={16} /> 下载模板
            </button>
          </div>
        </div>

        <div className="p-8">
          {stage !== 'review' && (
            <div className="max-w-3xl mx-auto">
              <label className="block text-sm font-bold text-slate-700 mb-3">选择文件上传（导入前不展示预览）</label>
              <div className="border-2 border-dashed border-slate-300 p-10 text-center hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" id="leadFileInput" />
                <label htmlFor="leadFileInput" className="cursor-pointer block">
                  <UploadCloud size={36} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">拖拽文件到此 或 点击选择文件</p>
                  <p className="text-xs text-slate-500 mt-1">建议单次导入不超过 5000 条，支持 csv / xlsx / xls 自动识别</p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-700 flex items-center gap-2">
                    <Database size={16} className="text-slate-500" />
                    已选择文件：{selectedFile.name}
                  </div>
                  <button
                    onClick={handleRecognize}
                    disabled={isProcessing}
                    className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                  >
                    {isProcessing ? '识别中...' : '开始识别并校验'}
                  </button>
                </div>
              )}

              {stage === 'processing' && (
                <div className="mt-6 p-5 border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  系统正在进行数据识别、格式校验与重复检测，请稍候...
                </div>
              )}
            </div>
          )}

          {stage === 'review' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                {statCards.map((card) => {
                  const isActive = activeGroup === card.key;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => { setActiveGroup(card.key); setCurrentPage(1); }}
                      className={`p-3 border text-left transition-all ${card.cardClass} ${isActive ? 'ring-2 ring-blue-400 shadow-sm' : 'hover:shadow-sm'}`}
                    >
                      <p className={`text-xs ${card.labelClass}`}>{card.label}</p>
                      <p className={`text-xl font-bold ${card.valueClass}`}>{card.count}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600">当前分组：{statCards.find((x) => x.key === activeGroup)?.label || '识别总数'}（{groupedCount} 条），每页 {pageSize} 条</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAutoFillMissing}
                    disabled={isAutoFilling || totalRows === 0}
                    className="px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 disabled:opacity-60 transition-colors flex items-center gap-2"
                  >
                    <Wand2 size={15} /> {isAutoFilling ? '补全中...' : '爬虫自动补全缺失信息'}
                  </button>
                  <button
                    onClick={handleRecognize}
                    className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={15} /> 重新识别
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left"><input type="checkbox" checked={pageAllSelected} onChange={(e) => handleToggleSelectAllCurrentPage(e.target.checked)} className="accent-emerald-600" /></th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">姓名</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">公司</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">职位</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">电话</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">邮箱</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">行业</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">补全信息</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">校验结果</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((item) => (
                      <tr key={item.id} onClick={() => item.status === 'ok' && toggleRow(item.id)} className={`border-t border-slate-200 ${item.status === 'ok' ? 'cursor-pointer' : 'cursor-default'} ${item.status === 'error' ? 'bg-red-50' : item.status === 'duplicate' ? 'bg-orange-50' : 'hover:bg-emerald-50'}`}>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" disabled={item.status !== 'ok'} checked={selectedRows.has(item.id)} onChange={() => toggleRow(item.id)} className="accent-emerald-600" /></td>
                        <td className="px-4 py-3"><input type="text" value={item.name || ''} onChange={(e) => handleEdit(item.id, 'name', e.target.value)} className="w-full px-2 py-1 border border-slate-200 bg-white text-sm" /></td>
                        <td className="px-4 py-3"><input type="text" value={item.companyName || ''} onChange={(e) => handleEdit(item.id, 'companyName', e.target.value)} className="w-full px-2 py-1 border border-slate-200 bg-white text-sm" /></td>
                        <td className="px-4 py-3"><input type="text" value={item.position || ''} onChange={(e) => handleEdit(item.id, 'position', e.target.value)} className="w-full px-2 py-1 border border-slate-200 bg-white text-sm" /></td>
                        <td className="px-4 py-3"><input type="text" value={item.phone || ''} onChange={(e) => handleEdit(item.id, 'phone', e.target.value)} className="w-full px-2 py-1 border border-slate-200 bg-white text-sm" /></td>
                        <td className="px-4 py-3"><input type="text" value={item.email || ''} onChange={(e) => handleEdit(item.id, 'email', e.target.value)} className="w-full px-2 py-1 border border-slate-200 bg-white text-sm" /></td>
                        <td className="px-4 py-3"><input type="text" value={item.industry || ''} onChange={(e) => handleEdit(item.id, 'industry', e.target.value)} className="w-full px-2 py-1 border border-slate-200 bg-white text-sm" /></td>
                        <td className="px-4 py-3">
                          {item.enrichmentSource ? (
                            <div className="flex flex-col gap-1">
                              <span className="inline-block px-2 py-1 text-xs font-bold bg-cyan-100 text-cyan-700">来源：{item.enrichmentSource}</span>
                              {typeof item.enrichmentConfidence === 'number' && <span className="inline-block px-2 py-1 text-xs font-bold bg-cyan-50 text-cyan-700">置信度：{item.enrichmentConfidence}%</span>}
                              {item.enrichmentCompanyId && <span className="inline-block px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700">企业ID：{item.enrichmentCompanyId}</span>}
                              {item.enrichmentWebsite && <span className="inline-block px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700">官网：{item.enrichmentWebsite}</span>}
                              {item.enrichmentTraceId && <span className="inline-block px-2 py-1 text-xs font-bold bg-slate-100 text-slate-700">追踪：{item.enrichmentTraceId}</span>}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">未补全</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.errors?.map((err, i) => <span key={`e-${item.id}-${i}`} className="inline-block px-2 py-1 text-xs font-bold bg-red-200 text-red-800">{err}</span>)}
                            {item.duplicateReasons?.map((dup, i) => <span key={`d-${item.id}-${i}`} className="inline-block px-2 py-1 text-xs font-bold bg-orange-200 text-orange-800">{dup}</span>)}
                            {item.missingFields?.length > 0 && <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-indigo-200 text-indigo-800"><AlertTriangle size={12} />缺失{item.missingFields.length}项</span>}
                            {item.status === 'ok' && <span className="inline-block px-2 py-1 text-xs font-bold bg-emerald-200 text-emerald-800">✓ 可导入</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteRow(item.id)} className="p-1 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors" title="删除此行">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allOkIds = groupedRows.filter(r => r.status === 'ok').map(r => r.id);
                      setSelectedRows(new Set(allOkIds));
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >全选可导入</button>
                  <button
                    onClick={() => setSelectedRows(new Set())}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                  >取消全选</button>
                  <p className="text-sm text-slate-600">当前第 {currentPage} / {totalPages} 页，已勾选 {selectedRows.size} 条可导入数据</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="px-3 py-2 text-sm border border-slate-200 bg-white disabled:opacity-50">上一页</button>
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="px-3 py-2 text-sm border border-slate-200 bg-white disabled:opacity-50">下一页</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">
            {stage === 'review' ? `已选择 ${selectedRows.size} 条可导入数据` : '导入前不展示数据预览，上传后执行识别与校验'}
          </span>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"><ChevronLeft size={16} className="mr-1" /> 返回线索列表</button>
            {stage !== 'upload' && (
              <button
                onClick={handleImport}
                disabled={stage !== 'review'}
                className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Check size={16} /> 确认导入到线索池
              </button>
            )}
            </div>
          </div>
        </div>
    </div>
  );
}

// === 自动分配策略页面 ===
function AutoAssignView({ onClose, autoAssignConfig, setAutoAssignConfig, assignLogs, handleSimulateAutoAssign, handleRevokeAssign, leads, teamMembers, showToast }) {
  const [activeTab, setActiveTab] = useState('config');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [revokeConfirmLog, setRevokeConfirmLog] = useState(null);

  const openRevokeConfirm = (log) => setRevokeConfirmLog(log);
  const confirmRevokeAssign = () => {
    if (!revokeConfirmLog) return;
    handleRevokeAssign(revokeConfirmLog.id);
    setRevokeConfirmLog(null);
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex flex-col gap-4 bg-white relative">
          <button onClick={onClose} className="flex items-center text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
            <ChevronLeft size={16} className="mr-1" /> 返回线索列表
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 flex items-center justify-center text-indigo-600"><CalendarClock size={28}/></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">自动分配策略中心</h2>
              <p className="text-sm text-slate-500 mt-1">智能分析团队负荷，将线索池线索实现自动化高效流转</p>
            </div>
          </div>
          <div className="flex gap-6 border-b border-slate-200 mt-2">
            <button onClick={() => setActiveTab('config')} className={`pb-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'config' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><Settings2 size={16}/> 策略配置</button>
            <button onClick={() => setActiveTab('logs')} className={`pb-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'logs' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><ListChecks size={16}/> 派发日志记录</button>
          </div>
        </div>

        {activeTab === 'config' ? (
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/> 分配模式设定</h4>
              <div className="flex flex-col md:flex-row gap-4">
                <label className={`flex-1 flex items-start gap-4 p-5 border cursor-pointer transition-all ${autoAssignConfig.mode === 'fixed' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="assignMode" checked={autoAssignConfig.mode === 'fixed'} onChange={() => setAutoAssignConfig({...autoAssignConfig, mode: 'fixed'})} className="mt-1 w-4 h-4 text-blue-600" />
                  <div>
                    <span className="block text-base font-bold text-slate-800 mb-1">固定平均配额</span>
                    <span className="text-xs text-slate-500 leading-relaxed">为所有勾选的销售人员，每天分配相同固定数量的线索。简单直接，绝对平均。</span>
                  </div>
                </label>
                <label className={`flex-1 flex items-start gap-4 p-5 border cursor-pointer transition-all ${autoAssignConfig.mode === 'smart' ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="assignMode" checked={autoAssignConfig.mode === 'smart'} onChange={() => setAutoAssignConfig({...autoAssignConfig, mode: 'smart'})} className="mt-1 w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="block text-base font-bold text-indigo-900 mb-1">智能负载均衡 <Sparkles size={14} className="inline text-indigo-500 mb-1" /></span>
                    <span className="text-xs text-slate-600 leading-relaxed">系统实时分析销售当前的<strong className="text-indigo-600 mx-1">在跟意向客户数</strong>。向空闲人员倾斜资源，对饱和人员降级派发。</span>
                  </div>
                </label>
              </div>

              {autoAssignConfig.mode === 'smart' && (
                <div className="mt-6 bg-indigo-50/40 border border-indigo-100 p-6 animate-in slide-in-from-top-2">
                  <h5 className="text-xs font-bold text-indigo-800 mb-4 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> 团队当前负载 AI 计算一览表</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {autoAssignConfig.reps.map(rep => {
                      const perf = MOCK_REP_PERFORMANCE[rep];
                      const Icon = perf.icon;
                      let limit = 15;
                      if (perf.intent >= 30) limit = 1;
                      else if (perf.intent >= 20) limit = 3;
                      else if (perf.intent >= 10) limit = 6;
                      
                      return (
                        <div key={rep} className="bg-white p-4 border border-indigo-50 shadow-sm flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="block text-sm font-bold text-slate-800">{rep}</span>
                              <span className="text-[11px] text-slate-500 font-medium">在跟意向: {perf.intent} 家</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 border flex items-center gap-1 ${perf.color}`}>
                              <Icon size={10} /> {perf.label}
                            </span>
                          </div>
                          <div className="bg-indigo-50/50 p-2.5 flex justify-between items-center border border-indigo-100">
                            <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest">系统建议配额</span>
                            <span className="text-sm font-black text-indigo-600">{limit} <span className="text-[10px] font-medium text-indigo-400">条/日</span></span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Clock size={18} className="text-blue-500"/> 定时调度设置</h4>
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800 text-sm">启用定时运行</span>
                  <p className="text-xs text-slate-500 mt-1">开启后，系统将在每天设定的时间自动运行派发程序</p>
                </div>
                <div className={`w-12 h-6 cursor-pointer transition-colors relative ${autoAssignConfig.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setAutoAssignConfig({...autoAssignConfig, enabled: !autoAssignConfig.enabled})}>
                  <div className={`absolute top-1 w-4 h-4 bg-white transition-all shadow-sm ${autoAssignConfig.enabled ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">每日触发时间</label>
                  <input type="time" value={autoAssignConfig.time} onChange={(e) => setAutoAssignConfig({...autoAssignConfig, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" />
                </div>
                {autoAssignConfig.mode === 'fixed' && (
                  <div className="animate-in fade-in">
                    <label className="block text-xs font-semibold text-slate-500 mb-2">每位销售每日最高配额 (条)</label>
                    <input type="number" min="1" max="50" value={autoAssignConfig.limitPerRep} onChange={(e) => setAutoAssignConfig({...autoAssignConfig, limitPerRep: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Users size={18} className="text-blue-500"/> 参与接单人员圈选</h4>
              <p className="text-xs text-slate-500 mb-5">仅勾选的销售人员会被计入线索分配池</p>
              <div className="flex flex-wrap gap-3">
                {teamMembers.map(m => {
                  const isSelected = autoAssignConfig.reps.includes(m);
                  return (
                    <div key={m} onClick={() => {
                      const newReps = isSelected ? autoAssignConfig.reps.filter(r => r !== m) : [...autoAssignConfig.reps, m];
                      setAutoAssignConfig({...autoAssignConfig, reps: newReps});
                    }} className={`cursor-pointer px-4 py-2 border text-sm font-medium transition-all flex items-center gap-2 ${isSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                        {isSelected && <Check size={12} />}
                      </div>
                      {m}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
            <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">派发时间</th>
                    <th className="px-6 py-4">分配类型</th>
                    <th className="px-6 py-4">派发总数</th>
                    <th className="px-6 py-4">分配明细</th>
                    <th className="px-6 py-4">改派原因</th>
                    <th className="px-6 py-4">状态</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {assignLogs.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-400">暂无派发记录</td></tr>}
                  {assignLogs.map(log => (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-medium">{log.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold border flex items-center w-max gap-1 ${log.type === '智能负载均衡' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            {log.type === '智能负载均衡' && <Sparkles size={12}/>}
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800">{log.total}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-[200px]" title={log.details}>{log.details}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          <div className="flex flex-col gap-1">
                            <span>{log.reasonCategory || '--'}</span>
                            {log.reasonNote && <span className="text-slate-400">备注：{log.reasonNote}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold border ${log.status === '成功' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-3">
                            <button onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)} className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5">
                              {expandedLogId === log.id ? <><ChevronUp size={14}/> 收起</> : <><ChevronDown size={14}/> 明细</>}
                            </button>
                            {log.status === '成功' && (
                              <button onClick={() => openRevokeConfirm(log)} className="text-orange-600 hover:text-orange-800 text-xs font-bold transition-colors flex items-center gap-1 hover:bg-orange-50 px-2.5 py-1.5"><Undo2 size={14}/> 撤回</button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedLogId === log.id && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={7} className="px-6 py-5 border-t border-slate-100 shadow-inner">
                            <div className="text-xs text-slate-500 font-bold mb-4 flex items-center gap-2 uppercase tracking-widest"><ListChecks size={16} className="text-indigo-500"/> 线索分配清单</div>
                            <div className="space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar pr-2">
                              {(() => {
                                const groupedByOwner = (log.assignments || []).reduce((acc, assignment) => {
                                  const owner = assignment.to || '未指定负责人';
                                  if (!acc[owner]) acc[owner] = [];
                                  acc[owner].push(assignment);
                                  return acc;
                                }, {});
                                const ownerTables = Object.entries(groupedByOwner);

                                if (ownerTables.length === 0) {
                                  return <div className="text-slate-400 text-xs py-4 text-center bg-white border border-slate-200 border-dashed">明细数据不可用（可能为历史录入）</div>;
                                }

                                return ownerTables.map(([owner, items]) => (
                                  <div key={owner} className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700">负责人：{owner}</span>
                                      <span className="text-[11px] text-slate-500">{items.length} 条</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-xs text-left">
                                        <thead className="text-slate-500 bg-white border-b border-slate-100">
                                          <tr>
                                            <th className="px-4 py-2.5 font-semibold">公司名</th>
                                            <th className="px-4 py-2.5 font-semibold">行业</th>
                                            <th className="px-4 py-2.5 font-semibold">联系人名称</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700">
                                          {items.map((a, i) => {
                                            const industryText = a.industry || leads.find((lead) => lead.id === a.id)?.industry || '--';
                                            return (
                                              <tr key={`${owner}-${i}`} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">{a.company || '--'}</td>
                                                <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{industryText}</td>
                                                <td className="px-4 py-2.5">{a.name || '--'}</td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                ));
                              })()}
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
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Info size={14}/> 提示：您可以使用模拟执行立刻测试派发效果</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">关闭</button>
            {activeTab === 'config' && (
              <button onClick={handleSimulateAutoAssign} className="px-6 py-2.5 text-sm font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors flex items-center gap-1.5"><PlayCircle size={16} /> 立即模拟执行一次</button>
            )}
            <button onClick={() => { showToast('✅ 自动分配策略已成功保存'); onClose(); }} className="px-8 py-2.5 text-sm font-medium bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">保存策略设置</button>
          </div>
        </div>

        {revokeConfirmLog && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white p-8 w-[520px] shadow-2xl scale-in-center flex flex-col border border-slate-100">
              <div className="w-14 h-14 bg-orange-50 flex items-center justify-center text-orange-600 mb-6"><Undo2 size={28}/></div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">确认撤回本次派发？</h3>
              <p className="text-sm text-slate-500 mb-6">
                撤回后，本次派发记录将标记为"已撤回"，并将对应线索退回至线索池（未分配）。
              </p>
              <div className="bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 mb-6">
                <div>派发时间：{revokeConfirmLog.date}</div>
                <div className="mt-1">分配类型：{revokeConfirmLog.type}</div>
                <div className="mt-1">派发总数：{revokeConfirmLog.total}</div>
              </div>
              <div className="flex justify-end gap-3 mt-auto">
                <button onClick={() => setRevokeConfirmLog(null)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
                <button onClick={confirmRevokeAssign} className="px-6 py-2.5 text-sm font-medium bg-orange-600 text-white shadow-sm hover:bg-orange-700 transition-colors">确认撤回</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * AIAssignPage.jsx
 * AI 智能分配方案页面
 * 展示 AI 为待分配线索推荐的销售归属，支持手动调整、一键均衡及确认分配操作。
 */

import React, { useState } from 'react';
import {
  Sparkles, Check, ChevronLeft,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import {
  MOCK_REP_PERFORMANCE,
  teamMembers,
  AI_REASONS,
  generatePreview,
} from '../constants/salesData';

/**
 * AI 智能分配方案页面组件
 * @param {Object} props
 * @param {Function} props.showToast - 全局 Toast 通知回调
 * @param {Array<Object>} [props.initialLeads=[]] - 初始待分配线索列表
 * @param {Function} [props.onBack] - 返回上级页面的回调
 */
export default function AIAssignPage({ showToast, initialLeads = [], onBack }) {
  const [preview, setPreview] = useState(() =>
    initialLeads.length > 0 ? generatePreview(initialLeads) : []
  );
  const [confirmed, setConfirmed] = useState(false);

  /**
   * 手动调整某条线索的归属销售
   * @param {number|string} leadId - 线索 ID
   * @param {string} newOwner - 新的归属销售姓名
   */
  const handleOwnerChange = (leadId, newOwner) => {
    setPreview(prev => prev.map(item => item.id === leadId ? { ...item, owner: newOwner } : item));
  };

  /**
   * 一键均衡：按团队成员顺序重新轮流分配所有线索
   */
  const handleBalance = () => {
    setPreview(prev => prev.map((item, idx) => ({
      ...item,
      owner: teamMembers[idx % teamMembers.length],
    })));
    showToast('✅ 已按能力均衡重新分配', 'success');
  };

  /**
   * 确认分配：将当前预览方案提交，清空预览并标记已完成
   */
  const handleConfirm = () => {
    if (preview.length === 0) return;
    const count = preview.length;
    setConfirmed(true);
    setPreview([]);
    showToast(`✅ 已成功分配 ${count} 条线索`, 'success');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-300 p-6 space-y-6">

      {/* 页头 */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        {onBack && (
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft size={18} /> 返回线索列表
            </button>
          </div>
        )}
        <div className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">AI 智能分配方案</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              系统已为{' '}
              <span className="text-purple-600 font-semibold">{confirmed ? 0 : preview.length}</span>
              {' '}条线索推荐最优分配方案，可在下方调整归属销售后确认。
            </p>
          </div>
          {!confirmed && preview.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleBalance}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={14} /> 一键均衡
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-purple-600 text-white shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors"
              >
                <Check size={16} /> 确认分配 ({preview.length} 条)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 成功提示 */}
      {confirmed && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-700 text-sm font-medium">
          <CheckCircle2 size={18} />
          分配已完成，线索已更新至对应销售名下。
          {onBack && (
            <button onClick={onBack} className="ml-auto text-emerald-600 underline text-xs hover:text-emerald-800">
              返回线索列表
            </button>
          )}
        </div>
      )}

      {/* 分配统计 */}
      {preview.length > 0 && (
        <div className="bg-white border border-slate-200 shadow-sm px-6 py-4 grid grid-cols-4 gap-4">
          {['行业匹配', '地区匹配', '能力匹配', '负载均衡'].map((label, idx) => (
            <div key={label} className="border-r border-slate-100 last:border-0 pr-4 last:pr-0">
              <div className="text-xl font-bold text-slate-800">{Math.floor(preview.length * (0.6 + idx * 0.08 + 0.1))}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* 每销售一张表 */}
      {preview.length > 0 && (
        <div className="space-y-4">
          {teamMembers.map(member => {
            const memberLeads = preview.filter(item => item.owner === member);
            const count = memberLeads.length;
            const perf = MOCK_REP_PERFORMANCE[member];
            const PerfIcon = perf?.icon;
            const pct = preview.length > 0 ? Math.round((count / preview.length) * 100) : 0;

            return (
              <div key={member} className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                      {member[0]}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{member}</span>
                      {perf && (
                        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium border ${perf.color}`}>
                          {PerfIcon && <PerfIcon size={12} />}
                          {perf.label} · 跟进中 {perf.intent} 条
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      预分配 <span className="text-purple-600 font-bold">{count}</span> 条
                    </span>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-100">
                      {pct}%
                    </span>
                  </div>
                </div>

                {memberLeads.length > 0 ? (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-2.5 w-8">#</th>
                        <th className="px-5 py-2.5">联系人</th>
                        <th className="px-5 py-2.5">公司</th>
                        <th className="px-5 py-2.5">AI 分配理由</th>
                        <th className="px-5 py-2.5 w-[140px] text-right">调整至</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {memberLeads.map((lead, idx) => (
                        <tr key={lead.id} className="hover:bg-purple-50/30 transition-colors group">
                          <td className="px-5 py-2.5 text-slate-400">{idx + 1}</td>
                          <td className="px-5 py-2.5 font-medium text-slate-800 group-hover:text-purple-600">{lead.name}</td>
                          <td className="px-5 py-2.5 text-slate-500 max-w-[200px] truncate" title={lead.company}>{lead.company}</td>
                          <td className="px-5 py-2.5 text-slate-400 max-w-[300px] truncate" title={lead.reason}>{lead.reason}</td>
                          <td className="px-5 py-2.5 text-right">
                            <select
                              value={lead.owner}
                              onChange={e => handleOwnerChange(lead.id, e.target.value)}
                              className="text-xs border border-slate-200 px-2 py-1 outline-none focus:border-purple-400 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                              {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-5 text-xs text-slate-400">暂无预分配线索</div>
                )}
              </div>
            );
          })}

          <div className="bg-purple-50 border border-purple-100 p-4">
            <div className="text-xs font-bold text-slate-700 mb-3">📊 分配依据统计</div>
            <div className="grid grid-cols-4 gap-3 text-xs">
              {[
                { label: '行业背景匹配', value: '68%' },
                { label: '地域拓展能力', value: '54%' },
                { label: '历史成交率',   value: '72%' },
                { label: '当前工作负荷', value: '均衡' },
              ].map(item => (
                <div key={item.label} className="bg-white p-2.5 border border-purple-100">
                  <div className="text-purple-600 font-semibold">{item.value}</div>
                  <div className="text-slate-600 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

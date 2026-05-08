/**
 * AIAssignPage.jsx
 * AI 智能分配方案页面
 * 展示 AI 为待分配线索推荐的销售归属，支持手动调整、一键均衡及确认分配操作。
 */

import React, { useEffect, useState } from 'react';
import {
  Sparkles, Check,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  RotateCcw
} from 'lucide-react';
import SubpageLayout from '../components/SubpageLayout';
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
export default function AIAssignPage({ showToast, initialLeads = [], onBack, onConfirmAssignments }) {
  const [preview, setPreview] = useState(() =>
    initialLeads.length > 0 ? generatePreview(initialLeads) : []
  );
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sourceLeadCount = initialLeads.length;
  const displayedLeadCount = confirmed ? sourceLeadCount : preview.length;

  useEffect(() => {
    setConfirmed(false);
    setPreview(initialLeads.length > 0 ? generatePreview(initialLeads) : []);
  }, [initialLeads]);

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
    if (preview.length < 2) {
      showToast?.('当前线索不足 2 条，无需重新均衡', 'error');
      return;
    }

    setPreview(prev => prev.map((item, idx) => ({
      ...item,
      owner: teamMembers[idx % teamMembers.length],
    })));
    showToast?.('✅ 已按能力均衡重新分配', 'success');
  };

  /**
   * 确认分配：将当前预览方案提交，清空预览并标记已完成
   */
  const handleConfirm = async () => {
    if (preview.length === 0 || isSubmitting) return;
    const count = preview.length;
    setIsSubmitting(true);
    try {
      const confirmedResult = await onConfirmAssignments?.(preview);
      if (confirmedResult === false) {
        return;
      }
      setConfirmed(true);
      setPreview([]);
      showToast?.(`✅ 已成功分配 ${count} 条线索`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegeneratePreview = () => {
    if (sourceLeadCount === 0) return;
    setConfirmed(false);
    setPreview(generatePreview(initialLeads));
    showToast?.('✅ 已重新生成分配预览，可继续调整负责人', 'success');
  };

  return (
    <div className="page-shell animate-in fade-in duration-300">
      <SubpageLayout
        onBack={onBack}
        breadcrumbs={[
          { label: '销售线索' },
          { label: '线索管理', onClick: onBack },
          { label: 'AI智能分配' },
        ]}
        className="page-shell-wide"
        contentClassName="space-y-6"
      >

      {/* 页头 */}
      <div className="page-card overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center">
          <div className="w-12 h-12 bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800">AI 智能分配方案</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              系统已为{' '}
              <span className="text-purple-600 font-semibold">{displayedLeadCount}</span>
              {' '}条线索推荐最优分配方案，可在下方调整归属销售后确认。
            </p>
          </div>
          {!confirmed && preview.length > 0 && (
            <div className="action-cluster shrink-0 lg:justify-end">
              <button
                onClick={handleBalance}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <RefreshCw size={14} /> 一键均衡
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-purple-600 text-white shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors"
              >
                <Check size={16} /> {isSubmitting ? '回写中...' : `确认分配 (${preview.length} 条)`}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border border-indigo-100 bg-indigo-50/70 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-indigo-700 flex items-center gap-2">
              <Info size={14} /> 本页使用提示
            </p>
            <p className="mt-2 text-sm text-slate-700">
              先核对 AI 推荐负责人，再按实际业务关系手动调整；若发现这一批线索不适合当前方案，可重新生成预览或返回线索列表重新选择。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-3 lg:max-w-[34rem]">
            <div className="border border-white/80 bg-white/90 px-3 py-3">
              <p className="font-semibold text-slate-800">1. 先看建议</p>
              <p className="mt-1">重点关注行业、地区和负载是否合理。</p>
            </div>
            <div className="border border-white/80 bg-white/90 px-3 py-3">
              <p className="font-semibold text-slate-800">2. 再做调整</p>
              <p className="mt-1">下拉切换负责人后无需单独保存，确认时一并提交。</p>
            </div>
            <div className="border border-white/80 bg-white/90 px-3 py-3">
              <p className="font-semibold text-slate-800">3. 可恢复</p>
              <p className="mt-1">如果当前批次不合适，可重新生成预览继续演练。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 成功提示 */}
      {confirmed && (
        <div className="flex flex-col gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 sm:flex-row sm:items-center">
          <CheckCircle2 size={18} />
          <span>分配已完成，线索已更新至对应销售名下。</span>
        </div>
      )}

      {confirmed && (
        <div className="page-card border border-emerald-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">下一步建议</h3>
              <p className="mt-1 text-sm text-slate-500">
                可以通过顶部返回栏回到线索列表复核负责人是否符合预期；如果当前只是演练，也可以重新生成一份预览继续调整。
              </p>
            </div>
            <div className="action-cluster lg:justify-end">
              {sourceLeadCount > 0 && (
                <button
                  onClick={handleRegeneratePreview}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  <RotateCcw size={14} /> 重新生成预览
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!confirmed && preview.length === 0 && (
        <div className="page-card border-dashed border-slate-300 px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <AlertCircle size={20} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-800">暂无待分配线索</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            可能是上一页还没有勾选线索，或当前批次已经处理完成。你可以通过顶部返回栏回到线索列表重新选择，也可以重新生成当前演练预览继续查看分配逻辑。
          </p>
          {sourceLeadCount > 0 && (
            <div className="mt-6 action-cluster justify-center">
            {sourceLeadCount > 0 && (
              <button
                onClick={handleRegeneratePreview}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <RotateCcw size={14} /> 重新生成预览
              </button>
            )}
            </div>
          )}
        </div>
      )}

      {/* 分配统计 */}
      {preview.length > 0 && (
        <div className="page-card px-4 py-4 sm:px-6">
          <div className="metric-grid">
          {['行业匹配', '地区匹配', '能力匹配', '负载均衡'].map((label, idx) => (
            <div key={label} className="border border-slate-100 bg-slate-50/70 px-4 py-3 sm:border-r sm:border-y-0 sm:border-l-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pr-4 sm:last:border-0 sm:last:pr-0">
              <div className="text-xl font-bold text-slate-800">{preview.length > 0 ? Math.max(1, Math.floor(preview.length * (0.6 + idx * 0.08 + 0.1))) : 0}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
          </div>
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
              <div key={member} className="page-card overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
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
                  <div className="flex items-center gap-3 self-start lg:self-auto">
                    <span className="text-xs text-slate-500">
                      预分配 <span className="text-purple-600 font-bold">{count}</span> 条
                    </span>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-100">
                      {pct}%
                    </span>
                  </div>
                </div>

                {memberLeads.length > 0 ? (
                  <div className="table-shell">
                    <table className="console-table console-table-dense w-full text-xs text-left">
                      <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2.5 sm:px-5 w-8">#</th>
                          <th className="px-4 py-2.5 sm:px-5">联系人</th>
                          <th className="px-4 py-2.5 sm:px-5">公司</th>
                          <th className="px-4 py-2.5 sm:px-5">AI 分配理由</th>
                          <th className="px-4 py-2.5 sm:px-5 w-[140px] text-right">调整至</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {memberLeads.map((lead, idx) => (
                          <tr key={lead.id} className="hover:bg-purple-50/30 transition-colors group">
                            <td className="px-4 py-2.5 sm:px-5 text-slate-400">{idx + 1}</td>
                            <td className="px-4 py-2.5 sm:px-5 font-medium text-slate-800 group-hover:text-purple-600">{lead.name}</td>
                            <td className="px-4 py-2.5 sm:px-5 text-slate-500 max-w-[200px] truncate" title={lead.company}>{lead.company}</td>
                            <td className="px-4 py-2.5 sm:px-5 text-slate-400 max-w-[300px] truncate" title={lead.reason}>{lead.reason}</td>
                            <td className="px-4 py-2.5 sm:px-5 text-right">
                              <select
                                value={lead.owner}
                                onChange={e => handleOwnerChange(lead.id, e.target.value)}
                                className="console-table-select cursor-pointer hover:bg-console-surface-alt"
                              >
                                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-5 py-6 text-xs text-slate-400">
                    当前该销售暂无预分配线索。可以保持为空以减轻负荷，或从其他销售名下手动调整一部分线索过来。
                  </div>
                )}
              </div>
            );
          })}

          <div className="border border-purple-100 bg-purple-50 p-4">
            <div className="text-xs font-bold text-slate-700 mb-3">📊 分配依据统计</div>
            <div className="metric-grid text-xs">
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
      </SubpageLayout>
    </div>
  );
}

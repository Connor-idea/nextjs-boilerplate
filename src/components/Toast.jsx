import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * 全局 Toast 通知组件
 * 固定显示在页面顶部居中位置，自动由父组件控制显示/隐藏（message 为空时不渲染）。
 * @param {Object} props
 * @param {string} props.message - 提示文字，为空则不渲染
 * @param {'success'|'error'} [props.type='success'] - 提示类型，影响颜色与图标
 */
export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-3.5 shadow-lg border font-medium text-sm ${
        type === 'success'
          ? 'bg-white text-emerald-700 border-emerald-100'
          : 'bg-white text-red-700 border-red-100'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 size={18} className="text-emerald-500" />
        ) : (
          <AlertCircle size={18} className="text-red-500" />
        )}
        {message}
      </div>
    </div>
  );
}

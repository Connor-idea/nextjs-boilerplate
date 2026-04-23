import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * 占位页面组件，用于尚未开发完成的模块页面
 * @param {Object} props
 * @param {string} props.title - 页面标题
 * @param {string} props.description - 页面描述文字
 */
export default function Placeholder({ title, description }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 text-base">{description || '该功能开发中...'}</p>
      </div>
    </div>
  );
}

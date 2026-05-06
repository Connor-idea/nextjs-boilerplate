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
    <div className="page-shell min-h-full bg-slate-50">
      <div className="page-shell-wide max-w-3xl">
        <div className="page-card flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-10 text-center sm:px-10">
          <div>
            <div className="mb-4 flex justify-center">
              <AlertCircle size={48} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 sm:text-3xl">{title}</h2>
            <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base">{description || '该功能开发中...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

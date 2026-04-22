import React from 'react';
import { Sparkles, Users, History } from 'lucide-react';

export default function PitchModule({ showToast }) {
  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300">
        <div className="bg-white shadow-sm border border-slate-200 overflow-hidden p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">AI 推客模块</h2>
              <p className="text-sm text-slate-500 mt-1">智能分析企业需求，提供AI驱动的客户跟进方案</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 border border-purple-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users size={24} className="text-purple-600" />
                <h3 className="text-lg font-bold text-slate-800">线索目录</h3>
              </div>
              <p className="text-sm text-slate-600">
                系统实时抓取和展示今日待跟进的企业线索，智能优先级排序。支持多维度AI排序策略。
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={24} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">AI 推荐话术</h3>
              </div>
              <p className="text-sm text-slate-600">
                基于企业画像和历史对话，生成定制化的破冰和跟进话术建议。支持话术A/B测试。
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <History size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">跟进记录</h3>
              </div>
              <p className="text-sm text-slate-600">
                完整的客户沟通时间轴，方便快速回顾沟通内容和下一步计划。支持备注追加。
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 border border-slate-100">
            <p className="text-sm text-slate-600 text-center">
              💡 AI 推客功能已准备就绪。在左侧边栏选择 "AI 推客" 模块开始使用完整的AI驱动营销工具。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

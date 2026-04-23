/**
 * salesData.js
 * 销售团队共享常量模块
 * 统一管理销售代表业绩数据、团队成员列表及 AI 分配相关逻辑，
 * 供 LeadsModule、AIAssignPage 等多个模块共享使用。
 */

import { BatteryFull, BatteryMedium, BatteryLow } from 'lucide-react';

/**
 * 销售代表当前业绩与负荷数据
 * intent: 当前跟进中线索数量
 * label: 负荷状态文字
 * icon: 对应的 Battery 图标组件
 * color: Tailwind 样式类，用于状态标签显示
 */
export const MOCK_REP_PERFORMANCE = {
  '张三': { intent: 32, label: '饱和', icon: BatteryFull,   color: 'text-red-600 bg-red-50 border-red-200' },
  '李四': { intent: 5,  label: '空闲', icon: BatteryLow,   color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '王五': { intent: 18, label: '正常', icon: BatteryMedium, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  '赵六': { intent: 8,  label: '空闲', icon: BatteryLow,   color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '刘洋': { intent: 28, label: '偏高', icon: BatteryMedium, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  '孙琦': { intent: 2,  label: '空闲', icon: BatteryLow,   color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  '周七': { intent: 15, label: '正常', icon: BatteryMedium, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  '吴八': { intent: 22, label: '偏高', icon: BatteryMedium, color: 'text-orange-700 bg-orange-50 border-orange-200' },
};

/** 团队成员姓名列表，按 MOCK_REP_PERFORMANCE 键顺序排列 */
export const teamMembers = Object.keys(MOCK_REP_PERFORMANCE);

/**
 * AI 分配理由模板列表
 * 使用 {owner} 作为占位符，运行时替换为实际销售代表姓名
 */
export const AI_REASONS = [
  '该客户公司成立时间较长，主营业务为传统制造/零售，与销售【{owner}】画像匹配，其擅长攻坚传统行业大客户且历史复购率高。',
  '该客户近期有较强的数字化转型需求，且属于互联网科技行业，【{owner}】有多个同行业成功交付案例，业务认知契合度达 95%。',
  '线索来源为短视频获客，属于高频快消类，【{owner}】跟进此类线索转化率（28%）居团队首位，响应速度极快。',
  '该客户评分较高，属于 A 类意向客户，【{owner}】当前负荷空间充足，优先承接高价值线索。',
  '该客户所在行业与【{owner}】历史成交案例高度重合，行业认知匹配度达 91%，预计转化周期较短。',
];

/**
 * 为线索列表生成 AI 预分配方案
 * 策略：按负荷从低到高排序销售代表，依次轮流分配，并附上随机 AI 理由。
 * @param {Array<Object>} leads - 待分配的线索对象数组
 * @returns {Array<Object>} 包含 owner、reason 字段的线索数组
 */
export const generatePreview = (leads) => {
  const sorted = [...teamMembers].sort(
    (a, b) => MOCK_REP_PERFORMANCE[a].intent - MOCK_REP_PERFORMANCE[b].intent
  );
  return leads.map((lead, idx) => {
    const owner = sorted[idx % sorted.length];
    const reason = AI_REASONS[idx % AI_REASONS.length].replace(/\{owner\}/g, owner);
    return { ...lead, owner, reason };
  });
};

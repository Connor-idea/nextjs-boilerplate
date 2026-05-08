import React, { useMemo, useState } from 'react';
import { BarChart3, Link2, Settings2 } from 'lucide-react';
import { commissionCeilings, orderBindingRows, performanceTargetRows, serviceFeeRules, supplyCommissionRules } from '../constants/uatSupplementData';

function Hero({ icon: Icon, title, description }) {
  return (
    <section className="page-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </section>
  );
}

export function PerformanceTargetModule() {
  const [range, setRange] = useState('近 3 个月');

  const summary = useMemo(() => {
    const amount = performanceTargetRows.reduce((sum, item) => sum + item.amount, 0);
    const customers = performanceTargetRows.reduce((sum, item) => sum + item.newCustomers, 0);

    return { amount, customers };
  }, []);

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={BarChart3} title="业绩目标" description="参考 UAT 的公司业绩目标页补充月度目标管理，保留当前系统的卡片化表现方式，并提供月份范围筛选。" />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="page-card p-5"><p className="text-xs text-slate-500">目标月份数</p><p className="mt-3 text-3xl font-bold text-slate-900">{performanceTargetRows.length}</p></div>
          <div className="page-card p-5"><p className="text-xs text-slate-500">系统成交目标</p><p className="mt-3 text-3xl font-bold text-blue-600">¥{summary.amount.toLocaleString()}</p></div>
          <div className="page-card p-5"><p className="text-xs text-slate-500">新增客户目标</p><p className="mt-3 text-3xl font-bold text-emerald-600">{summary.customers}</p></div>
        </section>
        <section className="page-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <label className="text-sm text-slate-600 md:w-64">
              <span className="mb-2 block">月份范围</span>
              <select value={range} onChange={(event) => setRange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                {['近 3 个月', '本财年', '自然年'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">添加目标</button>
          </div>
          <div className="table-shell mt-5 overflow-hidden">
            <table className="console-table min-w-[760px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">月份</th>
                  <th className="px-4 py-3 font-semibold">系统成交金额</th>
                  <th className="px-4 py-3 font-semibold">新增客户数</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {performanceTargetRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4 font-medium text-slate-800">{row.id}</td>
                    <td className="px-4 py-4 text-slate-600">{row.month}</td>
                    <td className="px-4 py-4 text-slate-700">¥{row.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-700">{row.newCustomers}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button type="button" className="console-table-action console-table-action-primary">编辑</button>
                        <button type="button" className="console-table-action console-table-action-danger">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export function OrderBindingModule() {
  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={Link2} title="OA-企业订单分成关联" description="参考 UAT 的订单关联页补充分成归属绑定关系，用于统一查看 OA 客户与企业订单之间的映射。" />
        <section className="page-card p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100" placeholder="请输入 OA 客户名称" />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100" placeholder="请输入企业客户名称" />
            <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">添加关联</button>
          </div>
          <div className="table-shell mt-5 overflow-hidden">
            <table className="console-table min-w-[820px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">OA 客户名称</th>
                  <th className="px-4 py-3 font-semibold">企业客户名称</th>
                  <th className="px-4 py-3 font-semibold">企业客户类型</th>
                  <th className="px-4 py-3 font-semibold">绑定时间</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderBindingRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4 font-medium text-slate-800">{row.id}</td>
                    <td className="px-4 py-4 text-slate-700">{row.oaCustomerName}</td>
                    <td className="px-4 py-4 text-slate-700">{row.enterpriseName}</td>
                    <td className="px-4 py-4 text-slate-600">{row.enterpriseType}</td>
                    <td className="px-4 py-4 text-slate-600">{row.boundAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button type="button" className="console-table-action console-table-action-primary">编辑</button>
                        <button type="button" className="console-table-action console-table-action-danger">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export function DividedConfigModule() {
  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <Hero icon={Settings2} title="分成标准化配置" description="对齐 UAT 的分成配置页，将上限规则、系统服务费通用分成规则和供应链分成规则集中展示。" />
        <section className="page-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">分成上限规则</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {[
              ['系统服务费 / 渠道', commissionCeilings.serviceFee.channel],
              ['系统服务费 / 员工', commissionCeilings.serviceFee.employee],
              ['系统服务费 / 主管', commissionCeilings.serviceFee.manager],
              ['供应链 / 渠道', commissionCeilings.supply.channel],
              ['供应链 / 员工', commissionCeilings.supply.employee],
              ['供应链 / 主管', commissionCeilings.supply.manager],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="page-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">系统服务费通用分成规则</h2>
          <div className="table-shell mt-4 overflow-hidden">
            <table className="console-table min-w-[1080px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">系统服务费总额</th>
                  <th className="px-4 py-3 font-semibold">优先渠道分成</th>
                  <th className="px-4 py-3 font-semibold">渠道上限</th>
                  <th className="px-4 py-3 font-semibold">渠道比例</th>
                  <th className="px-4 py-3 font-semibold">渠道金额</th>
                  <th className="px-4 py-3 font-semibold">员工上限</th>
                  <th className="px-4 py-3 font-semibold">员工比例</th>
                  <th className="px-4 py-3 font-semibold">员工金额</th>
                  <th className="px-4 py-3 font-semibold">主管上限</th>
                  <th className="px-4 py-3 font-semibold">主管比例</th>
                  <th className="px-4 py-3 font-semibold">主管金额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceFeeRules.map((row) => (
                  <tr key={row.amount}>
                    <td className="px-4 py-4 font-medium text-slate-800">{row.amount}</td>
                    <td className="px-4 py-4 text-slate-600">{row.preferredChannel}</td>
                    <td className="px-4 py-4 text-slate-600">{row.channelCap}</td>
                    <td className="px-4 py-4 text-slate-600">{row.channelRatio}</td>
                    <td className="px-4 py-4 text-slate-700">{row.channelAmount}</td>
                    <td className="px-4 py-4 text-slate-600">{row.employeeCap}</td>
                    <td className="px-4 py-4 text-slate-600">{row.employeeRatio}</td>
                    <td className="px-4 py-4 text-slate-700">{row.employeeAmount}</td>
                    <td className="px-4 py-4 text-slate-600">{row.managerCap}</td>
                    <td className="px-4 py-4 text-slate-600">{row.managerRatio}</td>
                    <td className="px-4 py-4 text-slate-700">{row.managerAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="page-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">供应链通用分成规则</h2>
          <div className="table-shell mt-4 overflow-hidden">
            <table className="console-table min-w-[920px]">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">分成来源</th>
                  <th className="px-4 py-3 font-semibold">优先供应链分成</th>
                  <th className="px-4 py-3 font-semibold">渠道上限</th>
                  <th className="px-4 py-3 font-semibold">渠道比例</th>
                  <th className="px-4 py-3 font-semibold">员工上限</th>
                  <th className="px-4 py-3 font-semibold">员工比例</th>
                  <th className="px-4 py-3 font-semibold">主管上限</th>
                  <th className="px-4 py-3 font-semibold">主管比例</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplyCommissionRules.map((row) => (
                  <tr key={row.source}>
                    <td className="px-4 py-4 font-medium text-slate-800">{row.source}</td>
                    <td className="px-4 py-4 text-slate-600">{row.preferredSupply}</td>
                    <td className="px-4 py-4 text-slate-600">{row.channelCap}</td>
                    <td className="px-4 py-4 text-slate-600">{row.channelRatio}</td>
                    <td className="px-4 py-4 text-slate-600">{row.employeeCap}</td>
                    <td className="px-4 py-4 text-slate-600">{row.employeeRatio}</td>
                    <td className="px-4 py-4 text-slate-600">{row.managerCap}</td>
                    <td className="px-4 py-4 text-slate-600">{row.managerRatio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
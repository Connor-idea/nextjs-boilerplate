import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Search, UserCheck, UserPlus, Users } from 'lucide-react';
import { employeeDirectoryRows } from '../constants/uatSupplementData';

const INITIAL_FILTERS = {
  name: '',
  accountName: '',
  status: '不限',
  department: '不限',
  position: '不限',
  role: '不限',
};

const PAGE_SIZE = 8;

const SCOPE_CONFIG = {
  all: {
    scope: '全部员工',
    badge: '组织全景',
    title: '员工列表',
    description: '参考截图补齐全部员工模块，支持按员工姓名、账号名、员工状态、部门、职务和账号角色筛选，并集中查看主负责客户、渠道与累计分成。',
    emptyState: '当前筛选条件下没有匹配的员工。',
  },
  direct: {
    scope: '直属员工',
    badge: '直属团队',
    title: '直属员工',
    description: '延续当前项目卡片化风格，聚焦当前主管的直属员工账号、业务负载和分成表现，便于快速管理团队成员。',
    emptyState: '当前没有匹配的直属员工。',
  },
};

const STATUS_TONE = {
  正常: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  暂停: 'bg-amber-50 text-amber-700 border-amber-200',
};

function formatShare(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '-';
  }

  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: Number.isInteger(numericValue) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(numericValue);
}

function MetricCard({ label, value, detail, tone = 'text-slate-900' }) {
  return (
    <div className="page-card p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function ToolbarButton({ icon: Icon, label, primary = false }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
        primary
          ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
          : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function FilterField({ label, children }) {
  return (
    <label className="space-y-2 text-sm text-slate-600">
      <span className="block font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_TONE[value] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {value}
    </span>
  );
}

function PageButton({ active, disabled, children, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition ${
        active
          ? 'border-blue-600 bg-blue-600 text-white'
          : disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
      }`}
    >
      {children}
    </button>
  );
}

function EmployeeDirectoryView({ scopeKey }) {
  const config = SCOPE_CONFIG[scopeKey];
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const scopedRows = useMemo(() => {
    if (config.scope === '全部员工') {
      return employeeDirectoryRows;
    }

    return employeeDirectoryRows.filter((row) => row.scope === config.scope);
  }, [config.scope]);

  const filterOptions = useMemo(() => {
    const departments = Array.from(new Set(scopedRows.map((row) => row.department)));
    const positions = Array.from(new Set(scopedRows.map((row) => row.position)));
    const roles = Array.from(new Set(scopedRows.map((row) => row.role)));

    return {
      departments: ['不限', ...departments],
      positions: ['不限', ...positions],
      roles: ['不限', ...roles],
    };
  }, [scopedRows]);

  const visibleRows = useMemo(() => scopedRows.filter((row) => {
    if (filters.name && !row.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.accountName && !row.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) {
      return false;
    }

    if (filters.status !== '不限' && row.status !== filters.status) {
      return false;
    }

    if (filters.department !== '不限' && row.department !== filters.department) {
      return false;
    }

    if (filters.position !== '不限' && row.position !== filters.position) {
      return false;
    }

    if (filters.role !== '不限' && row.role !== filters.role) {
      return false;
    }

    return true;
  }), [filters, scopedRows]);

  const metrics = useMemo(() => ({
    total: visibleRows.length,
    active: visibleRows.filter((row) => row.status === '正常').length,
    customerCount: visibleRows.reduce((sum, row) => sum + Number(row.customerCount), 0),
    totalShare: visibleRows.reduce((sum, row) => sum + Number(row.totalShare), 0),
  }), [visibleRows]);

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return visibleRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [page, visibleRows]);

  const allPageSelected = paginatedRows.length > 0 && paginatedRows.every((row) => selectedIds.includes(row.id));

  useEffect(() => {
    setPage(1);
  }, [filters, scopeKey]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const handleDraftChange = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setFilters(draftFilters);
  };

  const handleReset = () => {
    setDraftFilters(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setSelectedIds([]);
  };

  const toggleAllOnPage = () => {
    if (allPageSelected) {
      setSelectedIds((current) => current.filter((id) => !paginatedRows.some((row) => row.id === id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...paginatedRows.map((row) => row.id)])));
  };

  const toggleRow = (rowId) => {
    setSelectedIds((current) => current.includes(rowId)
      ? current.filter((id) => id !== rowId)
      : [...current, rowId]);
  };

  return (
    <div className="page-shell">
      <div className="page-shell-wide space-y-6">
        <section className="page-card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {scopeKey === 'all' ? <Users size={14} /> : <UserCheck size={14} />}
                  {config.badge}
                </div>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">{config.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{config.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <ToolbarButton icon={UserPlus} label="添加" primary />
                <ToolbarButton icon={Download} label="导出" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-2 xl:grid-cols-4 sm:px-6">
            <MetricCard label="员工总数" value={metrics.total} detail="当前查询范围内的员工数量" />
            <MetricCard label="正常账号" value={metrics.active} detail="状态为正常的员工账号数" tone="text-emerald-600" />
            <MetricCard label="主负责客户数" value={metrics.customerCount} detail="按当前结果汇总的客户数" tone="text-blue-600" />
            <MetricCard label="员工分成总金额" value={formatShare(metrics.totalShare)} detail="当前结果汇总的累计分成" tone="text-amber-600" />
          </div>
        </section>

        <section className="page-card p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FilterField label="员工姓名">
              <input
                type="text"
                value={draftFilters.name}
                onChange={(event) => handleDraftChange('name', event.target.value)}
                placeholder="请输入员工姓名"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </FilterField>
            <FilterField label="账号名">
              <input
                type="text"
                value={draftFilters.accountName}
                onChange={(event) => handleDraftChange('accountName', event.target.value)}
                placeholder="账号名"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </FilterField>
            <FilterField label="员工状态">
              <select
                value={draftFilters.status}
                onChange={(event) => handleDraftChange('status', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {['不限', '正常', '暂停'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </FilterField>
            <FilterField label="员工部门">
              <select
                value={draftFilters.department}
                onChange={(event) => handleDraftChange('department', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {filterOptions.departments.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </FilterField>
            <FilterField label="员工职务">
              <select
                value={draftFilters.position}
                onChange={(event) => handleDraftChange('position', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {filterOptions.positions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </FilterField>
            <FilterField label="账号角色">
              <div className="flex items-center gap-2">
                <select
                  value={draftFilters.role}
                  onChange={(event) => handleDraftChange('role', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                >
                  {filterOptions.roles.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Search size={15} />
                  查询
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  重置
                </button>
              </div>
            </FilterField>
          </div>
        </section>

        <section className="page-card overflow-hidden">
          <div className="table-shell">
            <table className="console-table min-w-[1320px] w-full">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleAllOnPage} aria-label="全选当前页员工" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </th>
                  <th className="px-4 py-3 font-semibold">姓名</th>
                  <th className="px-4 py-3 font-semibold">账号名</th>
                  <th className="px-4 py-3 font-semibold">直属领导</th>
                  <th className="px-4 py-3 font-semibold">主负责渠道数</th>
                  <th className="px-4 py-3 font-semibold">主负责客户数</th>
                  <th className="px-4 py-3 font-semibold">员工分成总金额</th>
                  <th className="px-4 py-3 font-semibold">手机</th>
                  <th className="px-4 py-3 font-semibold">账号角色</th>
                  <th className="px-4 py-3 font-semibold">员工状态</th>
                  <th className="px-4 py-3 font-semibold">创建时间</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedRows.length > 0 ? paginatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`选择${row.name}`}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium text-blue-600">{row.name}</td>
                    <td className="px-4 py-4 text-slate-700">{row.accountName}</td>
                    <td className="px-4 py-4 text-slate-600">{row.leader}</td>
                    <td className="px-4 py-4 text-blue-600">{row.channelCount}</td>
                    <td className="px-4 py-4 text-blue-600">{row.customerCount}</td>
                    <td className="px-4 py-4 text-blue-600">{formatShare(row.totalShare)}</td>
                    <td className="px-4 py-4 text-slate-600">{row.phone}</td>
                    <td className="px-4 py-4 text-slate-700">{row.role}</td>
                    <td className="px-4 py-4"><StatusBadge value={row.status} /></td>
                    <td className="px-4 py-4 text-slate-600">{row.createdAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                        <button type="button" className="text-blue-600 transition hover:text-blue-700">编辑</button>
                        <button type="button" className="text-rose-500 transition hover:text-rose-600">删除</button>
                        <button type="button" className="text-blue-600 transition hover:text-blue-700">重置密码</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-sm text-slate-500">{config.emptyState}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-500">已选择 {selectedIds.length} 项，本页显示 {paginatedRows.length} / 共 {visibleRows.length} 项</p>
            <div className="flex flex-wrap items-center gap-2">
              <PageButton disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft size={16} />
              </PageButton>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <PageButton key={pageNumber} active={pageNumber === page} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </PageButton>
              ))}
              <PageButton disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>
                <ChevronRight size={16} />
              </PageButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function AllEmployeesModule() {
  return <EmployeeDirectoryView scopeKey="all" />;
}

export function DirectEmployeesModule() {
  return <EmployeeDirectoryView scopeKey="direct" />;
}
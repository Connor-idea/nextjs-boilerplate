import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BUTTON_STYLES = {
  floatingContainer: 'mb-5 flex flex-col gap-2.5',
  floating: 'inline-flex items-center gap-2 self-start rounded-lg px-1 py-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200',
  floatingIcon: 'flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm shadow-slate-200/70 transition-colors group-hover:border-slate-300 group-hover:text-slate-700',
  inline: 'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200',
};

export default function SubpageBackButton({
  onClick,
  label = '返回上一级',
  variant = 'floating',
  breadcrumbs = [],
  className = '',
  disabled = false,
}) {
  if (!onClick) return null;

  const buttonClassName = BUTTON_STYLES[variant] || BUTTON_STYLES.inline;
  const isFloating = variant === 'floating';
  const normalizedBreadcrumbs = breadcrumbs
    .map((item) => (typeof item === 'string' ? { label: item } : item))
    .filter((item) => item?.label);

  const content = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${buttonClassName} group ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`.trim()}
    >
      {isFloating ? (
        <>
          <span className={BUTTON_STYLES.floatingIcon}>
            <ChevronLeft size={16} />
          </span>
          <span>{label}</span>
        </>
      ) : (
        <>
          <ChevronLeft size={16} />
          <span>{label}</span>
        </>
      )}
    </button>
  );

  if (!isFloating) return content;

  return (
    <div className={BUTTON_STYLES.floatingContainer}>
      {normalizedBreadcrumbs.length > 0 ? (
        <nav aria-label="面包屑" className="overflow-x-auto">
          <ol className="flex min-w-max items-center gap-1.5 text-xs text-slate-400">
            {normalizedBreadcrumbs.map((item, index) => {
              const isCurrent = index === normalizedBreadcrumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <ChevronRight size={12} className="text-slate-300" /> : null}
                  {item.onClick && !isCurrent ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="transition-colors hover:text-slate-700"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className={isCurrent ? 'font-medium text-slate-700' : ''}>{item.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
      <div className="flex items-start">{content}</div>
    </div>
  );
}
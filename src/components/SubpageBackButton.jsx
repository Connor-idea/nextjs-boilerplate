import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BUTTON_STYLES = {
  floatingContainer: 'mb-5 flex flex-col gap-2.5',
  floating: 'inline-flex items-center gap-2 self-start rounded-full px-1 py-1 text-sm font-medium text-console-muted transition-colors hover:text-console-text focus:outline-none',
  floatingIcon: 'console-icon-button h-10 w-10 rounded-full text-console-muted group-hover:border-console-border-strong group-hover:bg-console-surface-alt group-hover:text-console-primary',
  inline: 'console-btn-secondary rounded-full px-4 py-2',
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
          <ol className="flex min-w-max items-center gap-1.5 text-xs text-console-subtle">
            {normalizedBreadcrumbs.map((item, index) => {
              const isCurrent = index === normalizedBreadcrumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <ChevronRight size={12} className="text-console-neutral" /> : null}
                  {item.onClick && !isCurrent ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="transition-colors hover:text-console-text"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className={isCurrent ? 'font-medium text-console-text' : ''}>{item.label}</span>
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
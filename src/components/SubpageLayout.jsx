import React, { useEffect, useMemo, useRef } from 'react';
import { useSubpageNav } from './SubpageNavContext';

function normalizeBreadcrumbs(breadcrumbs = []) {
  return breadcrumbs
    .map((item) => (typeof item === 'string' ? { label: item } : item))
    .filter((item) => item?.label);
}

function resolveModuleLabel(items) {
  if (items.length <= 1) return items[0]?.label || '';

  const parentItem = [...items.slice(0, -1)].reverse().find((item) => item.onClick);
  return parentItem?.label || items[items.length - 2]?.label || items[0]?.label || '';
}

export default function SubpageLayout({
  onBack,
  onClick,
  backLabel = '返回上一级',
  breadcrumbs = [],
  className = '',
  contentClassName = '',
  buttonColumnClassName = '',
  children,
}) {
  void buttonColumnClassName;

  const { setSubpageNav } = useSubpageNav();
  const handleBack = onBack || onClick;
  const normalizedBreadcrumbs = normalizeBreadcrumbs(breadcrumbs);
  const pageLabel = normalizedBreadcrumbs[normalizedBreadcrumbs.length - 1]?.label || '';
  const moduleLabel = useMemo(() => resolveModuleLabel(normalizedBreadcrumbs), [normalizedBreadcrumbs]);
  const ownerIdRef = useRef(Symbol('subpage-layout'));

  useEffect(() => {
    if (!handleBack || !pageLabel) return undefined;

    const ownerId = ownerIdRef.current;

    setSubpageNav({
      ownerId,
      onBack: handleBack,
      backLabel,
      moduleLabel,
      pageLabel,
    });

    return () => {
      setSubpageNav((current) => (current?.ownerId === ownerId ? null : current));
    };
  }, [backLabel, handleBack, moduleLabel, pageLabel, setSubpageNav]);

  return (
    <div className={`${className}`.trim()}>
      <div className={`min-w-0 ${contentClassName}`.trim()}>{children}</div>
    </div>
  );
}
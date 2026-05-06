import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SubpageNavContext = createContext(null);

export function SubpageNavProvider({ children }) {
  const [subpageNav, setSubpageNav] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-header-offset', subpageNav ? '88px' : '64px');

    return () => {
      root.style.removeProperty('--app-header-offset');
    };
  }, [subpageNav]);

  const value = useMemo(() => ({ subpageNav, setSubpageNav }), [subpageNav]);

  return <SubpageNavContext.Provider value={value}>{children}</SubpageNavContext.Provider>;
}

export function useSubpageNav() {
  const context = useContext(SubpageNavContext);

  if (!context) {
    throw new Error('useSubpageNav must be used within a SubpageNavProvider');
  }

  return context;
}
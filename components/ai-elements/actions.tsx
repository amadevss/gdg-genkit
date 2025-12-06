'use client';

import React from 'react';

interface ActionProps {
  tooltip?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      {children}
    </div>
  );
}

export function Action({ tooltip, onClick, children }: ActionProps) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
    >
      {children}
    </button>
  );
}



import React from 'react';

export const LoadingSpinner = ({ label = 'Loading inventory...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
      {label && <p className="text-sm font-medium text-slate-400">{label}</p>}
    </div>
  );
};

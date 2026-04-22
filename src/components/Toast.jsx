import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-3.5 shadow-lg border font-medium text-sm ${
        type === 'success'
          ? 'bg-white text-emerald-700 border-emerald-100'
          : 'bg-white text-red-700 border-red-100'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 size={18} className="text-emerald-500" />
        ) : (
          <AlertCircle size={18} className="text-red-500" />
        )}
        {message}
      </div>
    </div>
  );
}

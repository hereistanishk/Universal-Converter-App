import React from 'react';
import { Database, Plus } from 'lucide-react';

interface CreditBadgeProps {
  credits: number;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({ credits }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full transition-all hover:bg-indigo-500/20 group">
      <div className="flex items-center justify-center w-5 h-5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40">
        <Database className="w-3 h-3 text-white" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Allocation</span>
        <span className="text-sm font-bold text-white mono">
          {credits.toLocaleString()} <span className="text-slate-500 font-medium">U</span>
        </span>
      </div>
      <button className="ml-2 p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all">
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
import React from 'react';
import { Database, Loader2, Cpu } from 'lucide-react';

interface CreditBadgeProps {
  credits: number;
  isLoading?: boolean;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({ credits, isLoading }) => {
  return (
    <div className="flex items-center gap-4 px-5 py-2.5 border border-white/10 rounded-xl bg-black/40 backdrop-blur-md transition-all cursor-default hover:border-blue-500/30 group">
      <div className="p-1.5 bg-blue-500/10 rounded-md">
        <Cpu className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
      </div>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-slate-600 animate-spin" strokeWidth={1.5} />
        ) : (
          <span className="text-[11px] font-black text-white mono uppercase tracking-[0.2em]">
            {credits.toLocaleString()} <span className="text-slate-600">UNITS</span>
          </span>
        )}
      </div>
    </div>
  );
};
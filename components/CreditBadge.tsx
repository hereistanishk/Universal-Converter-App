
import React from 'react';
import { Database } from 'lucide-react';

interface CreditBadgeProps {
  credits: number;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({ credits }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full transition-all hover:bg-indigo-100">
      <Database className="w-4 h-4 text-indigo-600" />
      <span className="text-sm font-semibold text-indigo-900 leading-none">
        {credits} Credits
      </span>
    </div>
  );
};

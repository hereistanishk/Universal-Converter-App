
import React from 'react';
import { ProcessingProgress } from '../types';
import { Loader2 } from 'lucide-react';

interface ProcessingViewProps {
  progress: ProcessingProgress;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
  return (
    <div className="progressive-reveal w-full max-w-md mx-auto p-12 bg-white rounded-[12px] shadow-sm border border-slate-200 text-center">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin opacity-20" />
        </div>
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={377}
            strokeDashoffset={377 - (377 * progress.percentage) / 100}
            strokeLinecap="round"
            className="text-indigo-600 transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900 text-2xl">
          {progress.percentage}%
        </div>
      </div>

      <h4 className="text-lg font-semibold text-slate-900 mb-1">{progress.step}</h4>
      <p className="text-sm text-slate-500">Executing surgical transformations client-side.</p>
      
      <div className="mt-8 flex flex-col gap-2">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300" 
              style={{ width: `${progress.percentage}%` }}
            />
        </div>
      </div>
    </div>
  );
};

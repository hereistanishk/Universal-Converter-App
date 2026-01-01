import React from 'react';
import { ProcessingProgress } from '../types';
import { Loader2, Zap } from 'lucide-react';

interface ProcessingViewProps {
  progress: ProcessingProgress;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-12 slide-up">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" strokeWidth={3} />
        </div>
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
      </div>

      <div className="text-center space-y-4">
        <div className="text-3xl font-bold text-white tracking-tight">
          {progress.percentage}%
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-100">Converting...</h3>
          <p className="text-sm text-slate-500 max-w-[200px] mx-auto leading-relaxed">
            {progress.step}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="pt-8 flex items-center gap-2 text-xs font-bold text-slate-600">
        <Zap className="w-3 h-3" />
        Using browser compute power
      </div>
    </div>
  );
};
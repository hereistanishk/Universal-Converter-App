import React from 'react';
import { ProcessingProgress } from '../types';
import { Loader2, Activity, Terminal } from 'lucide-react';

interface ProcessingViewProps {
  progress: ProcessingProgress;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
  return (
    <div className="progressive-reveal w-full max-w-lg mx-auto p-12 glass-panel rounded-[12px] border border-white/10 text-center relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20">
        <div 
          className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-300" 
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="relative inline-block mb-10 mt-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-12 h-12 text-indigo-500/20 animate-pulse" />
        </div>
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="72"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="80"
            cy="80"
            r="72"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={452}
            strokeDashoffset={452 - (452 * progress.percentage) / 100}
            strokeLinecap="round"
            className="text-indigo-500 transition-all duration-700 ease-out shadow-lg"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white mono leading-none">{progress.percentage}%</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Capacity</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-indigo-500/20">
          <Loader2 className="w-3 h-3 animate-spin" />
          Active Sequence
        </div>
        <h4 className="text-2xl font-bold text-white">{progress.step}</h4>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">Executing surgical extraction and transcoding in the isolated edge runtime.</p>
      </div>
      
      <div className="mt-10 pt-8 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">
          <div className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Kernel Feed</div>
          <div className="mono">0x7F - {Math.floor(Math.random() * 1000)}ms</div>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500/50 transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.3)]" 
              style={{ width: `${progress.percentage}%` }}
            />
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { ProcessingProgress } from '../types';
import { Activity, Cpu, Terminal, Zap } from 'lucide-react';

interface ProcessingViewProps {
  progress: ProcessingProgress;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 text-center slide-up p-8">
      {/* Header Signal */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/5 rounded-full border border-blue-500/10">
          <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Synthesis Pipeline Active</span>
        </div>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em] italic h-4">
           {progress.step}
        </p>
      </div>

      {/* Large Progress Gauge - High end look */}
      <div className="relative">
        <div className="flex flex-col items-center justify-center">
          <div className="text-[120px] leading-none font-black text-white mono italic tracking-tighter opacity-90">
            {progress.percentage}<span className="text-4xl not-italic text-blue-500/50 ml-1">%</span>
          </div>
        </div>
        <div className="absolute -inset-16 bg-blue-500/[0.02] blur-[80px] rounded-full pointer-events-none" />
      </div>

      {/* Refined Bar */}
      <div className="w-full max-w-sm space-y-6">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden surgical-border">
          <div 
            className="h-full bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500 ease-out" 
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Technical Sub-Logs */}
        <div className="flex items-center justify-center gap-8 opacity-20">
          <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
            <Terminal className="w-3 h-3" /> WASM_NODE_v4
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-800" />
          <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
             <Cpu className="w-3 h-3" /> BUFFER_RAM_LOCAL
          </div>
        </div>
      </div>
    </div>
  );
};
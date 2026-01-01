import React from 'react';
import { Inbox, Download, RotateCcw, Box, HardDrive, Share2, ArrowDown, CheckCircle2 } from 'lucide-react';

interface CompleteViewProps {
  results: { url: string; filename: string }[];
  onReset: () => void;
}

export const CompleteView: React.FC<CompleteViewProps> = ({ results, onReset }) => {
  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleBatchDownload = () => {
    results.forEach((res, i) => {
      setTimeout(() => triggerDownload(res.url, res.filename), i * 150);
    });
  };

  return (
    <div className="h-full flex flex-col slide-up relative">
      {/* Success Signal - Hierarchy 1 */}
      <div className="flex flex-col items-center py-10 shrink-0">
        <div className="relative mb-5">
          <div className="w-16 h-16 bg-emerald-500/5 rounded-2xl flex items-center justify-center border border-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 border border-emerald-500/10 rounded-2xl scale-125 pulse-ring" />
        </div>
        
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black uppercase tracking-widest text-white italic">Synthesis Verified</h3>
          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.5em]">
            {results.length} Object{results.length > 1 ? 's' : ''} successfully localized
          </p>
        </div>
      </div>

      {/* Result Cards - Gestalt proximity */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-2 pb-8">
        <div className="max-w-xl mx-auto space-y-1.5">
          {results.map((res, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/[0.03] rounded-xl group hover:border-emerald-500/20 transition-all"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                 <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-emerald-500/60 group-hover:text-emerald-500 transition-colors">
                    <Box className="w-3.5 h-3.5" />
                 </div>
                 <div className="flex flex-col overflow-hidden">
                    <span className="text-[9px] font-bold uppercase tracking-widest truncate text-slate-400">
                      {res.filename}
                    </span>
                    <span className="text-[7px] font-black text-slate-800 uppercase tracking-widest">Binary Object</span>
                 </div>
              </div>
              <button 
                onClick={() => triggerDownload(res.url, res.filename)}
                className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-emerald-500 text-slate-700 hover:text-white rounded-lg transition-all border border-transparent active:scale-90"
              >
                 <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Zone - Hierarchy: Primary goal in Thumb Zone */}
      <div className="shrink-0 p-8 border-t border-white/[0.03] bg-black/10">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-8">
          <button
            onClick={handleBatchDownload}
            className="w-full btn-target rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.6em] transition-all hero-glow border border-emerald-400/20 group active:scale-[0.97]"
          >
            Extract Assets
          </button>

          <div className="flex items-center gap-12">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] hover:text-white transition-colors group"
            >
              <RotateCcw className="w-3 h-3 group-hover:-rotate-90 transition-transform" />
              Reset Node
            </button>
            <div className="w-0.5 h-0.5 bg-slate-800 rounded-full" />
            <button className="flex items-center gap-2 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] hover:text-white transition-colors">
              <Share2 className="w-3 h-3" />
              Relay
            </button>
          </div>
          
          <div className="text-[7px] font-black text-slate-900 uppercase tracking-[0.4em] italic">
            Memory purged on exit
          </div>
        </div>
      </div>
    </div>
  );
};
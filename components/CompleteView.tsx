import React from 'react';
import { CheckCircle, Download, RefreshCw, FileText, ArrowLeft } from 'lucide-react';

interface CompleteViewProps {
  downloadUrl: string;
  filename: string;
  onReset: () => void;
}

export const CompleteView: React.FC<CompleteViewProps> = ({ downloadUrl, filename, onReset }) => {
  return (
    <div className="progressive-reveal w-full max-w-lg mx-auto p-12 glass-panel rounded-[12px] border border-emerald-500/20 text-center">
      <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
        <CheckCircle className="w-12 h-12" />
      </div>
      
      <h3 className="text-3xl font-extrabold text-white mb-3">Operation Successful</h3>
      <div className="flex items-center justify-center gap-2 mb-10 px-4">
        <FileText className="w-4 h-4 text-slate-500" />
        <p className="text-slate-400 font-medium truncate max-w-xs mono text-sm">{filename}</p>
      </div>

      <div className="flex flex-col gap-4">
        <a
          href={downloadUrl}
          download={filename}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-500 text-white rounded-[8px] font-bold text-lg hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
        >
          <Download className="w-6 h-6" />
          Retrieve Output
        </a>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.03] text-slate-400 border border-white/10 rounded-[8px] font-bold hover:bg-white/[0.08] hover:text-white transition-all active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          Initiate New Sequence
        </button>
      </div>

      <div className="mt-12 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        Asset Verified & Ready for Deployment
      </div>
    </div>
  );
};
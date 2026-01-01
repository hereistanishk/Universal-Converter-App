import React from 'react';
    import { Download, CheckCircle, ArrowLeft, Share2, FileDown } from 'lucide-react';

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
    <div className="safe-scroll-container slide-up">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 text-emerald-500">
            <CheckCircle className="w-10 h-10" strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Files are ready!</h3>
          <p className="text-sm text-slate-500">
            {results.length} item{results.length > 1 ? 's' : ''} saved to your computer.
          </p>
        </div>

        <div className="w-full mt-10 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar px-2">
          {results.map((res, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl"
            >
              <span className="text-xs font-semibold text-slate-300 truncate pr-4">
                {res.filename}
              </span>
              <button 
                onClick={() => triggerDownload(res.url, res.filename)}
                className="p-2 hover:bg-emerald-500 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                 <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-slate-900/60 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          <button
            onClick={handleBatchDownload}
            className="w-full btn-target bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
          >
            <FileDown className="w-5 h-5 mr-3" />
            Download Now
          </button>

          <div className="flex items-center justify-center gap-8">
            <button
              onClick={onReset}
              className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Start over
            </button>
            <div className="w-1 h-1 bg-slate-800 rounded-full" />
            <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
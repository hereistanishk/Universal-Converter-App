
import React from 'react';
import { CheckCircle, Download, RefreshCw } from 'lucide-react';

interface CompleteViewProps {
  downloadUrl: string;
  filename: string;
  onReset: () => void;
}

export const CompleteView: React.FC<CompleteViewProps> = ({ downloadUrl, filename, onReset }) => {
  return (
    <div className="progressive-reveal w-full max-w-md mx-auto p-12 bg-white rounded-[12px] shadow-sm border border-slate-200 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Conversion Complete</h3>
      <p className="text-slate-500 mb-8 truncate px-4">{filename}</p>

      <div className="flex flex-col gap-3">
        <a
          href={downloadUrl}
          download={filename}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-[8px] font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Download className="w-5 h-5" />
          Download Ready File
        </a>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-[8px] font-medium hover:bg-slate-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Convert Another
        </button>
      </div>
    </div>
  );
};

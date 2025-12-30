
import React from 'react';
import { FileMetadata, ConversionFormat, ConversionSettings } from '../types';
import { TARGET_OPTIONS } from '../constants';
import { FileIcon, ArrowRight, X, Cpu, Clock } from 'lucide-react';

interface SelectionViewProps {
  file: FileMetadata;
  onCancel: () => void;
  onProcess: (settings: ConversionSettings) => void;
  credits: number;
}

export const SelectionView: React.FC<SelectionViewProps> = ({ file, onCancel, onProcess, credits }) => {
  const [selectedFormat, setSelectedFormat] = React.useState<ConversionFormat>('mp4');

  const handleStart = () => {
    const isTranscription = selectedFormat === 'txt' || selectedFormat === 'srt';
    onProcess({
      targetFormat: selectedFormat,
      isTranscription
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isAI = selectedFormat === 'txt' || selectedFormat === 'srt';
  const currentCost = isAI ? 5 : 1;

  return (
    <div className="progressive-reveal w-full max-w-2xl mx-auto glass-panel rounded-[12px] overflow-hidden border border-white/10">
      {/* Surgical File Header */}
      <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <FileIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-white truncate max-w-[280px] text-lg">{file.name}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500 mono">
              <span>{formatSize(file.size)}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>{file.type || 'Binary/Media'}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Target Orchestration */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Extraction Target
          </label>
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            <Cpu className="w-3 h-3" /> Local Runtime Only
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TARGET_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedFormat(opt.id as ConversionFormat)}
              className={`
                px-5 py-4 rounded-[8px] text-sm font-semibold border transition-all text-left group
                ${selectedFormat === opt.id 
                  ? 'border-indigo-500 bg-indigo-500/10 text-white ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'}
              `}
            >
              <div className="flex flex-col gap-1">
                <span>{opt.label}</span>
                <span className={`text-[9px] uppercase tracking-wider ${selectedFormat === opt.id ? 'text-indigo-300' : 'text-slate-600'}`}>
                  {opt.category} Engine
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-8 py-6 bg-white/[0.03] border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resource Allocation</span>
          <div className="text-sm font-bold text-white">
            {currentCost} <span className="text-slate-500 font-medium">Credits Required</span>
          </div>
        </div>
        {/* Fixed: Use handleStart instead of non-existent handleStartProcessing */}
        <button
          onClick={handleStart}
          disabled={credits < currentCost}
          className={`
            flex items-center gap-3 px-8 py-3 rounded-[8px] font-bold transition-all shadow-xl
            ${credits >= currentCost 
              ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/20 active:scale-95' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
          `}
        >
          Begin Sequence
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

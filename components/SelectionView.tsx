
import React from 'react';
import { FileMetadata, ConversionFormat, ConversionSettings } from '../types';
import { TARGET_OPTIONS } from '../constants';
import { FileIcon, ArrowRight, X } from 'lucide-react';

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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="progressive-reveal w-full max-w-2xl mx-auto bg-white rounded-[12px] shadow-sm border border-slate-200 overflow-hidden">
      {/* File Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <FileIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 truncate max-w-[240px]">{file.name}</h4>
            <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Format Selection */}
      <div className="p-8">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Select Output Format
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TARGET_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedFormat(opt.id as ConversionFormat)}
              className={`
                px-4 py-3 rounded-[8px] text-sm font-medium border transition-all text-left
                ${selectedFormat === opt.id 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="px-8 py-6 bg-slate-50 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Estimated Cost: <span className="font-semibold text-slate-900">
            {selectedFormat === 'txt' || selectedFormat === 'srt' ? '5' : '1'} Credits
          </span>
        </div>
        <button
          onClick={handleStart}
          disabled={credits < (selectedFormat === 'txt' || selectedFormat === 'srt' ? 5 : 1)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-[8px] font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100"
        >
          Begin Conversion
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

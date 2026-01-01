import React, { useState } from 'react';
import { FileMetadata, ConversionFormat, ConversionSettings } from '../types';
import { TARGET_OPTIONS } from '../constants';
import { 
  Film, 
  Music, 
  Image as ImageIcon, 
  Zap, 
  ChevronRight, 
  X,
  FileText,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface SelectionViewProps {
  files: FileMetadata[];
  onCancel: () => void;
  onProcess: (settings: ConversionSettings) => void;
  credits: number;
}

export const SelectionView: React.FC<SelectionViewProps> = ({ files, onCancel, onProcess, credits }) => {
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat | null>(null);

  const isAI = selectedFormat === 'txt' || selectedFormat === 'srt';
  const totalCost = (isAI ? 5 : 1) * files.length;
  const canAfford = credits >= totalCost;

  const getFormatIcon = (formatId: string) => {
    const opt = TARGET_OPTIONS.find(o => o.id === formatId);
    if (!opt) return <FileText className="w-4 h-4" />;
    switch (opt.category) {
      case 'Video': return <Film className="w-4 h-4" />;
      case 'Audio': return <Music className="w-4 h-4" />;
      case 'Image': return <ImageIcon className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const categories = Array.from(new Set(TARGET_OPTIONS.map(opt => opt.category)));

  return (
    <div className="safe-scroll-container slide-up">
      {/* Small Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-800/20">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Choose Format</span>
          <span className="text-sm font-bold text-white">{files.length} file{files.length > 1 ? 's' : ''} ready</span>
        </div>
        <button 
          onClick={onCancel} 
          className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-slate-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Internal Grid - Safe Scrolling */}
      <div className="scrollable-grid px-6 pt-6 custom-scrollbar">
        <div className="space-y-10">
          {categories.map((cat) => (
            <section key={cat} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                {cat}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {TARGET_OPTIONS.filter(o => o.category === cat).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedFormat(opt.id as ConversionFormat)}
                    className={`
                      relative p-4 flex items-center gap-4 rounded-xl border transition-all text-left group
                      ${selectedFormat === opt.id 
                        ? 'border-blue-500 bg-blue-500/10 text-white' 
                        : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10'}
                    `}
                  >
                    <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg ${selectedFormat === opt.id ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                      {getFormatIcon(opt.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold block text-slate-200">{opt.label}</span>
                      <p className="text-[11px] font-medium text-slate-500 truncate">
                        {opt.description}
                      </p>
                    </div>
                    {selectedFormat === opt.id && (
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Action Footer - Always visible */}
      <div className="p-6 border-t border-white/5 bg-slate-900/60 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs font-bold px-1">
             <span className="text-slate-500">Total Cost</span>
             <span className={`flex items-center gap-2 ${canAfford ? 'text-blue-400' : 'text-rose-400'}`}>
               <Zap className="w-3 h-3" /> {totalCost} points
             </span>
          </div>

          <button
            disabled={!selectedFormat || !canAfford}
            onClick={() => selectedFormat && onProcess({ targetFormat: selectedFormat, isTranscription: isAI })}
            className={`
              w-full btn-target rounded-xl transition-all shadow-lg
              ${!selectedFormat 
                ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                : canAfford 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 cursor-not-allowed'}
            `}
          >
            {!selectedFormat ? 'Choose a format' : canAfford ? 'Convert Now' : 'Not enough points'}
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { FileMetadata, ConversionFormat, ConversionSettings } from '../types';
import { TARGET_OPTIONS } from '../constants';
import { 
  Film, 
  Music, 
  Image as ImageIcon, 
  Zap, 
  ArrowRight, 
  X,
  FileText,
  Settings,
  ShieldCheck,
  Package
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
    if (!opt) return <FileText className="w-3.5 h-3.5" />;
    switch (opt.category) {
      case 'Video': return <Film className="w-3.5 h-3.5" />;
      case 'Audio': return <Music className="w-3.5 h-3.5" />;
      case 'Image': return <ImageIcon className="w-3.5 h-3.5" />;
      default: return <Zap className="w-3.5 h-3.5" />;
    }
  };

  const categories = Array.from(new Set(TARGET_OPTIONS.map(opt => opt.category)));

  return (
    <div className="flex flex-col h-full slide-up overflow-hidden">
      {/* Configuration Header - Minimal and Surgical */}
      <header className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/5 rounded-lg surgical-border">
            <Settings className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocol Selection</span>
            <div className="flex items-center gap-2">
               <span className="text-sm font-black text-slate-100 uppercase tracking-widest italic">{files.length} Input Objects</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-slate-600 hover:text-white transition-all surgical-border"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Grid Content Area - Stage focused */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {categories.map((cat) => (
            <section key={cat} className="space-y-4">
              <h4 className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] pl-1 flex items-center gap-4">
                {cat}
                <div className="flex-1 h-[0.5px] bg-white/[0.03]" />
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TARGET_OPTIONS.filter(o => o.category === cat).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedFormat(opt.id as ConversionFormat)}
                    className={`
                      relative p-4 flex items-center gap-4 rounded-xl border transition-all text-left group
                      ${selectedFormat === opt.id 
                        ? 'border-blue-500/30 bg-blue-500/10 text-white' 
                        : 'border-white/[0.03] bg-white/[0.01] text-slate-500 hover:border-white/[0.08] hover:bg-white/[0.02]'}
                    `}
                  >
                    <div className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg ${selectedFormat === opt.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-800'} transition-colors`}>
                      {getFormatIcon(opt.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-300">{opt.label}</span>
                      <p className="text-[8px] font-medium text-slate-600 uppercase tracking-widest truncate">
                        {opt.description}
                      </p>
                    </div>
                    {selectedFormat === opt.id && (
                      <ShieldCheck className="w-3 h-3 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Action Zone - Golden Ratio Spacing and Hierarchy */}
      <div className="shrink-0 p-8 border-t border-white/[0.03] bg-black/10">
        <div className="max-w-md mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center gap-10 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
            <span className="flex items-center gap-2"><Package className="w-3 h-3" /> Encrypted Buffer</span>
            <span className="flex items-center gap-2"><Zap className={`w-3 h-3 ${canAfford ? 'text-blue-500' : 'text-rose-500'}`} /> {totalCost} Power Units</span>
          </div>

          <button
            disabled={!selectedFormat || !canAfford}
            onClick={() => selectedFormat && onProcess({ targetFormat: selectedFormat, isTranscription: isAI })}
            className={`
              w-full btn-target rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all hero-glow surgical-border
              ${!selectedFormat 
                ? 'bg-white/[0.01] border-white/5 text-slate-800 cursor-not-allowed italic' 
                : canAfford 
                  ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg border-blue-400/20' 
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-500/40 cursor-not-allowed'}
            `}
          >
            {!selectedFormat ? 'Awaiting Protocol' : canAfford ? 'Execute Synthesis' : 'Energy Insufficient'}
          </button>

          <div className="text-[7px] font-bold text-slate-800 uppercase tracking-[0.5em]">
            Local Execution // 0.5px Grid Refinement
          </div>
        </div>
      </div>
    </div>
  );
};
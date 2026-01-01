import React, { useState, useMemo } from 'react';
import { FileMetadata, ConversionSettings, ConversionCategory, ConversionFormat } from '../types';
import { CATEGORIES, FORMAT_MAP, RESOLUTIONS, QUALITIES } from '../constants';
import { 
  Film, 
  Music, 
  ImageIcon, 
  Sparkles, 
  ArrowRight, 
  X, 
  ArrowLeft,
  ChevronRight,
  Zap,
  LayoutGrid
} from 'lucide-react';

interface SelectionViewProps {
  files: FileMetadata[];
  onCancel: () => void;
  onProcess: (settings: ConversionSettings) => void;
  credits: number;
}

const IconMap: Record<string, any> = {
  Film,
  Music,
  ImageIcon,
  Sparkles
};

export const SelectionView: React.FC<SelectionViewProps> = ({ files, onCancel, onProcess, credits }) => {
  const [category, setCategory] = useState<ConversionCategory | null>(null);
  const [format, setFormat] = useState<ConversionFormat | null>(null);
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4K'>('1080p');
  const [quality, setQuality] = useState<'Small File' | 'Balanced' | 'High Quality'>('Balanced');

  // Logic to determine if we can proceed
  const canConvert = !!category && !!format;
  const isAI = category === 'other';
  const totalCost = (isAI ? 5 : 1) * files.length;
  const canAfford = credits >= totalCost;

  // Dynamic Summary Text
  const summaryText = useMemo(() => {
    if (!category || !format) return "Select format to begin";
    let text = `${format.toUpperCase()}`;
    if (category === 'video') text += ` @ ${resolution} (${quality})`;
    return `Target: ${text}`;
  }, [category, format, resolution, quality]);

  const handleCategorySelect = (cat: ConversionCategory) => {
    setCategory(cat);
    // Auto-select first format in that category
    setFormat(FORMAT_MAP[cat][0].id);
  };

  return (
    <div className="safe-scroll-container slide-up flex flex-col h-full bg-slate-900/10">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-800/20 shrink-0">
        <div className="flex items-center gap-3">
          {category ? (
            <button 
              onClick={() => setCategory(null)}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10 rounded-lg">
              <LayoutGrid className="w-4 h-4 text-blue-500" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {category ? 'Configure' : 'Choose Category'}
            </span>
            <span className="text-sm font-bold text-white">{files.length} file{files.length > 1 ? 's' : ''}</span>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-slate-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="scrollable-grid px-6 py-6 custom-scrollbar flex-1 overflow-y-auto">
        {!category ? (
          /* 2x2 Category Grid */
          <div className="grid grid-cols-2 gap-4 h-full content-center py-4">
            {CATEGORIES.map((cat) => {
              const Icon = IconMap[cat.icon];
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="group flex flex-col items-center justify-center p-6 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-blue-500/50 transition-all aspect-square"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                    <Icon className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-sm font-bold text-slate-200">{cat.label}</span>
                  <span className="text-[10px] text-slate-500 font-medium mt-1">{cat.description}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Sub-Menu Config Options */
          <div className="space-y-8 pb-12">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Format</label>
              <div className="flex flex-wrap gap-2">
                {FORMAT_MAP[category].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      format === f.id 
                        ? 'bg-blue-600 border-blue-400 text-white' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Specific Toggles */}
            {category === 'video' && (
              <>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {RESOLUTIONS.map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={`py-2 rounded-xl border text-[10px] font-black tracking-widest transition-all ${
                          resolution === res 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Quality</label>
                  <div className="grid grid-cols-1 gap-2">
                    {QUALITIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[11px] font-bold transition-all ${
                          quality === q 
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                        }`}
                      >
                        <span>{q}</span>
                        {quality === q && <ChevronRight className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Info Note */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
              <Zap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-slate-400">
                Processed locally in your browser. Higher quality settings may take more time and battery.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer - Pinned to Bottom */}
      <div className="p-6 border-t border-white/5 bg-slate-900/90 backdrop-blur-xl shrink-0 z-50">
        <div className="flex flex-col gap-3">
          {/* Dynamic Preview Label */}
          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               {summaryText}
             </span>
             <span className={`text-[10px] font-bold flex items-center gap-1.5 ${canAfford ? 'text-blue-400' : 'text-rose-400'}`}>
               <Zap className="w-3 h-3" /> {totalCost} pts
             </span>
          </div>

          <button
            disabled={!canConvert || !canAfford}
            onClick={() => category && format && onProcess({ 
              category, 
              targetFormat: format, 
              resolution, 
              quality,
              isTranscription: isAI 
            })}
            className={`
              w-full h-[54px] rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl
              ${!canConvert 
                ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
                : canAfford 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 active:scale-[0.97] border border-blue-400/30' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 cursor-not-allowed'}
            `}
          >
            {canAfford ? (
              <>
                Convert <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              'Not enough points'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
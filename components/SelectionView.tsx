import React, { useState, useMemo } from 'react';
import { FileMetadata, ConversionSettings, ConversionCategory, ConversionFormat } from '../types';
import { CATEGORIES, FORMAT_MAP, RESOLUTIONS, QUALITIES, IMAGE_QUALITIES, BITRATES } from '../constants';
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
  const [imageQuality, setImageQuality] = useState<'Good' | 'Great' | 'Best'>('Great');
  const [bitrate, setBitrate] = useState<'128kbps' | '192kbps' | '320kbps'>('192kbps');

  const canConvert = !!category && !!format;
  const isAI = category === 'other';
  const totalCost = (isAI ? 5 : 1) * files.length;
  const canAfford = credits >= totalCost;

  const summaryText = useMemo(() => {
    if (!category || !format) return "Configure options";
    let text = `${format.toUpperCase()}`;
    if (category === 'video') text += ` @ ${resolution}`;
    if (category === 'audio') text += ` (${bitrate})`;
    if (category === 'image') text += ` (${imageQuality})`;
    return `Target: ${text}`;
  }, [category, format, resolution, quality, imageQuality, bitrate]);

  const handleCategorySelect = (cat: ConversionCategory) => {
    setCategory(cat);
    setFormat(FORMAT_MAP[cat][0].id);
  };

  const selectedButtonStyle = "bg-blue-600 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]";
  const defaultButtonStyle = "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10";

  return (
    <div className="safe-scroll-container slide-up flex flex-col h-full">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-800/20 shrink-0">
        <div className="flex items-center gap-3">
          {category ? (
            <button 
              onClick={() => setCategory(null)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-all border border-white/5 bg-white/5 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
            </button>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10 rounded-lg">
              <LayoutGrid className="w-4 h-4 text-blue-500" />
            </div>
          )}
          {!category && (
            <div className="flex flex-col ml-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Category</span>
              <span className="text-xs font-bold text-white leading-none">{files.length} file{files.length > 1 ? 's' : ''} uploaded</span>
            </div>
          )}
        </div>
        <button 
          onClick={onCancel} 
          className="w-8 h-8 flex items-center justify-center hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area (Scrollable if needed) */}
      <div className="scrollable-grid px-6 py-6 custom-scrollbar flex-1 overflow-y-auto">
        {!category ? (
          <div className="grid grid-cols-2 gap-3 h-full items-center py-4">
            {CATEGORIES.map((cat) => {
              const Icon = IconMap[cat.icon];
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="group flex flex-col items-center justify-center p-5 rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-blue-600/10 hover:border-blue-500/30 transition-all aspect-square active:scale-95"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-sm font-bold text-slate-200 uppercase tracking-wide">{cat.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Output Format</label>
              <div className="flex flex-wrap gap-2">
                {FORMAT_MAP[category].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                      format === f.id ? selectedButtonStyle : defaultButtonStyle
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Specific */}
            {category === 'video' && (
              <>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {RESOLUTIONS.map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={`py-2 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${
                          resolution === res ? selectedButtonStyle : defaultButtonStyle
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Compression</label>
                  <div className="grid grid-cols-1 gap-2">
                    {QUALITIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[11px] font-bold transition-all active:scale-[0.98] ${
                          quality === q 
                            ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]" 
                            : defaultButtonStyle
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

            {/* Audio Specific */}
            {category === 'audio' && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Target Bitrate</label>
                <div className="grid grid-cols-1 gap-2">
                  {BITRATES.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBitrate(b)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[11px] font-bold transition-all active:scale-[0.98] ${
                        bitrate === b 
                          ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]" 
                          : defaultButtonStyle
                      }`}
                    >
                      <span>{b}</span>
                      {bitrate === b && <ChevronRight className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Specific */}
            {category === 'image' && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Quality Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {IMAGE_QUALITIES.map((iq) => (
                    <button
                      key={iq}
                      onClick={() => setImageQuality(iq)}
                      className={`py-2 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${
                        imageQuality === iq ? selectedButtonStyle : defaultButtonStyle
                      }`}
                    >
                      {iq}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer - Fixed Position */}
      <div className="p-6 border-t border-white/5 bg-slate-900/95 backdrop-blur-2xl shrink-0 z-50">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[70%]">
               {summaryText}
             </span>
             <span className={`text-xs font-bold flex items-center gap-1.5 ${canAfford ? 'text-blue-400' : 'text-rose-400'}`}>
               <Zap className="w-3.5 h-3.5" /> {totalCost} pts
             </span>
          </div>

          <button
            disabled={!canConvert || !canAfford}
            onClick={() => category && format && onProcess({ 
              category, 
              targetFormat: format, 
              resolution, 
              quality,
              imageQuality,
              bitrate,
              isTranscription: isAI 
            })}
            className={`
              w-full h-[52px] rounded-2xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.96] btn-target
              ${!canConvert 
                ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
                : canAfford 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 border border-blue-400/30' 
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
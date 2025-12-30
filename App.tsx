import React, { useState, useEffect, useCallback } from 'react';
import { AppState, FileMetadata, ConversionSettings, ProcessingProgress } from './types';
import { INITIAL_CREDITS, COST_CONVERSION, COST_TRANSCRIPTION } from './constants';
import { CreditBadge } from './components/CreditBadge';
import { Dropzone } from './components/Dropzone';
import { SelectionView } from './components/SelectionView';
import { ProcessingView } from './components/ProcessingView';
import { CompleteView } from './components/CompleteView';
import { processMedia } from './services/mediaService';
import { Layers, Zap, Info, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('omni_credits');
    return saved ? parseInt(saved, 10) : INITIAL_CREDITS;
  });
  
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({ percentage: 0, step: '' });
  const [outputResult, setOutputResult] = useState<{ url: string; filename: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('omni_credits', credits.toString());
  }, [credits]);

  const handleFileSelect = (file: FileMetadata) => {
    setSelectedFile(file);
    setAppState(AppState.SELECTION);
  };

  const handleStartProcessing = async (settings: ConversionSettings) => {
    if (!selectedFile) return;

    const cost = settings.isTranscription ? COST_TRANSCRIPTION : COST_CONVERSION;
    if (credits < cost) return;

    setAppState(AppState.PROCESSING);
    
    try {
      const result = await processMedia(selectedFile, settings, (p) => {
        setProcessingProgress(p);
      });
      
      setOutputResult(result);
      setCredits(prev => prev - cost);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setOutputResult(null);
    setProcessingProgress({ percentage: 0, step: '' });
    setAppState(AppState.IDLE);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col antialiased">
      {/* Surgical Navigation */}
      <header className="sticky top-0 z-50 h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-indigo-500 rounded-[6px] flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">Omni<span className="text-indigo-400">Convert</span></span>
            <div className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase leading-none mt-1">Surgical Media Engine</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edge Isolated</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>0ms Cloud Latency</span>
            </div>
          </div>
          <CreditBadge credits={credits} />
        </div>
      </header>

      {/* Main Orchestration Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl space-y-8">
          {appState === AppState.IDLE && (
            <div className="text-center mb-12 progressive-reveal">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Client-Side Media <span className="text-indigo-400">Surgery.</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Transcode, extract, and transcribe high-fidelity assets without leaving your browser. 
                Secured by local compute, optimized for efficiency.
              </p>
            </div>
          )}

          <div className="relative">
            {appState === AppState.IDLE && <Dropzone onFileSelect={handleFileSelect} />}
            
            {appState === AppState.SELECTION && selectedFile && (
              <SelectionView 
                file={selectedFile} 
                onCancel={handleReset} 
                onProcess={handleStartProcessing} 
                credits={credits}
              />
            )}

            {appState === AppState.PROCESSING && (
              <ProcessingView progress={processingProgress} />
            )}

            {appState === AppState.COMPLETE && outputResult && (
              <CompleteView 
                downloadUrl={outputResult.url} 
                filename={outputResult.filename} 
                onReset={handleReset} 
              />
            )}

            {appState === AppState.ERROR && (
              <div className="progressive-reveal text-center p-12 glass-panel rounded-[12px] border border-red-500/20">
                <div className="inline-flex p-3 bg-red-500/10 text-red-500 rounded-full mb-6">
                  <Info className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Extraction Interrupted</h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  An unexpected error occurred during the local processing sequence. Ensure your browser supports WebAssembly.
                </p>
                <button 
                  onClick={handleReset} 
                  className="px-8 py-3 bg-white text-slate-900 rounded-[8px] font-bold hover:bg-slate-100 transition-all active:scale-95"
                >
                  Return to Hangar
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Technical Footer */}
      <footer className="h-14 border-t border-white/5 flex items-center justify-between px-8 text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em] bg-[#0b1222]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
            Core: WASM/FFmpeg
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
            AI: Transformers.js
          </div>
        </div>
        <div className="hidden sm:block">
          OmniConvert v1.4.2 // Surgical System Ready
        </div>
        <div className="flex items-center gap-2 text-indigo-400">
          <Info className="w-3 h-3" />
          Status: Operational
        </div>
      </footer>
    </div>
  );
};

export default App;
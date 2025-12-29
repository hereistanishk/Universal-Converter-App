
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, FileMetadata, ConversionSettings, ProcessingProgress } from './types';
import { INITIAL_CREDITS, COST_CONVERSION, COST_TRANSCRIPTION } from './constants';
import { CreditBadge } from './components/CreditBadge';
import { Dropzone } from './components/Dropzone';
import { SelectionView } from './components/SelectionView';
import { ProcessingView } from './components/ProcessingView';
import { CompleteView } from './components/CompleteView';
import { processMedia } from './services/mediaService';
import { Layers, Zap } from 'lucide-react';

const App: React.FC = () => {
  // --- State Machine ---
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('omni_credits');
    return saved ? parseInt(saved, 10) : INITIAL_CREDITS;
  });
  
  // --- Data Stores ---
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({ percentage: 0, step: '' });
  const [outputResult, setOutputResult] = useState<{ url: string; filename: string } | null>(null);

  // Sync credits to localStorage
  useEffect(() => {
    localStorage.setItem('omni_credits', credits.toString());
  }, [credits]);

  // Transitions
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-[8px] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Omni<span className="text-indigo-600">Convert</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <CreditBadge credits={credits} />
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest pl-4 border-l border-slate-100">
            <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
            Zero Cloud Latency
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {appState === AppState.IDLE && (
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                The Surgical Conversion System.
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Process high-fidelity media and AI transcriptions entirely in your browser. 
                No servers, no tracking, pure performance.
              </p>
            </div>
          )}

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
            <div className="text-center p-12 bg-white rounded-[12px] border border-red-200">
              <h3 className="text-xl font-bold text-red-600 mb-2">Process Interrupted</h3>
              <p className="text-slate-500 mb-6">Something went wrong during the surgical extraction.</p>
              <button onClick={handleReset} className="px-6 py-2 bg-slate-900 text-white rounded-[8px]">Try Again</button>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Features */}
      <footer className="h-16 border-t border-slate-200 flex items-center justify-center gap-12 text-xs font-medium text-slate-400 uppercase tracking-[0.2em] bg-white">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Client-Side Only
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            FFmpeg.wasm
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Transformers.js
        </div>
      </footer>
    </div>
  );
};

export default App;

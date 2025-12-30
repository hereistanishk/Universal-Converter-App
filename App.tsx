import React, { useState, useEffect, useCallback } from 'react';
import { AppState, FileMetadata, ConversionSettings, ProcessingProgress } from './types';
import { INITIAL_CREDITS, COST_CONVERSION, COST_TRANSCRIPTION } from './constants';
import { CreditBadge } from './components/CreditBadge';
import { Dropzone } from './components/Dropzone';
import { SelectionView } from './components/SelectionView';
import { ProcessingView } from './components/ProcessingView';
import { CompleteView } from './components/CompleteView';
import { Auth } from './components/Auth';
import { processMedia } from './services/mediaService';
import { supabase } from './lib/supabase';
import { Layers, Zap, Info, ShieldCheck, User, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [credits, setCredits] = useState<number>(INITIAL_CREDITS);
  const [loadingCredits, setLoadingCredits] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({ percentage: 0, step: '' });
  const [outputResult, setOutputResult] = useState<{ url: string; filename: string } | null>(null);

  // Sync session and fetch credits
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserCredits(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserCredits(session.user.id);
      } else {
        // Reset to initial credits if logged out
        setCredits(INITIAL_CREDITS);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserCredits = async (userId: string) => {
    setLoadingCredits(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setCredits(data.credits);
    }
    setLoadingCredits(false);
  };

  const syncCreditsToDB = async (newBalance: number) => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ credits: newBalance })
      .eq('id', user.id);
  };

  const handleFileSelect = (file: FileMetadata) => {
    setSelectedFile(file);
    setAppState(AppState.SELECTION);
  };

  const handleStartProcessing = async (settings: ConversionSettings) => {
    if (!selectedFile) return;

    const cost = settings.isTranscription ? COST_TRANSCRIPTION : COST_CONVERSION;
    if (credits < cost) {
      alert("Insufficient operational credits.");
      return;
    }

    setAppState(AppState.PROCESSING);
    
    try {
      const result = await processMedia(selectedFile, settings, (p) => {
        setProcessingProgress(p);
      });
      
      const newBalance = credits - cost;
      setCredits(newBalance);
      setOutputResult(result);
      
      // Update DB only after success
      if (user) {
        await syncCreditsToDB(newBalance);
      } else {
        // If guest, keep it local
        localStorage.setItem('omni_credits', newBalance.toString());
      }

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col antialiased">
      {isAuthOpen && <Auth onClose={() => setIsAuthOpen(false)} />}

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
            <div className="flex items-center gap-2 text-indigo-400">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>0ms Cloud Latency</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditBadge credits={credits} isLoading={loadingCredits} />
            
            <div className="w-px h-8 bg-white/10" />

            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-[8px] transition-all text-[10px] font-bold uppercase tracking-widest text-slate-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Terminate Session</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[8px] transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20"
              >
                <User className="w-3.5 h-3.5" />
                Authorize
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl space-y-8">
          {appState === AppState.IDLE && (
            <div className="text-center mb-12 progressive-reveal">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Client-Side Media <span className="text-indigo-400">Surgery.</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Transcode, extract, and transcribe high-fidelity assets without leaving your browser. 
                {user ? ' Balanced synced to your operator profile.' : ' Secured by local compute, optimized for efficiency.'}
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
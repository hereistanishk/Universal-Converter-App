import React, { useState, useEffect, useCallback } from 'react';
import { AppState, FileMetadata, ConversionSettings, ProcessingProgress } from './types';
import { INITIAL_CREDITS, COST_CONVERSION, COST_TRANSCRIPTION } from './constants';
import { Dropzone } from './components/Dropzone';
import { SelectionView } from './components/SelectionView';
import { ProcessingView } from './components/ProcessingView';
import { CompleteView } from './components/CompleteView';
import { Auth } from './components/Auth';
import { processMedia } from './services/mediaService';
import { supabase } from './lib/supabase';
import { 
  Box, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Sparkles, 
  Cpu, 
  Terminal
} from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [credits, setCredits] = useState<number>(INITIAL_CREDITS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<FileMetadata[]>([]);
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({ percentage: 0, step: '' });
  const [outputResults, setOutputResults] = useState<{ url: string; filename: string }[]>([]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchUserCredits(session.user.id);
        }
      } catch (err) {
        console.error("Session error", err);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserCredits(currentUser.id);
      } else {
        setCredits(INITIAL_CREDITS);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserCredits = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('credits').eq('id', userId).single();
      if (!error && data) setCredits(data.credits);
    } catch (e) {}
  };

  const handleStartProcessing = async (settings: ConversionSettings) => {
    if (selectedFiles.length === 0) return;
    
    const unitCost = settings.isTranscription ? COST_TRANSCRIPTION : COST_CONVERSION;
    const totalCost = unitCost * selectedFiles.length;

    if (credits < totalCost) {
      setToast({ message: "Insufficent Energy", type: 'error' });
      return;
    }

    setAppState(AppState.PROCESSING);
    const results: { url: string; filename: string }[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const result = await processMedia(file, settings, (p) => {
          const overallBase = (i / selectedFiles.length) * 100;
          const currentStepProgress = p.percentage / selectedFiles.length;
          setProcessingProgress({
            percentage: Math.round(overallBase + currentStepProgress),
            step: `Synthesizing ${i + 1}/${selectedFiles.length}: ${p.step}`
          });
        });
        results.push(result);
      }
      
      const newBalance = credits - totalCost;
      setCredits(newBalance);
      setOutputResults(results);
      
      if (user) await supabase.from('profiles').update({ credits: newBalance }).eq('id', user.id);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      setAppState(AppState.ERROR);
      setToast({ message: "Synthesis Failure", type: 'error' });
    }
  };

  const handleReset = useCallback(() => {
    setSelectedFiles([]);
    setOutputResults([]);
    setProcessingProgress({ percentage: 0, step: '' });
    setAppState(AppState.IDLE);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#020617] text-slate-400 overflow-hidden font-inter select-none">
      {isAuthOpen && <Auth onClose={() => setIsAuthOpen(false)} />}
      
      {/* Toast Notification */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-xs px-4 pointer-events-none">
        {toast && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl glass-panel surgical-border shadow-2xl slide-up pointer-events-auto">
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">{toast.message}</span>
          </div>
        )}
      </div>

      {/* Header - 1px refined */}
      <header className="h-[72px] flex items-center justify-between px-8 border-b border-white/[0.03] bg-black/20 shrink-0">
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleReset}>
          <div className="w-9 h-9 bg-blue-500/5 rounded-lg flex items-center justify-center border border-blue-500/10 transition-colors hover:border-blue-500/30">
            <Box className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">OmniConvert</span>
            <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Surgical_v4.5</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-blue-500/5 rounded-lg border border-blue-500/10">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-black mono text-blue-400">{credits.toLocaleString()}U</span>
          </div>
          {user ? (
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <LogOut className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition-colors" />
            </button>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)} 
              className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all"
            >
              Access
            </button>
          )}
        </div>
      </header>

      {/* Main Stage - Viewport Safety Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
        <div className="w-full max-w-5xl h-full glass-panel rounded-[32px] overflow-hidden flex flex-col relative surgical-border bg-[#020617]/40">
          
          {appState === AppState.IDLE && (
            <Dropzone onFilesSelect={(files) => { setSelectedFiles(files); setAppState(AppState.SELECTION); }} />
          )}
          
          {appState === AppState.SELECTION && (
            <SelectionView files={selectedFiles} onCancel={handleReset} onProcess={handleStartProcessing} credits={credits} />
          )}

          {appState === AppState.PROCESSING && (
            <div className="flex-1 overflow-hidden">
               <ProcessingView progress={processingProgress} />
            </div>
          )}

          {appState === AppState.COMPLETE && (
            <CompleteView results={outputResults} onReset={handleReset} />
          )}

          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 slide-up">
              <div className="w-16 h-16 bg-rose-500/5 rounded-2xl flex items-center justify-center border border-rose-500/10">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-wider text-rose-500">Node Fault</h3>
                <p className="text-[9px] text-slate-700 uppercase tracking-widest">Internal Engine Thread Aborted</p>
              </div>
              <button onClick={handleReset} className="px-8 py-3 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Reset Core</button>
            </div>
          )}
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="h-12 border-t border-white/[0.03] flex items-center justify-between px-8 bg-black/10 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 pulse-ring" />
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Core: Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-slate-800" />
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">WASM: Multi-Thread</span>
          </div>
        </div>

        <div className="flex items-center gap-4 opacity-30">
           <Terminal className="w-3 h-3 text-slate-700" />
           <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Client_Side Synthesis Active</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
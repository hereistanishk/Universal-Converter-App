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
  FileBox, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Zap,
  Lock
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
      setToast({ message: "Not enough points", type: 'error' });
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
            step: `Working on file ${i + 1} of ${selectedFiles.length}...`
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
      setToast({ message: "Something went wrong", type: 'error' });
    }
  };

  const handleReset = useCallback(() => {
    setSelectedFiles([]);
    setOutputResults([]);
    setProcessingProgress({ percentage: 0, step: '' });
    setAppState(AppState.IDLE);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f172a] text-slate-300 overflow-hidden select-none">
      {isAuthOpen && <Auth onClose={() => setIsAuthOpen(false)} />}
      
      {/* Friendly Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-xs px-4 pointer-events-none">
        {toast && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel shadow-2xl slide-up pointer-events-auto">
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span className="text-sm font-semibold text-slate-100">{toast.message}</span>
          </div>
        )}
      </div>

      {/* Header - Simple and approachable */}
      <header className="h-[64px] flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <FileBox className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">OmniConvert</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/5 rounded-full border border-blue-500/10">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">{credits.toLocaleString()} pts</span>
          </div>
          {user ? (
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <LogOut className="w-4 h-4 text-slate-500" />
            </button>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)} 
              className="text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 active:scale-95 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* The Stage - Centered max-w-md Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-md h-full glass-panel rounded-[32px] overflow-hidden flex flex-col relative bg-slate-900/20">
          
          {appState === AppState.IDLE && (
            <Dropzone onFilesSelect={(files) => { setSelectedFiles(files); setAppState(AppState.SELECTION); }} />
          )}
          
          {appState === AppState.SELECTION && (
            <SelectionView files={selectedFiles} onCancel={handleReset} onProcess={handleStartProcessing} credits={credits} />
          )}

          {appState === AppState.PROCESSING && (
            <ProcessingView progress={processingProgress} />
          )}

          {appState === AppState.COMPLETE && (
            <CompleteView results={outputResults} onReset={handleReset} />
          )}

          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 slide-up p-8">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Conversion failed</h3>
                <p className="text-sm text-slate-400">Please try again with a different file.</p>
              </div>
              <button onClick={handleReset} className="btn-target w-full bg-white text-black rounded-xl active:scale-95">Try Again</button>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="h-10 flex items-center justify-center px-6 shrink-0">
        <div className="flex items-center gap-2 opacity-40">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] font-medium uppercase tracking-widest">Private & Secured</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
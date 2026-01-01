import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, X, Fingerprint } from 'lucide-react';

interface AuthProps {
  onClose: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else {
        onClose();
      }
    } catch (err) {
      setError('System authentication fault.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#020617]/95 backdrop-blur-xl">
      <div className="w-full max-w-md glass-panel rounded-3xl overflow-hidden progressive-reveal shadow-[0_0_100px_rgba(0,0,0,0.5)] border-white/10">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              {isSignUp ? <UserPlus className="w-5 h-5 text-blue-500" strokeWidth={1.5} /> : <Fingerprint className="w-5 h-5 text-blue-500" strokeWidth={1.5} />}
            </div>
            {isSignUp ? 'Node Registration' : 'Operator Login'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-600 hover:text-white border border-transparent hover:border-white/10">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleAuth} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-black uppercase tracking-widest leading-relaxed">
              System fault: {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Identifier</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:outline-none focus:border-blue-500/50 transition-all mono placeholder-slate-800"
                placeholder="operator@omni.system"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Security Cipher</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:outline-none focus:border-blue-500/50 transition-all mono placeholder-slate-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="relative overflow-hidden w-full py-5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-blue-500 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-blue-600/20 disabled:opacity-50 btn-sweep"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Initialize Profile' : 'Authorize Node')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-500 transition-colors"
            >
              {isSignUp ? 'Switch to Login' : 'Request Terminal Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
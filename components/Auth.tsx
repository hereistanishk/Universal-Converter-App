import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, X, Lock } from 'lucide-react';

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
      setError('Connection problem.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
      <div className="w-full max-w-sm glass-panel rounded-3xl overflow-hidden slide-up">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-3">
            <Lock className="w-4 h-4 text-blue-500" />
            {isSignUp ? 'Create account' : 'Sign in'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-semibold text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full btn-target bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
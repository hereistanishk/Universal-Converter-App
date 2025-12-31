import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, X } from 'lucide-react';

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

    console.log(`Initiating ${isSignUp ? 'SignUp' : 'SignIn'} for:`, email);

    try {
      const { data, error: authError } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: window.location.origin,
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        console.error('Supabase Auth Error details:', {
          message: authError.message,
          status: authError.status,
          name: authError.name,
          fullError: authError
        });
        setError(authError.message);
        setLoading(false);
      } else {
        console.log('Auth successful:', data);
        onClose();
      }
    } catch (err) {
      console.error('Unexpected Auth Exception:', err);
      setError('An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="progressive-reveal w-full max-w-md glass-panel rounded-[12px] border border-white/10 overflow-hidden">
        <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {isSignUp ? <UserPlus className="w-5 h-5 text-indigo-400" /> : <LogIn className="w-5 h-5 text-indigo-400" />}
            {isSignUp ? 'Create Operator Profile' : 'Operator Authentication'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                Deployment Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors mono text-sm"
                placeholder="operator@omni.system"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                Access Credentials
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-[8px] px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors mono text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-500 text-white rounded-[8px] font-bold text-sm uppercase tracking-[0.2em] hover:bg-indigo-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Register operator' : 'Authorize Access')}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors"
            >
              {isSignUp ? 'Existing Operator? Sign In' : 'New Operator? Register Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
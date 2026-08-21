import React, { useState } from 'react';
import { AuthService } from '../../services/authService';

interface AdminLoginPageProps {
  onNavigate: (page: string, param?: string | number) => void;
  darkMode?: boolean;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await AuthService.login(email, password, rememberMe);
      if (result.success) {
        onNavigate('admin');
      } else {
        setError(result.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#09101E] transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden">
          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#0B192C] to-sky-400" />

          {/* Logo / Lock Icon */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0B192C] dark:bg-blue-600 text-white mx-auto flex items-center justify-center mb-4 shadow-md">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0B192C] dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              WebSoul Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono-tech">
              Protected Dashboard Authentication
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-mono-tech flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@websoul.tech"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#0B192C] dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B192C] dark:focus:border-blue-500 transition-all font-normal"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-mono-tech text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#0B192C] dark:text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B192C] dark:focus:border-blue-500 transition-all font-normal"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono-tech">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-slate-500 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white cursor-pointer"
              >
                Back to Site →
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0B192C] dark:bg-blue-600 hover:bg-[#1E3A8A] dark:hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs sm:text-sm font-mono-tech transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Log In to Dashboard →</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-6 font-mono-tech">
          🔒 Secure SSL encrypted administration panel.
        </p>
      </div>
    </div>
  );
};

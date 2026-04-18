import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
    { label: 'One special symbol (!@#$%^&*)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
    { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  ];

  const allRulesPassed = passwordRules.every(r => r.test(formData.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!allRulesPassed) {
        setError('Password does not meet the requirements.');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }

    if (mode === 'signup') {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed.'); setLoading(false); return; }
      login({ name: data.name, email: data.email, token: data.token, _id: data._id });
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login failed.'); setLoading(false); return; }
      login({ name: data.name, email: data.email, token: data.token, _id: data._id });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0E0E0E] flex items-center justify-center relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#2962FF]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#26A69A]/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl shadow-[0_0_50px_rgba(41,98,255,0.4)] mb-4 overflow-hidden border border-[#2B2B43]">
            <img src="/logo.png" alt="The Discipline Trader" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-cyan-400">
            The Discipline Trader
          </h1>
          <p className="text-[#787B86] text-sm mt-1">Trade with purpose. Win with discipline.</p>
        </div>

        {/* Card */}
        <div className="bg-[#131722] border border-[#2B2B43] rounded-3xl shadow-2xl p-8 backdrop-blur">
          {/* Tab Switcher */}
          <div className="flex bg-[#1E222D] p-1 rounded-xl mb-8 border border-[#2B2B43]">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'bg-[#2962FF] text-white shadow-lg' : 'text-[#787B86] hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'signup' ? 'bg-[#2962FF] text-white shadow-lg' : 'text-[#787B86] hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#787B86] uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#1E222D] border border-[#2B2B43] focus:border-[#2962FF] rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder-[#4A4E5A]"
                  placeholder="Amrut Adhav"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#787B86] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#1E222D] border border-[#2B2B43] focus:border-[#2962FF] rounded-xl px-4 py-3 text-white outline-none transition-colors placeholder-[#4A4E5A]"
                placeholder="trader@example.com"
              />
            </div>

            {/* Password with tooltip popup */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-xs font-bold text-[#787B86] uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setShowPasswordHint(true)}
                  onBlur={() => setTimeout(() => setShowPasswordHint(false), 200)}
                  className="bg-[#1E222D] border border-[#2B2B43] focus:border-[#2962FF] rounded-xl px-4 py-3 pr-12 text-white outline-none transition-colors w-full placeholder-[#4A4E5A]"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787B86] hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              {/* Password strength popup */}
              {showPasswordHint && mode === 'signup' && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#1A1F2E] border border-[#2B2B43] rounded-xl p-4 shadow-2xl z-50">
                  <p className="text-xs font-bold text-[#787B86] uppercase tracking-wider mb-3">Password Requirements</p>
                  <div className="flex flex-col gap-2">
                    {passwordRules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${rule.test(formData.password) ? 'bg-[#26A69A]' : 'bg-[#2B2B43]'}`}>
                          {rule.test(formData.password) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                        <span className={`text-xs transition-colors ${rule.test(formData.password) ? 'text-[#26A69A]' : 'text-[#787B86]'}`}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Strength Bar */}
                  <div className="mt-3 pt-3 border-t border-[#2B2B43]">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${passwordRules.filter(r => r.test(formData.password)).length >= i ? (i <= 2 ? 'bg-[#EF5350]' : i <= 4 ? 'bg-[#E2B714]' : 'bg-[#26A69A]') : 'bg-[#2B2B43]'}`}/>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#787B86] mt-1">
                      {passwordRules.filter(r => r.test(formData.password)).length <= 2 ? 'Weak' : passwordRules.filter(r => r.test(formData.password)).length <= 4 ? 'Moderate' : 'Strong'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#787B86] uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`bg-[#1E222D] border rounded-xl px-4 py-3 pr-12 text-white outline-none transition-colors w-full placeholder-[#4A4E5A] ${formData.confirmPassword && formData.confirmPassword !== formData.password ? 'border-[#EF5350]' : formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-[#26A69A]' : 'border-[#2B2B43] focus:border-[#2962FF]'}`}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787B86] hover:text-white transition-colors p-1"
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-[#EF5350]/10 border border-[#EF5350]/40 rounded-xl px-4 py-3 text-[#EF5350] text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#2962FF] to-blue-500 hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(41,98,255,0.35)] mt-2 disabled:opacity-60"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#4A4E5A] mt-6">
            By continuing, you agree to our trading discipline terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}

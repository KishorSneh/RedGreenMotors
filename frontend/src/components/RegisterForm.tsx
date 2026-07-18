import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await authApi.register({ name, email, password });
      if (res.error) setError(res.error);
      else if (res.user) {
        const loginRes = await authApi.login({ email, password });
        if (loginRes.token && loginRes.user) { register(loginRes.token, loginRes.user); login(loginRes.token, loginRes.user); navigate('/'); }
        else navigate('/login');
      }
    } catch (err: any) { setError(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg animate-fade-in">{error}</p>}
      <div>
        <label htmlFor="register-name" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
        <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} required />
      </div>
      <div>
        <label htmlFor="register-email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Email</label>
        <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className={inputClass} required />
      </div>
      <div>
        <label htmlFor="register-password" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Password</label>
        <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 hover:bg-white transition-colors duration-200 active:scale-[0.97] transform disabled:opacity-50">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};

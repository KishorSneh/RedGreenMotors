import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="animate-slide-down sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center transition-transform duration-300 group-hover:rotate-6">
            <span className="font-black text-xs text-zinc-950 tracking-tighter">RG</span>
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="text-zinc-100">RedGreen</span>
            <span className="text-zinc-500">Motors</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive('/') ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Showroom
          </Link>

          {user ? (
            <div className="flex items-center gap-2 ml-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800">
                <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300 uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-zinc-300 hidden sm:inline">{user.name}</span>
                {user.role === 'ADMIN' && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-3">
              <Link
                to="/login"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/login') ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-md text-sm font-semibold bg-green-500 text-zinc-950 hover:bg-green-400 transition-colors duration-200 active:scale-95 transform"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

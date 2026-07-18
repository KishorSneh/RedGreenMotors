import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your RedGreenMotors account</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-zinc-300 hover:text-white transition-colors">Register</Link>
        </p>
      </div>
    </div>
  );
};

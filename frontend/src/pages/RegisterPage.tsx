import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-sm text-zinc-500 mt-1">Join RedGreenMotors to browse and purchase</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6">
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-zinc-300 hover:text-white transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

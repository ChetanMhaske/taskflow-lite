import React from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30">
      <main className="w-full flex justify-center">
        <LoginForm onSuccess={onLoginSuccess} />
      </main>

      <footer className="mt-8 text-center text-xs text-slate-400">
        TaskFlow Lite &bull; Leaplooms Technologies Internship Week 1
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ShieldCheck } from 'lucide-react';

export default function WelcomePage() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 text-center">

        {/* Shield Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
          <ShieldCheck className="w-8 h-8" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          You are signed in to TaskFlow Lite.
        </p>

        {/* User Info Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Name</p>
              <p className="text-sm font-semibold text-slate-800">{user?.name || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Email</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          id="logout-button"
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 transition disabled:opacity-50 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400">
        TaskFlow Lite &bull; Protected Area
      </footer>
    </div>
  );
}

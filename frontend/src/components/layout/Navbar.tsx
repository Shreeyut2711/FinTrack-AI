import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Globe
} from 'lucide-react';

interface NavbarProps {
  onOpenAIChat: () => void;
  onOpenVoiceCFO: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIChat, onOpenVoiceCFO, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Budget Warning', msg: 'Food & Dining is at 88% of your monthly limit.', time: '10m ago', unread: true },
    { id: 2, title: 'Subscription Due', msg: 'Netflix Premium ₹649 due in 3 days.', time: '2h ago', unread: true },
    { id: 3, title: 'Goal Milestone', msg: 'MacBook Pro goal surpassed 50% target!', time: '1d ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 glass-panel px-4 sm:px-6 flex items-center justify-between">
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            F
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent hidden sm:inline">
            FinTrack <span className="text-emerald-400">AI</span>
          </span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Voice CFO Quick Launcher */}
        <button
          onClick={onOpenVoiceCFO}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 text-xs font-semibold transition shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span>Voice CFO</span>
        </button>

        {/* AI Assistant Quick Launcher */}
        <button
          onClick={onOpenAIChat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs sm:text-sm font-medium transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-emerald-400" />
          <span className="hidden sm:inline">Ask AI CFO</span>
        </button>

        {/* Currency Selector */}
        <div className="relative flex items-center bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-300">
          <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-200 font-medium cursor-pointer"
          >
            <option value="INR" className="bg-slate-900 text-white">INR (₹)</option>
            <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
            <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
            <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
            <option value="JPY" className="bg-slate-900 text-white">JPY (¥)</option>
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl glass-panel shadow-2xl border border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-semibold text-xs text-slate-200">Notifications</span>
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="space-y-2">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition text-xs">
                    <div className="flex items-center justify-between font-medium text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-xs text-white border border-slate-500">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel shadow-2xl border border-slate-800 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <div className="font-semibold text-xs text-white">{user?.name || 'User'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || 'demo@fintrack.ai'}</div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

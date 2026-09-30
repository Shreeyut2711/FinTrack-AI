import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  ShieldAlert,
  Repeat,
  Scale,
  TrendingUp,
  FileText,
  Settings,
  Sparkles,
  Cpu,
  Calendar,
  FileSearch,
  Compass,
  ShieldCheck,
  Users,
  Flag,
  BookOpen,
  Brain
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAIChat }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/digital-twin', label: 'Digital Twin', icon: Cpu, badge: 'AI Sim' },
    { to: '/calendar', label: 'Cash Flow Calendar', icon: Calendar },
    { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/goals', label: 'Savings Goals', icon: Target },
    { to: '/emergency-fund', label: 'Emergency Fund', icon: ShieldAlert, badge: 'Crucial' },
    { to: '/documents', label: 'Document OCR', icon: FileSearch },
    { to: '/life-planner', label: 'Life Planner', icon: Compass },
    { to: '/security', label: 'Security & Fraud', icon: ShieldCheck },
    { to: '/shared-finance', label: 'Shared Finance', icon: Users },
    { to: '/timeline', label: 'Life Timeline', icon: Flag },
    { to: '/subscriptions', label: 'Subscriptions', icon: Repeat },
    { to: '/net-worth', label: 'Net Worth', icon: Scale },
    { to: '/investments', label: 'Investments', icon: TrendingUp },
    { to: '/education', label: 'AI Education', icon: BookOpen },
    { to: '/memory', label: 'AI Memory', icon: Brain },
    { to: '/reports', label: 'Financial Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-800/80 glass-panel flex flex-col justify-between p-3.5 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            AI CFO Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* AI Assistant Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 relative overflow-hidden shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">FinTrack AI CFO</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-2">
            Ask questions about spending, digital twin simulations, or emergency fund coverage.
          </p>
          <button
            onClick={onOpenAIChat}
            className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
          >
            Launch Assistant
          </button>
        </div>
      </aside>
    </>
  );
};

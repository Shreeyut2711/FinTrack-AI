import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Flag, CheckCircle, Clock } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { formatCurrency } = useCurrency();

  const milestones = [
    { title: 'Emergency Fund 6-Month Completion', date: '2026-12-15', status: 'projected', desc: 'Targeting ₹1,50,000 balance' },
    { title: 'MacBook Pro Goal Achieved', date: '2026-12-31', status: 'projected', desc: 'Targeting ₹2,00,000 savings' },
    { title: 'EV SUV Vehicle Purchase', date: '2027-02-15', status: 'projected', desc: 'Targeting ₹4,00,000 down payment' },
    { title: 'Master Degree Tuition Initial Deposit', date: '2027-08-01', status: 'projected', desc: 'Targeting ₹15,00,000 milestone' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Financial Life Timeline
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Chronological horizon combining goals, emergency targets & Life Planner milestones
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="relative border-l-2 border-slate-800 pl-6 space-y-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950" />
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{new Date(m.date).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
                <h3 className="font-bold text-sm text-white mt-0.5">{m.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

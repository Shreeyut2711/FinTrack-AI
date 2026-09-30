import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Calendar as CalendarIcon, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';

export const CashFlowCalendarPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [events, setEvents] = useState<any[]>([
    { _id: 'e_1', title: 'Monthly Salary Credit', amount: 85000, type: 'income', dueDate: '2026-10-01', status: 'pending', category: 'Income' },
    { _id: 'e_2', title: 'House Rent Payment', amount: 22000, type: 'bill', dueDate: '2026-10-02', status: 'pending', category: 'Housing' },
    { _id: 'e_3', title: 'Netflix Subscription', amount: 649, type: 'subscription', dueDate: '2026-10-05', status: 'pending', category: 'Entertainment' },
    { _id: 'e_4', title: 'SIP Mutual Fund Auto-Debit', amount: 10000, type: 'savings_transfer', dueDate: '2026-10-10', status: 'pending', category: 'Investments' }
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/calendar');
      if (res.data.success && res.data.events.length > 0) {
        setEvents(res.data.events);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Cash Flow Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Agenda & monthly schedule of expected income, upcoming bills, subscriptions & EMI due dates
          </p>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Upcoming Obligations (Next 30 Days)</h3>
        <div className="space-y-2">
          {events.map((evt) => (
            <div key={evt._id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${evt.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {evt.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{evt.title}</div>
                  <div className="text-[10px] text-slate-500">Due: {new Date(evt.dueDate).toLocaleDateString()} • {evt.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-extrabold text-sm ${evt.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {evt.type === 'income' ? '+' : '-'}{formatCurrency(evt.amount)}
                </div>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Scheduled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

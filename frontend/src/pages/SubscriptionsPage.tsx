import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { SubscriptionItem } from '../types';
import { Repeat, Plus, Calendar, AlertCircle } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([
    { _id: 's_1', merchant: 'Netflix 4K', amount: 649, billingCycle: 'monthly', nextBillingDate: '2026-10-05', category: 'Entertainment', status: 'active' },
    { _id: 's_2', merchant: 'Spotify Duo', amount: 149, billingCycle: 'monthly', nextBillingDate: '2026-10-12', category: 'Entertainment', status: 'active' },
    { _id: 's_3', merchant: 'Amazon Prime Yearly', amount: 1499, billingCycle: 'yearly', nextBillingDate: '2027-02-18', category: 'Shopping', status: 'active' },
    { _id: 's_4', merchant: 'ChatGPT Plus', amount: 1999, billingCycle: 'monthly', nextBillingDate: '2026-10-01', category: 'Software', status: 'active' }
  ]);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(2921);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      if (res.data.success && res.data.subscriptions.length > 0) {
        setSubscriptions(res.data.subscriptions);
        setTotalMonthlyCost(res.data.totalMonthlyCost);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Subscription & Recurring Payments Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor recurring bills, active streaming services & software licenses
          </p>
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400">Total Monthly Commitment</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(totalMonthlyCost)}<span className="text-xs text-slate-400 font-normal">/month</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Repeat className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((s) => (
          <div key={s._id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-white">{s.merchant}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {s.category} • {s.billingCycle}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Next bill: {new Date(s.nextBillingDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-sm text-white">{formatCurrency(s.amount)}</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

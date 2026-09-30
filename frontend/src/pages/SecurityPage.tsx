import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { ShieldCheck, AlertTriangle, CheckCircle, EyeOff } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [alerts, setAlerts] = useState<any[]>([
    {
      _id: 'sa_1',
      type: 'duplicate_charge',
      title: 'Potential Duplicate Charge Flagged',
      description: 'Two identical charges of ₹345 at Swiggy recorded within 3 minutes.',
      transactionAmount: 345,
      merchant: 'Swiggy',
      severity: 'high',
      status: 'active'
    },
    {
      _id: 'sa_2',
      type: 'price_increase',
      title: 'Subscription Price Spike Detected',
      description: 'Netflix subscription billed at ₹649 (+15% higher than previous 3-month baseline of ₹549).',
      transactionAmount: 649,
      merchant: 'Netflix',
      severity: 'medium',
      status: 'active'
    }
  ]);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Financial Security & Anomaly Detection
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time analysis of authorized records for duplicate charges, price spikes & transaction anomalies
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a._id} className="glass-panel p-4 rounded-2xl border border-amber-500/30 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">{a.title}</div>
                <p className="text-xs text-slate-300 mt-0.5">{a.description}</p>
                {a.transactionAmount && (
                  <div className="text-xs font-semibold text-amber-400 mt-1">
                    Flagged Amount: {formatCurrency(a.transactionAmount)} ({a.merchant})
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDismiss(a._id)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
            >
              Acknowledge
            </button>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-sm">No Security Anomalies Detected</h3>
            <p className="text-xs text-slate-400">All recent charges and recurring subscription amounts match historical baselines.</p>
          </div>
        )}
      </div>
    </div>
  );
};

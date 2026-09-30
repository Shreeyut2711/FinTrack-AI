import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { AssetLiabilityItem } from '../types';
import { Scale, Plus, ShieldCheck } from 'lucide-react';

export const NetWorthPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [summary, setSummary] = useState({
    totalAssets: 370000,
    totalLiabilities: 132500,
    netWorth: 237500,
    debtToIncomeRatio: 35.8,
    items: [
      { _id: '1', type: 'asset', name: 'Savings Account', category: 'Cash & Bank', value: 85000 },
      { _id: '2', type: 'asset', name: 'Fixed Deposit', category: 'Savings', value: 100000 },
      { _id: '3', type: 'asset', name: 'Mutual Funds', category: 'Investments', value: 185000 },
      { _id: '4', type: 'liability', name: 'Credit Card Bill', category: 'Debt', value: 12500 },
      { _id: '5', type: 'liability', name: 'Car Loan Balance', category: 'Debt', value: 120000 }
    ]
  });

  useEffect(() => {
    fetchNetWorth();
  }, []);

  const fetchNetWorth = async () => {
    try {
      const res = await api.get('/net-worth');
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial Health & Net Worth Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Calculated Net Worth = Total Assets - Total Liabilities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Net Worth</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(summary.netWorth)}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Assets</span>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(summary.totalAssets)}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Liabilities (Debt)</span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {formatCurrency(summary.totalLiabilities)}
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Assets & Liabilities Ledger</h3>
        <div className="space-y-2">
          {summary.items.map((item: any) => (
            <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.type === 'asset' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className="text-[10px] text-slate-500">({item.category})</span>
              </div>
              <span className={`font-extrabold ${item.type === 'asset' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.type === 'asset' ? '+' : '-'}{formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

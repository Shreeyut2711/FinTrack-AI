import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { User, Settings, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { currency, setCurrency } = useCurrency();

  const [name, setName] = useState(user?.name || '');
  const [essentialExpense, setEssentialExpense] = useState(user?.essentialMonthlyExpense || 25000);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/settings', {
        name,
        currency,
        essentialMonthlyExpense: Number(essentialExpense)
      });
      updateUser({ name, currency, essentialMonthlyExpense: Number(essentialExpense) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      updateUser({ name, currency, essentialMonthlyExpense: Number(essentialExpense) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          User Preferences & Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage currency formatting, essential expense baselines & profile details
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-xl">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Preferred Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
              <option value="JPY">JPY (¥) — Japanese Yen</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Monthly Essential Expense Baseline</label>
            <input
              type="number"
              value={essentialExpense}
              onChange={(e) => setEssentialExpense(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved!' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

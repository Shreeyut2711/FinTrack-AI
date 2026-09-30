import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Budget } from '../types';
import { PieChart, Plus, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 'b_1', category: 'Food & Dining', budgetAmount: 12000, spentAmount: 6800, remainingAmount: 5200, percentage: 56, alertStatus: 'normal' },
    { id: 'b_2', category: 'Transportation', budgetAmount: 5000, spentAmount: 4600, remainingAmount: 400, percentage: 92, alertStatus: 'critical' },
    { id: 'b_3', category: 'Shopping', budgetAmount: 8000, spentAmount: 8400, remainingAmount: 0, percentage: 105, alertStatus: 'exceeded' },
    { id: 'b_4', category: 'Entertainment', budgetAmount: 4000, spentAmount: 1800, remainingAmount: 2200, percentage: 45, alertStatus: 'normal' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('Housing & Utilities');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      if (res.data.success && res.data.budgets.length > 0) {
        setBudgets(res.data.budgets);
      }
    } catch (err) {}
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (!amt) return;

    try {
      await api.post('/budgets', { category: newCategory, amount: amt });
      fetchBudgets();
    } catch (err) {
      setBudgets((prev) => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          category: newCategory,
          budgetAmount: amt,
          spentAmount: 0,
          remainingAmount: amt,
          percentage: 0,
          alertStatus: 'normal'
        }
      ]);
    } finally {
      setIsModalOpen(false);
      setNewAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Monthly Budget Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track spent vs cap with active alerts at 70%, 90% and 100% utilization
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => (
          <div key={b.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{b.category}</span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  b.alertStatus === 'exceeded'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : b.alertStatus === 'critical'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : b.alertStatus === 'warning'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {b.percentage}% Spent
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    b.percentage >= 100
                      ? 'bg-rose-500'
                      : b.percentage >= 90
                      ? 'bg-amber-500'
                      : b.percentage >= 70
                      ? 'bg-yellow-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, b.percentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Spent: {formatCurrency(b.spentAmount)}</span>
                <span className="font-bold text-slate-200">Cap: {formatCurrency(b.budgetAmount)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
              <span>Remaining Surplus:</span>
              <span className={`font-bold ${b.remainingAmount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(b.remainingAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Set Category Budget</h3>
            <form onSubmit={handleAddBudget} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="Housing & Utilities">Housing & Utilities</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Monthly Budget Cap</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

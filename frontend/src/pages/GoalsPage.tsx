import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { SavingsGoal } from '../types';
import { Target, Plus, Calendar, TrendingUp } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: 'g_1',
      title: 'MacBook Pro M4',
      targetAmount: 200000,
      currentAmount: 110000,
      deadline: '2026-12-31',
      description: 'Work & ML laptop upgrade',
      category: 'Electronics',
      remainingAmount: 90000,
      progressPercentage: 55,
      suggestedMonthlyContribution: 22500,
      history: []
    },
    {
      id: 'g_2',
      title: 'Japan Vacation Fund',
      targetAmount: 150000,
      currentAmount: 45000,
      deadline: '2027-04-15',
      description: 'Spring cherry blossom vacation',
      category: 'Travel',
      remainingAmount: 105000,
      progressPercentage: 30,
      suggestedMonthlyContribution: 15000,
      history: []
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      if (res.data.success && res.data.goals.length > 0) {
        setGoals(res.data.goals);
      }
    } catch (err) {}
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmt = parseFloat(newTarget);
    if (!newTitle || !targetAmt || !newDeadline) return;

    try {
      await api.post('/goals', { title: newTitle, targetAmount: targetAmt, deadline: newDeadline });
      fetchGoals();
    } catch (err) {
      setGoals((prev) => [
        ...prev,
        {
          id: `g_${Date.now()}`,
          title: newTitle,
          targetAmount: targetAmt,
          currentAmount: 0,
          deadline: newDeadline,
          remainingAmount: targetAmt,
          progressPercentage: 0,
          suggestedMonthlyContribution: Math.round(targetAmt / 6),
          history: []
        }
      ]);
    } finally {
      setIsModalOpen(false);
      setNewTitle('');
      setNewTarget('');
      setNewDeadline('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Savings Goals Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual goal tracking with calculated monthly contribution recommendations
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <div key={g.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{g.title}</h3>
                {g.description && <p className="text-[11px] text-slate-400">{g.description}</p>}
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {g.progressPercentage}% Target
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, g.progressPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Saved: {formatCurrency(g.currentAmount)}</span>
                <span className="font-bold text-slate-200">Target: {formatCurrency(g.targetAmount)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Suggested Monthly Contribution:</span>
              <span className="font-extrabold text-emerald-400">{formatCurrency(g.suggestedMonthlyContribution)}/mo</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">New Savings Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. New Laptop, Vacation"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Amount</label>
                <input
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="150000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Deadline</label>
                <input
                  type="date"
                  required
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

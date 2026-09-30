import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Transaction } from '../types';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Mic,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight
} from 'lucide-react';
import { VoiceInputModal } from '../components/ai/VoiceInputModal';
import { ReceiptScannerModal } from '../components/ai/ReceiptScannerModal';

export const TransactionsPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'UPI',
    description: '',
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    fetchTransactions();
  }, [categoryFilter, typeFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions', {
        params: {
          category: categoryFilter || undefined,
          type: typeFilter || undefined,
          search: search || undefined
        }
      });
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.log('Using local fallback demo transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (txToAdd: any) => {
    try {
      const res = await api.post('/transactions', txToAdd);
      if (res.data.success) {
        fetchTransactions();
      }
    } catch (err) {
      // Local addition
      setTransactions((prev) => [{ _id: `tx_${Date.now()}`, ...txToAdd }, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    } catch (err) {
      setTransactions((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    }
  };

  const filtered = transactions.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track income, expenses & transfers with smart AI entry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Command Button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition"
          >
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>Voice Entry</span>
          </button>

          {/* Receipt Scanner Button */}
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>OCR Receipt</span>
          </button>

          {/* Manual Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction description or merchant..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none"
          >
            <option value="">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
            <option value="transfer">Transfers Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none"
          >
            <option value="">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Housing & Utilities">Housing & Utilities</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((t) => (
                <tr key={t._id || t.id} className="hover:bg-slate-900/50 transition">
                  <td className="px-4 py-3.5 font-semibold text-slate-200 flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        t.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : t.type === 'transfer'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {t.type === 'income' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : t.type === 'transfer' ? (
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="text-slate-100 font-semibold">{t.name}</div>
                      {t.description && <div className="text-[10px] text-slate-400">{t.description}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">{t.paymentMethod || 'UPI'}</td>
                  <td className="px-4 py-3.5 text-slate-400">
                    {new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-extrabold text-sm ${
                      t.type === 'income' ? 'text-emerald-400' : t.type === 'transfer' ? 'text-indigo-400' : 'text-slate-100'
                    }`}
                  >
                    {t.type === 'income' ? '+' : t.type === 'transfer' ? '' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => handleDelete(t._id || t.id!)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Add Financial Record</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTransaction({
                  name: newTx.name,
                  amount: parseFloat(newTx.amount),
                  type: newTx.type,
                  category: newTx.category,
                  paymentMethod: newTx.paymentMethod,
                  date: newTx.date,
                  description: newTx.description
                });
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Title / Merchant</label>
                <input
                  type="text"
                  required
                  value={newTx.name}
                  onChange={(e) => setNewTx({ ...newTx, name: e.target.value })}
                  placeholder="e.g. Swiggy Order, Monthly Salary"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Housing & Utilities">Housing & Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Income & Earnings">Income & Earnings</option>
                  <option value="Investments">Investments</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Voice & Receipt Modals */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
      <ReceiptScannerModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

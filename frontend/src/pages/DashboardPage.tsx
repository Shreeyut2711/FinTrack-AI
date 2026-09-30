import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer as ResponsiveContainerRaw,
  AreaChart as AreaChartRaw,
  Area as AreaRaw,
  XAxis as XAxisRaw,
  YAxis as YAxisRaw,
  Tooltip as TooltipRaw,
  PieChart as PieChartRaw,
  Pie as PieRaw,
  Cell as CellRaw,
  CartesianGrid as CartesianGridRaw
} from 'recharts';

const ResponsiveContainer = ResponsiveContainerRaw as any;
const AreaChart = AreaChartRaw as any;
const Area = AreaRaw as any;
const XAxis = XAxisRaw as any;
const YAxis = YAxisRaw as any;
const Tooltip = TooltipRaw as any;
const PieChart = PieChartRaw as any;
const Pie = PieRaw as any;
const Cell = CellRaw as any;
const CartesianGrid = CartesianGridRaw as any;


export const DashboardPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [periodFilter, setPeriodFilter] = useState('this_month');
  const [summary, setSummary] = useState({
    totalIncome: 85000,
    totalExpenses: 34200,
    currentBalance: 50800,
    netSavings: 50800,
    savingsRate: 59.8,
    recentTransactions: [],
    categoryBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [periodFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/dashboard-summary');
      if (res.data.success) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.log('Using initial summary defaults');
    } finally {
      setLoading(false);
    }
  };

  const trendData = [
    { day: 'Sep 1', income: 85000, expense: 5000 },
    { day: 'Sep 5', income: 85000, expense: 12000 },
    { day: 'Sep 10', income: 85000, expense: 18500 },
    { day: 'Sep 15', income: 85000, expense: 22000 },
    { day: 'Sep 20', income: 85000, expense: 28400 },
    { day: 'Sep 25', income: 85000, expense: 34200 }
  ];

  const pieData = summary.categoryBreakdown.length > 0 ? summary.categoryBreakdown : [
    { name: 'Housing & Utilities', value: 22000 },
    { name: 'Food & Dining', value: 6800 },
    { name: 'Transportation', value: 2400 },
    { name: 'Entertainment', value: 1800 },
    { name: 'Shopping', value: 1200 }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header & Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time overview of your income, expenses, budgets & savings rate
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl text-xs overflow-x-auto">
          {[
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: '3_months', label: '3 Months' },
            { id: 'this_year', label: 'This Year' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriodFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                periodFilter === item.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Income</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(summary.totalIncome)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last period</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-rose-500/30 transition relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Expenses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-medium">
            <span>40.2% of income spent</span>
          </div>
        </div>

        {/* Current Balance */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-teal-500/30 transition relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Current Balance</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(summary.currentBalance)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-teal-400 mt-2 font-medium">
            <span>Net cash surplus available</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Savings Rate</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {summary.savingsRate}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <span>Exceeds 20% benchmark</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Cash Flow Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Cash Flow Trend</h3>
              <p className="text-[11px] text-slate-400">Cumulative income vs expense growth</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#expenseGrad)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Category Breakdown</h3>
              <p className="text-[11px] text-slate-400">Expenses by category</p>
            </div>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {pieData.slice(0, 3).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-200">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

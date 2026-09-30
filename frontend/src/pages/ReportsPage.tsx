import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { FileText, Download, Sparkles } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { formatCurrency } = useCurrency();

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Merchant,Category,Amount,Type\n2026-09-28,Swiggy,Food & Dining,345,Expense\n2026-09-25,Monthly Salary,Income & Earnings,85000,Income";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinTrack_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Financial Reports & Exports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export authenticated transaction ledgers & summary analysis reports
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Monthly Statement Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Income</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(85000)}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Expenses</span>
            <div className="text-lg font-bold text-rose-400 mt-1">{formatCurrency(34200)}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Net Surplus</span>
            <div className="text-lg font-bold text-white mt-1">{formatCurrency(50800)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

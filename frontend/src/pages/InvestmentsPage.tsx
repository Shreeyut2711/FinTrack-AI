import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { TrendingUp, Calculator } from 'lucide-react';

export const InvestmentsPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [sipResult, setSipResult] = useState({
    investedAmount: 600000,
    estimatedReturns: 561695,
    totalValue: 1161695
  });

  const handleCalculateSIP = async () => {
    try {
      const res = await api.post('/investments/sip-calculator', {
        monthlyInvestment: sipMonthly,
        expectedReturnRate: sipRate,
        durationYears: sipYears
      });
      if (res.data.success) {
        setSipResult(res.data.result);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Investment Portfolio & SIP Calculators
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track manual investments and calculate future wealth growth projections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Summary Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white">Manual Portfolio Overview</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Invested:</span>
              <div className="font-extrabold text-white text-base mt-1">{formatCurrency(205000)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Current Valuation:</span>
              <div className="font-extrabold text-emerald-400 text-base mt-1">{formatCurrency(244500)}</div>
            </div>
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Overall Capital Appreciation:</span>
            <span>+19.27% ({formatCurrency(39500)})</span>
          </div>
        </div>

        {/* Interactive SIP Calculator */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">SIP Return Calculator</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Investment:</span>
                <span className="font-bold text-white">{formatCurrency(sipMonthly)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Expected Return Rate (% p.a):</span>
                <span className="font-bold text-white">{sipRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={sipRate}
                onChange={(e) => setSipRate(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Duration (Years):</span>
                <span className="font-bold text-white">{sipYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <button
              onClick={handleCalculateSIP}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Calculate Projection
            </button>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Invested</span>
                <span className="font-bold text-white mt-0.5 block">{formatCurrency(sipResult.investedAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Est. Returns</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{formatCurrency(sipResult.estimatedReturns)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Total Value</span>
                <span className="font-black text-white mt-0.5 block">{formatCurrency(sipResult.totalValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

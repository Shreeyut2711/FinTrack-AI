import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { EmergencyFundDetails, EmergencyTransaction } from '../types';
import {
  ShieldAlert,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const EmergencyFundPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [fundDetails, setFundDetails] = useState<EmergencyFundDetails>({
    targetAmount: 150000,
    currentBalance: 45000,
    coverageMonthsTarget: 6,
    essentialMonthlyExpense: 25000,
    calculatedCoverageMonths: 1.8,
    progressPercentage: 30,
    totalContributions: 45000,
    totalWithdrawals: 0
  });
  const [ledger, setLedger] = useState<EmergencyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  // Form inputs
  const [depositAmt, setDepositAmt] = useState('');
  const [depositDesc, setDepositDesc] = useState('');

  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [withdrawDesc, setWithdrawDesc] = useState('');
  const [withdrawalAnalysis, setWithdrawalAnalysis] = useState<any | null>(null);

  const [essentialExpenseInput, setEssentialExpenseInput] = useState('25000');
  const [targetMonthsInput, setTargetMonthsInput] = useState(6);

  useEffect(() => {
    fetchEmergencyFund();
  }, []);

  const fetchEmergencyFund = async () => {
    setLoading(true);
    try {
      const res = await api.get('/emergency-fund');
      if (res.data.success) {
        setFundDetails(res.data.emergencyFund);
        setLedger(res.data.ledger);
      }
    } catch (err) {
      console.log('Using local fallback emergency fund');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    const exp = parseFloat(essentialExpenseInput);
    if (!exp) return;

    try {
      await api.put('/emergency-fund/target', {
        essentialMonthlyExpense: exp,
        targetMonths: targetMonthsInput
      });
      fetchEmergencyFund();
    } catch (err) {
      const target = exp * targetMonthsInput;
      setFundDetails((prev) => ({
        ...prev,
        essentialMonthlyExpense: exp,
        coverageMonthsTarget: targetMonthsInput,
        targetAmount: target,
        calculatedCoverageMonths: parseFloat((prev.currentBalance / exp).toFixed(1)),
        progressPercentage: Math.min(100, parseFloat(((prev.currentBalance / target) * 100).toFixed(1)))
      }));
    } finally {
      setIsTargetModalOpen(false);
    }
  };

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmt);
    if (!amt) return;

    try {
      await api.post('/emergency-fund/contribution', {
        amount: amt,
        description: depositDesc || 'Emergency deposit'
      });
      fetchEmergencyFund();
    } catch (err) {
      const newBal = fundDetails.currentBalance + amt;
      setFundDetails((prev) => ({
        ...prev,
        currentBalance: newBal,
        calculatedCoverageMonths: parseFloat((newBal / prev.essentialMonthlyExpense).toFixed(1))
      }));
    } finally {
      setIsDepositModalOpen(false);
      setDepositAmt('');
      setDepositDesc('');
    }
  };

  // Pre-check Emergency Withdrawal Workflow
  const handleAnalyzeWithdrawal = async () => {
    const amt = parseFloat(withdrawAmt);
    if (!amt) return;

    try {
      const res = await api.post('/emergency-fund/withdrawal', {
        amount: amt,
        description: withdrawDesc,
        confirmed: false
      });
      if (res.data.success) {
        setWithdrawalAnalysis(res.data.withdrawalAnalysis);
      }
    } catch (err) {
      const rem = fundDetails.currentBalance - amt;
      const updatedCoverage = parseFloat((rem / fundDetails.essentialMonthlyExpense).toFixed(1));
      setWithdrawalAnalysis({
        currentBalance: fundDetails.currentBalance,
        requestedAmount: amt,
        remainingBalance: rem,
        updatedCoverageMonths: updatedCoverage,
        targetAmount: fundDetails.targetAmount,
        fallsBelowTarget: rem < fundDetails.targetAmount,
        warningMessage: rem < fundDetails.targetAmount
          ? `⚠️ Warning: This withdrawal of ${formatCurrency(amt)} will leave you with ${updatedCoverage} months of coverage (below your ${fundDetails.coverageMonthsTarget}-month target).`
          : `Notice: This withdrawal will leave you with ${updatedCoverage} months of coverage.`
      });
    }
  };

  const handleConfirmWithdrawal = async () => {
    const amt = parseFloat(withdrawAmt);
    if (!amt) return;

    try {
      await api.post('/emergency-fund/withdrawal', {
        amount: amt,
        description: withdrawDesc || 'Emergency withdrawal',
        confirmed: true
      });
      fetchEmergencyFund();
    } catch (err) {
      const rem = fundDetails.currentBalance - amt;
      setFundDetails((prev) => ({
        ...prev,
        currentBalance: rem,
        calculatedCoverageMonths: parseFloat((rem / prev.essentialMonthlyExpense).toFixed(1))
      }));
    } finally {
      setIsWithdrawModalOpen(false);
      setWithdrawalAnalysis(null);
      setWithdrawAmt('');
      setWithdrawDesc('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Emergency Fund Safety Net
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Independent Module
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated capital buffer strictly isolated from daily operational expenses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTargetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Recalculate Target</span>
          </button>

          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deposit</span>
          </button>

          <button
            onClick={() => {
              setIsWithdrawModalOpen(true);
              setWithdrawalAnalysis(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Withdrawal</span>
          </button>
        </div>
      </div>

      {/* Emergency Fund Dashboard Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Current Balance</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(fundDetails.currentBalance)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Target: {formatCurrency(fundDetails.targetAmount)}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Months of Coverage</span>
          <div className="text-2xl font-black text-white mt-1">
            {fundDetails.calculatedCoverageMonths} <span className="text-sm font-normal text-slate-400">Months</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Based on {formatCurrency(fundDetails.essentialMonthlyExpense)}/mo essential cost
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Target Completion</span>
          <div className="text-2xl font-black text-white mt-1">
            {fundDetails.progressPercentage}%
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${Math.min(100, fundDetails.progressPercentage)}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Safety Status</span>
          <div className="flex items-center gap-2 mt-1">
            {fundDetails.calculatedCoverageMonths >= fundDetails.coverageMonthsTarget ? (
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Fully Covered
              </span>
            ) : (
              <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Rebuild In Progress
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {fundDetails.coverageMonthsTarget}-Month Target Horizon
          </div>
        </div>
      </div>

      {/* Target Calculator & AI Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Fund Formula</h3>
              <p className="text-[11px] text-slate-400">Emergency Target = Monthly Essential Expenses × Coverage Months</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Formula Enforced
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Monthly Essential Costs:</span>
              <span className="text-sm font-extrabold text-white mt-1 block">
                {formatCurrency(fundDetails.essentialMonthlyExpense)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Selected Horizon:</span>
              <span className="text-sm font-extrabold text-white mt-1 block">
                {fundDetails.coverageMonthsTarget} Months
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Required Fund Goal:</span>
              <span className="text-sm font-extrabold text-emerald-400 mt-1 block">
                {formatCurrency(fundDetails.targetAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* AI Assistant Guidance Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">AI Safety Net Assessment</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your fund provides <strong className="text-emerald-400">{fundDetails.calculatedCoverageMonths} months</strong> of essential expense coverage against your {fundDetails.coverageMonthsTarget}-month goal.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Rebuild Strategy Recommendation:</div>
            <p>Automate an extra deposit of {formatCurrency(Math.round((fundDetails.targetAmount - fundDetails.currentBalance) / 6))} monthly for 6 months to reach 100% target completion.</p>
          </div>
        </div>
      </div>

      {/* Emergency Withdrawal Workflow Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Emergency Withdrawal Request</h3>
            </div>
            <p className="text-xs text-slate-400">
              Perform safety check before removing funds from your emergency buffer.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Requested Amount ({formatCurrency(fundDetails.currentBalance)} max)</label>
                <input
                  type="number"
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reason / Description</label>
                <input
                  type="text"
                  value={withdrawDesc}
                  onChange={(e) => setWithdrawDesc(e.target.value)}
                  placeholder="e.g. Medical bill, Urgent home repair"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAnalyzeWithdrawal}
                disabled={!withdrawAmt}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition"
              >
                Analyze Coverage Impact
              </button>

              {/* Pre-withdrawal Impact Display */}
              {withdrawalAnalysis && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Impact Analysis</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>Remaining Balance: <strong>{formatCurrency(withdrawalAnalysis.remainingBalance)}</strong></div>
                    <div>Updated Coverage: <strong>{withdrawalAnalysis.updatedCoverageMonths} Months</strong></div>
                  </div>
                  <p className="text-[11px] text-amber-300 mt-1">{withdrawalAnalysis.warningMessage}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={!withdrawAmt || !withdrawalAnalysis}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-rose-500/20"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

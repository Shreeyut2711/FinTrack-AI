import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import EmergencyFund from '../models/EmergencyFund';
import EmergencyTransaction from '../models/EmergencyTransaction';

const memoryFunds: Map<string, any> = new Map();
const memoryEmergencyTxs: Map<string, any[]> = new Map();

const getDefaultFund = (userId: string) => ({
  _id: `ef_${userId}`,
  userId,
  targetAmount: 150000,
  currentBalance: 45000,
  coverageMonths: 6,
  essentialMonthlyExpense: 25000,
  updatedAt: new Date()
});

const getDefaultTxs = (userId: string) => [
  {
    _id: `etx_1`,
    userId,
    amount: 15000,
    type: 'contribution',
    category: 'Monthly Savings',
    description: 'Initial seed deposit to build 6-month safety buffer',
    date: new Date('2026-08-15'),
    balanceAfter: 45000,
    monthsCoverageAfter: 1.8
  }
];

export const getEmergencyFundDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let fund: any = null;
    let ledger: any[] = [];

    try {
      fund = await EmergencyFund.findOne({ userId });
      ledger = await EmergencyTransaction.find({ userId }).sort({ date: -1 });
    } catch (dbErr) {}

    if (!fund) {
      if (!memoryFunds.has(userId)) {
        memoryFunds.set(userId, getDefaultFund(userId));
        memoryEmergencyTxs.set(userId, getDefaultTxs(userId));
      }
      fund = memoryFunds.get(userId);
      ledger = memoryEmergencyTxs.get(userId) || [];
    }

    const essentialExp = fund.essentialMonthlyExpense || 25000;
    const currentBal = fund.currentBalance || 0;
    const targetAmt = fund.targetAmount || 150000;
    const coverageMonths = essentialExp > 0 ? parseFloat((currentBal / essentialExp).toFixed(1)) : 0;
    const progressPct = targetAmt > 0 ? Math.min(100, parseFloat(((currentBal / targetAmt) * 100).toFixed(1))) : 0;

    return res.json({
      success: true,
      emergencyFund: {
        targetAmount: targetAmt,
        currentBalance: currentBal,
        coverageMonthsTarget: fund.coverageMonths || 6,
        essentialMonthlyExpense: essentialExp,
        calculatedCoverageMonths: coverageMonths,
        progressPercentage: progressPct,
        totalContributions: ledger.filter(t => t.type === 'contribution').reduce((acc, t) => acc + Number(t.amount), 0),
        totalWithdrawals: ledger.filter(t => t.type === 'withdrawal').reduce((acc, t) => acc + Number(t.amount), 0)
      },
      ledger
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateEmergencyTarget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { essentialMonthlyExpense, targetMonths } = req.body;

    if (!essentialMonthlyExpense || !targetMonths) {
      return res.status(400).json({ success: false, error: 'Essential monthly expense and target months are required' });
    }

    const targetAmount = Number(essentialMonthlyExpense) * Number(targetMonths);

    try {
      const updated = await EmergencyFund.findOneAndUpdate(
        { userId },
        {
          essentialMonthlyExpense: Number(essentialMonthlyExpense),
          coverageMonths: Number(targetMonths),
          targetAmount,
          updatedAt: new Date()
        },
        { new: true, upsert: true }
      );
      return res.json({ success: true, emergencyFund: updated });
    } catch (dbErr) {
      const fund = memoryFunds.get(userId) || getDefaultFund(userId);
      fund.essentialMonthlyExpense = Number(essentialMonthlyExpense);
      fund.coverageMonths = Number(targetMonths);
      fund.targetAmount = targetAmount;
      fund.updatedAt = new Date();
      memoryFunds.set(userId, fund);
      return res.json({ success: true, emergencyFund: fund });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addContribution = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { amount, description, category } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive contribution amount is required' });
    }

    const contribAmt = Number(amount);
    let fund: any = null;

    try {
      fund = await EmergencyFund.findOne({ userId });
    } catch (dbErr) {}

    if (!fund) {
      fund = memoryFunds.get(userId) || getDefaultFund(userId);
    }

    const newBalance = fund.currentBalance + contribAmt;
    const essentialExp = fund.essentialMonthlyExpense || 25000;
    const newCoverage = essentialExp > 0 ? parseFloat((newBalance / essentialExp).toFixed(1)) : 0;

    try {
      await EmergencyFund.findOneAndUpdate({ userId }, { currentBalance: newBalance, updatedAt: new Date() });
      const tx = await EmergencyTransaction.create({
        userId,
        amount: contribAmt,
        type: 'contribution',
        category: category || 'Savings Contribution',
        description: description || 'Contribution to Emergency Fund',
        date: new Date(),
        balanceAfter: newBalance,
        monthsCoverageAfter: newCoverage
      });
      return res.json({ success: true, transaction: tx, newBalance, newCoverage });
    } catch (dbErr) {
      fund.currentBalance = newBalance;
      memoryFunds.set(userId, fund);
      const tx = {
        _id: `etx_${Date.now()}`,
        userId,
        amount: contribAmt,
        type: 'contribution',
        category: category || 'Savings Contribution',
        description: description || 'Contribution to Emergency Fund',
        date: new Date(),
        balanceAfter: newBalance,
        monthsCoverageAfter: newCoverage
      };
      const ledger = memoryEmergencyTxs.get(userId) || [];
      ledger.unshift(tx);
      memoryEmergencyTxs.set(userId, ledger);
      return res.json({ success: true, transaction: tx, newBalance, newCoverage });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const emergencyWithdrawalWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { amount, description, category, confirmed } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive withdrawal amount is required' });
    }

    const withdrawAmt = Number(amount);
    let fund: any = null;

    try {
      fund = await EmergencyFund.findOne({ userId });
    } catch (dbErr) {}

    if (!fund) {
      fund = memoryFunds.get(userId) || getDefaultFund(userId);
    }

    const currentBalance = fund.currentBalance || 0;
    if (withdrawAmt > currentBalance) {
      return res.status(400).json({
        success: false,
        error: `Insufficient emergency fund balance. Requested: ₹${withdrawAmt}, Current Balance: ₹${currentBalance}`
      });
    }

    const remainingBalance = currentBalance - withdrawAmt;
    const essentialExp = fund.essentialMonthlyExpense || 25000;
    const updatedCoverageMonths = essentialExp > 0 ? parseFloat((remainingBalance / essentialExp).toFixed(1)) : 0;
    const fallsBelowTarget = remainingBalance < fund.targetAmount;

    // Simulation / Pre-check response if not yet confirmed by user
    if (!confirmed) {
      return res.json({
        success: true,
        requiresConfirmation: true,
        withdrawalAnalysis: {
          currentBalance,
          requestedAmount: withdrawAmt,
          remainingBalance,
          updatedCoverageMonths,
          targetAmount: fund.targetAmount,
          fallsBelowTarget,
          warningMessage: fallsBelowTarget
            ? `⚠️ Warning: This withdrawal of ₹${withdrawAmt.toLocaleString()} will reduce your fund coverage to ${updatedCoverageMonths} months (below your ${fund.coverageMonths}-month target).`
            : `Notice: This withdrawal will leave you with ${updatedCoverageMonths} months of essential coverage.`
        }
      });
    }

    // Execute actual confirmed withdrawal
    try {
      await EmergencyFund.findOneAndUpdate({ userId }, { currentBalance: remainingBalance, updatedAt: new Date() });
      const tx = await EmergencyTransaction.create({
        userId,
        amount: withdrawAmt,
        type: 'withdrawal',
        category: category || 'Emergency Expense',
        description: description || 'Emergency Fund Withdrawal',
        date: new Date(),
        balanceAfter: remainingBalance,
        monthsCoverageAfter: updatedCoverageMonths
      });
      return res.json({
        success: true,
        message: 'Emergency withdrawal processed successfully.',
        transaction: tx,
        newBalance: remainingBalance,
        updatedCoverageMonths
      });
    } catch (dbErr) {
      fund.currentBalance = remainingBalance;
      memoryFunds.set(userId, fund);
      const tx = {
        _id: `etx_${Date.now()}`,
        userId,
        amount: withdrawAmt,
        type: 'withdrawal',
        category: category || 'Emergency Expense',
        description: description || 'Emergency Fund Withdrawal',
        date: new Date(),
        balanceAfter: remainingBalance,
        monthsCoverageAfter: updatedCoverageMonths
      };
      const ledger = memoryEmergencyTxs.get(userId) || [];
      ledger.unshift(tx);
      memoryEmergencyTxs.set(userId, ledger);
      return res.json({
        success: true,
        message: 'Emergency withdrawal processed successfully.',
        transaction: tx,
        newBalance: remainingBalance,
        updatedCoverageMonths
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

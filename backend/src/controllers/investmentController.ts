import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Investment from '../models/Investment';

const memoryInvestments: Map<string, any[]> = new Map();

const getInitialDemoInvestments = (userId: string) => [
  { _id: 'inv_1', userId, name: 'Nifty 50 Index Fund', type: 'mutual_fund', investedAmount: 120000, currentValue: 148000, purchaseDate: new Date('2025-01-15') },
  { _id: 'inv_2', userId, name: 'TCS & Infosys Stocks', type: 'stocks', investedAmount: 55000, currentValue: 62000, purchaseDate: new Date('2025-03-10') },
  { _id: 'inv_3', userId, name: 'Digital Gold SIP', type: 'sip', investedAmount: 30000, currentValue: 34500, purchaseDate: new Date('2025-05-20') }
];

export const getInvestments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let list: any[] = [];

    try {
      list = await Investment.find({ userId });
    } catch (dbErr) {
      if (!memoryInvestments.has(userId)) {
        memoryInvestments.set(userId, getInitialDemoInvestments(userId));
      }
      list = memoryInvestments.get(userId) || [];
    }

    const totalInvested = list.reduce((acc, i) => acc + Number(i.investedAmount), 0);
    const totalCurrent = list.reduce((acc, i) => acc + Number(i.currentValue), 0);
    const totalGain = totalCurrent - totalInvested;
    const overallReturnPct = totalInvested > 0 ? parseFloat(((totalGain / totalInvested) * 100).toFixed(2)) : 0;

    return res.json({
      success: true,
      summary: {
        totalInvested,
        totalCurrent,
        totalGain,
        overallReturnPct,
        investments: list
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addInvestment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, type, investedAmount, currentValue, purchaseDate } = req.body;

    if (!name || !type || !investedAmount) {
      return res.status(400).json({ success: false, error: 'Name, type and invested amount are required' });
    }

    try {
      const inv = await Investment.create({
        userId,
        name,
        type,
        investedAmount: Number(investedAmount),
        currentValue: Number(currentValue || investedAmount),
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date()
      });
      return res.status(201).json({ success: true, investment: inv });
    } catch (dbErr) {
      const list = memoryInvestments.get(userId) || getInitialDemoInvestments(userId);
      const inv = {
        _id: `inv_${Date.now()}`,
        userId,
        name,
        type,
        investedAmount: Number(investedAmount),
        currentValue: Number(currentValue || investedAmount),
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date()
      };
      list.push(inv);
      memoryInvestments.set(userId, list);
      return res.status(201).json({ success: true, investment: inv });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const calculateSIP = (req: AuthRequest, res: Response) => {
  const { monthlyInvestment, expectedReturnRate, durationYears } = req.body;
  const P = Number(monthlyInvestment || 5000);
  const r = Number(expectedReturnRate || 12) / 12 / 100;
  const n = Number(durationYears || 10) * 12;

  // Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
  const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;
  const estimatedReturns = totalValue - invested;

  return res.json({
    success: true,
    result: {
      monthlyInvestment: P,
      investedAmount: Math.round(invested),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue)
    }
  });
};

export const calculateEMI = (req: AuthRequest, res: Response) => {
  const { loanAmount, interestRate, tenureYears } = req.body;
  const P = Number(loanAmount || 500000);
  const r = Number(interestRate || 10.5) / 12 / 100;
  const n = Number(tenureYears || 5) * 12;

  // Formula: E = P x r x (1+r)^n / ((1+r)^n - 1)
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  return res.json({
    success: true,
    result: {
      monthlyEMI: Math.round(emi),
      principalAmount: P,
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    }
  });
};

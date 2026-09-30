import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';

// Seed memory transactions for fallback demo mode
const memoryTransactions: Map<string, any[]> = new Map();

const getInitialDemoTransactions = (userId: string) => [
  { _id: 'tx_1', id: 'tx_1', userId, name: 'Swiggy Food', amount: 345, type: 'expense', category: 'Food & Dining', paymentMethod: 'UPI', date: new Date('2026-09-28'), description: 'Dinner order', isEssential: false, isRecurring: false },
  { _id: 'tx_2', id: 'tx_2', userId, name: 'Monthly Salary', amount: 85000, type: 'income', category: 'Income & Earnings', paymentMethod: 'Bank Transfer', date: new Date('2026-09-25'), description: 'Monthly Payroll', isEssential: false, isRecurring: true },
  { _id: 'tx_3', id: 'tx_3', userId, name: 'Uber Cab Ride', amount: 180, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: new Date('2026-09-27'), description: 'Office commute', isEssential: true, isRecurring: false },
  { _id: 'tx_4', id: 'tx_4', userId, name: 'House Rent', amount: 22000, type: 'expense', category: 'Housing & Utilities', paymentMethod: 'NetBanking', date: new Date('2026-09-02'), description: 'Apartment Rent', isEssential: true, isRecurring: true },
  { _id: 'tx_5', id: 'tx_5', userId, name: 'Amazon Tech Accessories', amount: 1450, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: new Date('2026-09-20'), description: 'Wireless Earbuds', isEssential: false, isRecurring: false },
  { _id: 'tx_6', id: 'tx_6', userId, name: 'SIP Mutual Fund Investment', amount: 10000, type: 'transfer', category: 'Investments', paymentMethod: 'Auto Debit', date: new Date('2026-09-10'), description: 'Monthly Index Fund SIP', isEssential: true, isRecurring: true }
];

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { category, type, search, startDate, endDate, limit = 50, page = 1 } = req.query;

    try {
      let query: any = { userId };
      if (category) query.category = category;
      if (type) query.type = type;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const txs = await Transaction.find(query).sort({ date: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
      const total = await Transaction.countDocuments(query);

      return res.json({
        success: true,
        transactions: txs,
        pagination: { total, page: Number(page), limit: Number(limit) }
      });
    } catch (dbErr) {
      // Memory store fallback
      if (!memoryTransactions.has(userId)) {
        memoryTransactions.set(userId, getInitialDemoTransactions(userId));
      }
      let list = memoryTransactions.get(userId) || [];
      if (category) list = list.filter(t => t.category === category);
      if (type) list = list.filter(t => t.type === type);
      if (search) {
        const s = (search as string).toLowerCase();
        list = list.filter(t => t.name.toLowerCase().includes(s) || (t.description && t.description.toLowerCase().includes(s)));
      }

      return res.json({
        success: true,
        transactions: list,
        pagination: { total: list.length, page: 1, limit: 50 }
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, amount, type, category, subcategory, paymentMethod, date, description, isEssential, isRecurring } = req.body;

    if (!name || amount === undefined || !type || !category) {
      return res.status(400).json({ success: false, error: 'Name, amount, type and category are required.' });
    }

    const txDate = date ? new Date(date) : new Date();

    try {
      const newTx = await Transaction.create({
        userId,
        name,
        amount: Number(amount),
        type,
        category,
        subcategory: subcategory || '',
        paymentMethod: paymentMethod || 'UPI',
        date: txDate,
        description: description || '',
        isEssential: Boolean(isEssential),
        isRecurring: Boolean(isRecurring)
      });
      return res.status(201).json({ success: true, transaction: newTx });
    } catch (dbErr) {
      // Memory fallback
      if (!memoryTransactions.has(userId)) {
        memoryTransactions.set(userId, getInitialDemoTransactions(userId));
      }
      const newTx = {
        _id: `tx_${Date.now()}`,
        id: `tx_${Date.now()}`,
        userId,
        name,
        amount: Number(amount),
        type,
        category,
        subcategory: subcategory || '',
        paymentMethod: paymentMethod || 'UPI',
        date: txDate,
        description: description || '',
        isEssential: Boolean(isEssential),
        isRecurring: Boolean(isRecurring)
      };
      const list = memoryTransactions.get(userId)!;
      list.unshift(newTx);
      memoryTransactions.set(userId, list);
      return res.status(201).json({ success: true, transaction: newTx });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    try {
      const deleted = await Transaction.findOneAndDelete({ _id: id, userId });
      if (deleted) {
        return res.json({ success: true, message: 'Transaction deleted' });
      }
    } catch (dbErr) {}

    if (memoryTransactions.has(userId)) {
      let list = memoryTransactions.get(userId)!;
      list = list.filter(t => t._id !== id && t.id !== id);
      memoryTransactions.set(userId, list);
      return res.json({ success: true, message: 'Transaction deleted' });
    }

    return res.status(404).json({ success: false, error: 'Transaction not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let txs: any[] = [];

    try {
      txs = await Transaction.find({ userId });
    } catch (dbErr) {
      if (!memoryTransactions.has(userId)) {
        memoryTransactions.set(userId, getInitialDemoTransactions(userId));
      }
      txs = memoryTransactions.get(userId) || [];
    }

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryMap: Record<string, number> = {};

    txs.forEach(t => {
      if (t.type === 'income') {
        totalIncome += Number(t.amount);
      } else if (t.type === 'expense') {
        const amt = Number(t.amount);
        totalExpenses += amt;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + amt;
      }
    });

    const currentBalance = totalIncome - totalExpenses;
    const netSavings = Math.max(0, currentBalance);
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

    const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat]
    }));

    return res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        currentBalance,
        netSavings,
        savingsRate: parseFloat(savingsRate),
        categoryBreakdown,
        recentTransactions: txs.slice(0, 10)
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';

const memoryBudgets: Map<string, any[]> = new Map();

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const monthYear = (req.query.monthYear as string) || new Date().toISOString().slice(0, 7);

    let budgets: any[] = [];
    try {
      budgets = await Budget.find({ userId, monthYear });
    } catch (dbErr) {
      budgets = memoryBudgets.get(userId) || [];
    }

    if (budgets.length === 0) {
      // Create initial demo budgets
      budgets = [
        { _id: 'b_1', userId, category: 'Food & Dining', amount: 12000, monthYear },
        { _id: 'b_2', userId, category: 'Transportation', amount: 5000, monthYear },
        { _id: 'b_3', userId, category: 'Shopping', amount: 8000, monthYear },
        { _id: 'b_4', userId, category: 'Entertainment', amount: 4000, monthYear }
      ];
    }

    // Calculate spent vs remaining based on actual database transactions
    let txs: any[] = [];
    try {
      txs = await Transaction.find({ userId, type: 'expense' });
    } catch (dbErr) {}

    const result = budgets.map(b => {
      const spent = txs
        .filter(t => t.category === b.category)
        .reduce((acc, t) => acc + Number(t.amount), 0);
      const remaining = Math.max(0, b.amount - spent);
      const percentage = Math.min(100, Math.round((spent / b.amount) * 100));

      let alertStatus = 'normal';
      if (percentage >= 100) alertStatus = 'exceeded';
      else if (percentage >= 90) alertStatus = 'critical';
      else if (percentage >= 70) alertStatus = 'warning';

      return {
        id: b._id,
        category: b.category,
        budgetAmount: b.amount,
        spentAmount: spent,
        remainingAmount: remaining,
        percentage,
        alertStatus
      };
    });

    return res.json({ success: true, budgets: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createOrUpdateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { category, amount, monthYear } = req.body;

    if (!category || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid category and positive budget amount are required' });
    }

    const my = monthYear || new Date().toISOString().slice(0, 7);

    try {
      const updated = await Budget.findOneAndUpdate(
        { userId, category, monthYear: my },
        { amount: Number(amount) },
        { upsert: true, new: true }
      );
      return res.json({ success: true, budget: updated });
    } catch (dbErr) {
      let list = memoryBudgets.get(userId) || [];
      const idx = list.findIndex(b => b.category === category);
      if (idx >= 0) {
        list[idx].amount = Number(amount);
      } else {
        list.push({ _id: `b_${Date.now()}`, userId, category, amount: Number(amount), monthYear: my });
      }
      memoryBudgets.set(userId, list);
      return res.json({ success: true, budget: { category, amount, monthYear: my } });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

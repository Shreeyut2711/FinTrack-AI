import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import SavingsGoal from '../models/SavingsGoal';

const memoryGoals: Map<string, any[]> = new Map();

const getInitialDemoGoals = (userId: string) => [
  {
    _id: 'g_1',
    userId,
    title: 'MacBook Pro M4',
    targetAmount: 200000,
    currentAmount: 110000,
    deadline: new Date('2026-12-31'),
    description: 'Work & Machine Learning laptop upgrade',
    category: 'Electronics',
    history: [
      { amount: 50000, type: 'contribution', date: new Date('2026-07-01'), note: 'Initial deposit' },
      { amount: 60000, type: 'contribution', date: new Date('2026-08-15'), note: 'Bonus contribution' }
    ]
  },
  {
    _id: 'g_2',
    userId,
    title: 'Japan Vacation Fund',
    targetAmount: 150000,
    currentAmount: 45000,
    deadline: new Date('2027-04-15'),
    description: 'Cherry blossom spring trip to Tokyo & Kyoto',
    category: 'Travel',
    history: [
      { amount: 45000, type: 'contribution', date: new Date('2026-09-01'), note: 'Travel savings' }
    ]
  }
];

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let goals: any[] = [];

    try {
      goals = await SavingsGoal.find({ userId, isArchived: false });
    } catch (dbErr) {
      if (!memoryGoals.has(userId)) {
        memoryGoals.set(userId, getInitialDemoGoals(userId));
      }
      goals = memoryGoals.get(userId) || [];
    }

    const enhanced = goals.map(g => {
      const remaining = Math.max(0, g.targetAmount - g.currentAmount);
      const progressPct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

      const now = new Date();
      const deadline = new Date(g.deadline);
      const monthsLeft = Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()));
      const suggestedMonthlyContribution = Math.round(remaining / monthsLeft);

      return {
        id: g._id,
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        deadline: g.deadline,
        description: g.description,
        category: g.category,
        remainingAmount: remaining,
        progressPercentage: progressPct,
        suggestedMonthlyContribution,
        history: g.history || []
      };
    });

    return res.json({ success: true, goals: enhanced });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, targetAmount, deadline, description, category } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ success: false, error: 'Title, target amount, and deadline are required' });
    }

    try {
      const newGoal = await SavingsGoal.create({
        userId,
        title,
        targetAmount: Number(targetAmount),
        currentAmount: 0,
        deadline: new Date(deadline),
        description: description || '',
        category: category || 'General',
        history: []
      });
      return res.status(201).json({ success: true, goal: newGoal });
    } catch (dbErr) {
      const list = memoryGoals.get(userId) || getInitialDemoGoals(userId);
      const newGoal = {
        _id: `g_${Date.now()}`,
        userId,
        title,
        targetAmount: Number(targetAmount),
        currentAmount: 0,
        deadline: new Date(deadline),
        description: description || '',
        category: category || 'General',
        history: []
      };
      list.push(newGoal);
      memoryGoals.set(userId, list);
      return res.status(201).json({ success: true, goal: newGoal });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addContributionToGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { amount, note } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive contribution amount required' });
    }

    const contribAmt = Number(amount);

    try {
      const goal = await SavingsGoal.findOne({ _id: id, userId });
      if (goal) {
        goal.currentAmount += contribAmt;
        goal.history.push({
          amount: contribAmt,
          type: 'contribution',
          date: new Date(),
          note: note || 'Goal contribution'
        });
        await goal.save();
        return res.json({ success: true, goal });
      }
    } catch (dbErr) {}

    if (memoryGoals.has(userId)) {
      const list = memoryGoals.get(userId)!;
      const g = list.find(x => x._id === id || x.id === id);
      if (g) {
        g.currentAmount += contribAmt;
        g.history.push({ amount: contribAmt, type: 'contribution', date: new Date(), note: note || 'Goal contribution' });
        return res.json({ success: true, goal: g });
      }
    }

    return res.status(404).json({ success: false, error: 'Goal not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

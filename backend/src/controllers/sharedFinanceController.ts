import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import SharedHousehold from '../models/SharedHousehold';

const memoryHouseholds: Map<string, any> = new Map();

const getInitialDemoHousehold = (userId: string) => ({
  _id: 'hh_1',
  name: 'Family & Apartment Group',
  members: [
    { userId, name: 'You (Primary)', role: 'admin' },
    { userId: 'user_2', name: 'Sam (Roommate)', role: 'member' }
  ],
  sharedBudgets: [
    { category: 'Groceries & Household', amount: 15000 },
    { category: 'Electricity & Wifi', amount: 4500 }
  ],
  expenses: [
    { _id: 'se_1', title: 'Weekly Supermarket Grocery', amount: 3200, paidByUserId: userId, paidByName: 'You', splitBetween: [userId, 'user_2'], date: new Date('2026-09-26') },
    { _id: 'se_2', title: 'High-Speed Broadband Bill', amount: 1200, paidByUserId: 'user_2', paidByName: 'Sam', splitBetween: [userId, 'user_2'], date: new Date('2026-09-24') }
  ]
});

export const getHouseholdDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let hh: any = null;

    try {
      hh = await SharedHousehold.findOne({ 'members.userId': userId });
    } catch (dbErr) {}

    if (!hh) {
      if (!memoryHouseholds.has(userId)) {
        memoryHouseholds.set(userId, getInitialDemoHousehold(userId));
      }
      hh = memoryHouseholds.get(userId);
    }

    return res.json({ success: true, household: hh });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addSharedExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, amount, splitBetween } = req.body;

    const hh = memoryHouseholds.get(userId) || getInitialDemoHousehold(userId);
    const exp = {
      _id: `se_${Date.now()}`,
      title,
      amount: Number(amount),
      paidByUserId: userId,
      paidByName: 'You',
      splitBetween: splitBetween || [userId],
      date: new Date()
    };
    hh.expenses.unshift(exp);
    memoryHouseholds.set(userId, hh);

    return res.status(201).json({ success: true, expense: exp });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

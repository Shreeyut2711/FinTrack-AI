import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import CashFlowCalendar from '../models/CashFlowCalendar';
import Subscription from '../models/Subscription';

const memoryEvents: Map<string, any[]> = new Map();

const getInitialDemoEvents = (userId: string) => [
  { _id: 'e_1', userId, title: 'Monthly Salary Credit', amount: 85000, type: 'income', dueDate: new Date('2026-10-01'), status: 'pending', category: 'Income' },
  { _id: 'e_2', userId, title: 'House Rent Payment', amount: 22000, type: 'bill', dueDate: new Date('2026-10-02'), status: 'pending', category: 'Housing' },
  { _id: 'e_3', userId, title: 'Netflix Subscription', amount: 649, type: 'subscription', dueDate: new Date('2026-10-05'), status: 'pending', category: 'Entertainment' },
  { _id: 'e_4', userId, title: 'SIP Mutual Fund Auto-Debit', amount: 10000, type: 'savings_transfer', dueDate: new Date('2026-10-10'), status: 'pending', category: 'Investments' }
];

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let events: any[] = [];
    try {
      events = await CashFlowCalendar.find({ userId }).sort({ dueDate: 1 });
    } catch (dbErr) {
      if (!memoryEvents.has(userId)) {
        memoryEvents.set(userId, getInitialDemoEvents(userId));
      }
      events = memoryEvents.get(userId) || [];
    }
    return res.json({ success: true, events });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, amount, type, dueDate, category } = req.body;
    try {
      const created = await CashFlowCalendar.create({
        userId,
        title,
        amount: Number(amount),
        type,
        dueDate: new Date(dueDate),
        category: category || 'General'
      });
      return res.status(201).json({ success: true, event: created });
    } catch (dbErr) {
      const list = memoryEvents.get(userId) || getInitialDemoEvents(userId);
      const item = { _id: `e_${Date.now()}`, userId, title, amount: Number(amount), type, dueDate: new Date(dueDate), status: 'pending', category };
      list.push(item);
      memoryEvents.set(userId, list);
      return res.status(201).json({ success: true, event: item });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

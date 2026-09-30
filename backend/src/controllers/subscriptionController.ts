import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Subscription from '../models/Subscription';

const memorySubscriptions: Map<string, any[]> = new Map();

const getInitialDemoSubs = (userId: string) => [
  { _id: 'sub_1', userId, merchant: 'Netflix Premium 4K', amount: 649, billingCycle: 'monthly', nextBillingDate: new Date('2026-10-05'), category: 'Entertainment', status: 'active' },
  { _id: 'sub_2', userId, merchant: 'Spotify Duo', amount: 149, billingCycle: 'monthly', nextBillingDate: new Date('2026-10-12'), category: 'Entertainment', status: 'active' },
  { _id: 'sub_3', userId, merchant: 'Amazon Prime Yearly', amount: 1499, billingCycle: 'yearly', nextBillingDate: new Date('2027-02-18'), category: 'Shopping & Delivery', status: 'active' },
  { _id: 'sub_4', userId, merchant: 'ChatGPT Plus', amount: 1999, billingCycle: 'monthly', nextBillingDate: new Date('2026-10-01'), category: 'Software & Tools', status: 'active' }
];

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let subs: any[] = [];

    try {
      subs = await Subscription.find({ userId });
    } catch (dbErr) {
      if (!memorySubscriptions.has(userId)) {
        memorySubscriptions.set(userId, getInitialDemoSubs(userId));
      }
      subs = memorySubscriptions.get(userId) || [];
    }

    const totalMonthlyCost = subs
      .filter(s => s.status === 'active')
      .reduce((acc, s) => {
        if (s.billingCycle === 'monthly') return acc + Number(s.amount);
        if (s.billingCycle === 'yearly') return acc + (Number(s.amount) / 12);
        if (s.billingCycle === 'weekly') return acc + (Number(s.amount) * 4);
        return acc + Number(s.amount);
      }, 0);

    return res.json({
      success: true,
      subscriptions: subs,
      totalMonthlyCost: Math.round(totalMonthlyCost)
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { merchant, amount, billingCycle, nextBillingDate, category } = req.body;

    if (!merchant || !amount || !nextBillingDate) {
      return res.status(400).json({ success: false, error: 'Merchant, amount and next billing date are required' });
    }

    try {
      const sub = await Subscription.create({
        userId,
        merchant,
        amount: Number(amount),
        billingCycle: billingCycle || 'monthly',
        nextBillingDate: new Date(nextBillingDate),
        category: category || 'Entertainment',
        status: 'active'
      });
      return res.status(201).json({ success: true, subscription: sub });
    } catch (dbErr) {
      const list = memorySubscriptions.get(userId) || getInitialDemoSubs(userId);
      const sub = {
        _id: `sub_${Date.now()}`,
        userId,
        merchant,
        amount: Number(amount),
        billingCycle: billingCycle || 'monthly',
        nextBillingDate: new Date(nextBillingDate),
        category: category || 'Entertainment',
        status: 'active'
      };
      list.push(sub);
      memorySubscriptions.set(userId, list);
      return res.status(201).json({ success: true, subscription: sub });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

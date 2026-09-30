import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LifePlan from '../models/LifePlan';

const memoryPlans: Map<string, any[]> = new Map();

const getInitialLifePlans = (userId: string) => [
  {
    _id: 'lp_1',
    userId,
    eventType: 'higher_education',
    title: 'Master Degree Abroad',
    targetDate: new Date('2027-08-01'),
    estimatedOneTimeCost: 1500000,
    estimatedMonthlyCostChange: 20000,
    currentSavedAmount: 350000,
    monthlyContribution: 25000
  },
  {
    _id: 'lp_2',
    userId,
    eventType: 'vehicle_purchase',
    title: 'EV SUV Purchase',
    targetDate: new Date('2026-11-15'),
    estimatedOneTimeCost: 400000,
    estimatedMonthlyCostChange: 12000,
    currentSavedAmount: 180000,
    monthlyContribution: 20000
  }
];

export const getLifePlans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let list: any[] = [];
    try {
      list = await LifePlan.find({ userId });
    } catch (dbErr) {
      if (!memoryPlans.has(userId)) {
        memoryPlans.set(userId, getInitialLifePlans(userId));
      }
      list = memoryPlans.get(userId) || [];
    }
    return res.json({ success: true, lifePlans: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createLifePlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { eventType, title, targetDate, estimatedOneTimeCost, estimatedMonthlyCostChange, monthlyContribution } = req.body;
    try {
      const created = await LifePlan.create({
        userId,
        eventType,
        title,
        targetDate: new Date(targetDate),
        estimatedOneTimeCost: Number(estimatedOneTimeCost || 0),
        estimatedMonthlyCostChange: Number(estimatedMonthlyCostChange || 0),
        monthlyContribution: Number(monthlyContribution || 0)
      });
      return res.status(201).json({ success: true, lifePlan: created });
    } catch (dbErr) {
      const list = memoryPlans.get(userId) || getInitialLifePlans(userId);
      const item = {
        _id: `lp_${Date.now()}`,
        userId,
        eventType,
        title,
        targetDate: new Date(targetDate),
        estimatedOneTimeCost: Number(estimatedOneTimeCost || 0),
        estimatedMonthlyCostChange: Number(estimatedMonthlyCostChange || 0),
        currentSavedAmount: 0,
        monthlyContribution: Number(monthlyContribution || 0)
      };
      list.push(item);
      memoryPlans.set(userId, list);
      return res.status(201).json({ success: true, lifePlan: item });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

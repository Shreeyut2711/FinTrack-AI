import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AssetLiability from '../models/AssetLiability';

const memoryAssetLiability: Map<string, any[]> = new Map();

const getInitialAssetsLiabilities = (userId: string) => [
  { _id: 'al_1', userId, type: 'asset', name: 'Savings Account', category: 'Cash & Bank', value: 85000, notes: 'Emergency & Liquid Cash' },
  { _id: 'al_2', userId, type: 'asset', name: 'Fixed Deposit', category: 'Savings', value: 100000, notes: 'HDFC Bank FD' },
  { _id: 'al_3', userId, type: 'asset', name: 'Mutual Funds Portfolio', category: 'Investments', value: 185000, notes: 'Equity Index Funds' },
  { _id: 'al_4', userId, type: 'liability', name: 'Credit Card Outstanding', category: 'Short Term Debt', value: 12500, notes: 'HDFC Regalia Card' },
  { _id: 'al_5', userId, type: 'liability', name: 'Car Loan Remaining', category: 'Long Term Loan', value: 120000, notes: '4-Year Auto Loan' }
];

export const getNetWorthSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let items: any[] = [];

    try {
      items = await AssetLiability.find({ userId });
    } catch (dbErr) {
      if (!memoryAssetLiability.has(userId)) {
        memoryAssetLiability.set(userId, getInitialAssetsLiabilities(userId));
      }
      items = memoryAssetLiability.get(userId) || [];
    }

    const totalAssets = items.filter(i => i.type === 'asset').reduce((acc, i) => acc + Number(i.value), 0);
    const totalLiabilities = items.filter(i => i.type === 'liability').reduce((acc, i) => acc + Number(i.value), 0);
    const netWorth = totalAssets - totalLiabilities;
    const debtToIncomeRatio = totalAssets > 0 ? parseFloat(((totalLiabilities / totalAssets) * 100).toFixed(1)) : 0;

    return res.json({
      success: true,
      summary: {
        totalAssets,
        totalLiabilities,
        netWorth,
        debtToIncomeRatio,
        items
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addAssetLiability = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type, name, category, value, notes } = req.body;

    if (!type || !name || !value) {
      return res.status(400).json({ success: false, error: 'Type, name and value are required' });
    }

    try {
      const item = await AssetLiability.create({
        userId,
        type,
        name,
        category: category || (type === 'asset' ? 'General Asset' : 'General Debt'),
        value: Number(value),
        notes: notes || ''
      });
      return res.status(201).json({ success: true, item });
    } catch (dbErr) {
      const list = memoryAssetLiability.get(userId) || getInitialAssetsLiabilities(userId);
      const item = {
        _id: `al_${Date.now()}`,
        userId,
        type,
        name,
        category: category || (type === 'asset' ? 'General Asset' : 'General Debt'),
        value: Number(value),
        notes: notes || ''
      };
      list.push(item);
      memoryAssetLiability.set(userId, list);
      return res.status(201).json({ success: true, item });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

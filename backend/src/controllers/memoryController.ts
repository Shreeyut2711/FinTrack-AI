import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AIMemory from '../models/AIMemory';

const memoryStore: Map<string, any[]> = new Map();

const getInitialMemories = (userId: string) => [
  { _id: 'm_1', userId, key: 'Career Goal', value: "Saving for a Master's degree in AI & Data Science", category: 'goal_note' },
  { _id: 'm_2', userId, key: 'Risk Preference', value: 'Prefers conservative 6-month emergency fund buffer before investing', category: 'preference' }
];

export const getMemories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let list: any[] = [];
    try {
      list = await AIMemory.find({ userId });
    } catch (dbErr) {
      if (!memoryStore.has(userId)) {
        memoryStore.set(userId, getInitialMemories(userId));
      }
      list = memoryStore.get(userId) || [];
    }
    return res.json({ success: true, memories: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveMemory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { key, value, category } = req.body;
    try {
      const created = await AIMemory.create({ userId, key, value, category: category || 'general' });
      return res.status(201).json({ success: true, memory: created });
    } catch (dbErr) {
      const list = memoryStore.get(userId) || getInitialMemories(userId);
      const item = { _id: `m_${Date.now()}`, userId, key, value, category: category || 'general' };
      list.push(item);
      memoryStore.set(userId, list);
      return res.status(201).json({ success: true, memory: item });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteMemory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    try {
      await AIMemory.findOneAndDelete({ _id: id, userId });
    } catch (dbErr) {}
    if (memoryStore.has(userId)) {
      let list = memoryStore.get(userId)!;
      list = list.filter(m => m._id !== id);
      memoryStore.set(userId, list);
    }
    return res.json({ success: true, message: 'Memory deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

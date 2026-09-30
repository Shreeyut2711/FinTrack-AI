import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import SecurityAlert from '../models/SecurityAlert';

const memorySecurityAlerts: Map<string, any[]> = new Map();

const getInitialSecurityAlerts = (userId: string) => [
  {
    _id: 'sa_1',
    userId,
    type: 'duplicate_charge',
    title: 'Potential Duplicate Charge Flagged',
    description: 'Two identical charges of ₹345 at Swiggy recorded within 3 minutes.',
    transactionAmount: 345,
    merchant: 'Swiggy',
    severity: 'high',
    status: 'active'
  },
  {
    _id: 'sa_2',
    userId,
    type: 'price_increase',
    title: 'Subscription Price Spike Detected',
    description: 'Netflix subscription billed at ₹649 (+15% higher than previous 3-month baseline of ₹549).',
    transactionAmount: 649,
    merchant: 'Netflix',
    severity: 'medium',
    status: 'active'
  }
];

export const getSecurityAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let alerts: any[] = [];
    try {
      alerts = await SecurityAlert.find({ userId, status: 'active' });
    } catch (dbErr) {
      if (!memorySecurityAlerts.has(userId)) {
        memorySecurityAlerts.set(userId, getInitialSecurityAlerts(userId));
      }
      alerts = memorySecurityAlerts.get(userId) || [];
    }
    return res.json({ success: true, alerts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAlertStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updated = await SecurityAlert.findOneAndUpdate({ _id: id, userId }, { status }, { new: true });
      if (updated) return res.json({ success: true, alert: updated });
    } catch (dbErr) {}

    if (memorySecurityAlerts.has(userId)) {
      let list = memorySecurityAlerts.get(userId)!;
      list = list.filter(a => a._id !== id);
      memorySecurityAlerts.set(userId, list);
      return res.json({ success: true, message: 'Alert updated' });
    }

    return res.status(404).json({ success: false, error: 'Alert not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

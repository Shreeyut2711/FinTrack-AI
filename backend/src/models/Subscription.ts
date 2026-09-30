import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  merchant: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: Date;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  merchant: { type: String, required: true },
  amount: { type: Number, required: true },
  billingCycle: { type: String, enum: ['monthly', 'yearly', 'weekly'], default: 'monthly' },
  nextBillingDate: { type: Date, required: true },
  category: { type: String, default: 'Entertainment' },
  status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

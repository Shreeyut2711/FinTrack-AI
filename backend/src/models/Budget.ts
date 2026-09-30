import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly' | 'custom';
  monthYear?: string; // e.g. "2026-09"
  alertsSent: number[]; // e.g. [70, 90, 100]
  createdAt: Date;
}

const BudgetSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: ['monthly', 'yearly', 'custom'], default: 'monthly' },
  monthYear: { type: String, required: true },
  alertsSent: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBudget>('Budget', BudgetSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingsGoalHistory {
  amount: number;
  type: 'contribution' | 'withdrawal';
  date: Date;
  note?: string;
}

export interface ISavingsGoal extends Document {
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  description?: string;
  category?: string;
  history: ISavingsGoalHistory[];
  isArchived: boolean;
  createdAt: Date;
}

const SavingsGoalSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  history: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ['contribution', 'withdrawal'], required: true },
      date: { type: Date, default: Date.now },
      note: { type: String, default: '' }
    }
  ],
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICashFlowEvent extends Document {
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'bill' | 'subscription' | 'emi' | 'savings_transfer';
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  category: string;
  isRecurring: boolean;
  notes?: string;
  createdAt: Date;
}

const CashFlowEventSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'bill', 'subscription', 'emi', 'savings_transfer'], required: true },
  dueDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  category: { type: String, default: 'General' },
  isRecurring: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICashFlowEvent>('CashFlowEvent', CashFlowEventSchema);

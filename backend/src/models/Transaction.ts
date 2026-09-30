import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  name: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subcategory?: string;
  paymentMethod: string;
  date: Date;
  description?: string;
  isEssential: boolean;
  isRecurring: boolean;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '' },
  paymentMethod: { type: String, default: 'UPI' },
  date: { type: Date, default: Date.now, index: true },
  description: { type: String, default: '' },
  isEssential: { type: Boolean, default: false },
  isRecurring: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

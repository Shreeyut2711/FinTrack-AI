import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
  userId: string;
  name: string;
  type: 'stocks' | 'mutual_fund' | 'sip' | 'real_estate' | 'crypto' | 'fd';
  investedAmount: number;
  currentValue: number;
  purchaseDate: Date;
  notes?: string;
  createdAt: Date;
}

const InvestmentSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['stocks', 'mutual_fund', 'sip', 'real_estate', 'crypto', 'fd'], required: true },
  investedAmount: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);

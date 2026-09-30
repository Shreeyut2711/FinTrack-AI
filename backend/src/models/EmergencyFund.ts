import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyFund extends Document {
  userId: string;
  targetAmount: number;
  currentBalance: number;
  coverageMonths: number;
  essentialMonthlyExpense: number;
  updatedAt: Date;
  createdAt: Date;
}

const EmergencyFundSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  targetAmount: { type: Number, required: true, default: 150000 },
  currentBalance: { type: Number, required: true, default: 45000 },
  coverageMonths: { type: Number, default: 6 },
  essentialMonthlyExpense: { type: Number, default: 25000 },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEmergencyFund>('EmergencyFund', EmergencyFundSchema);

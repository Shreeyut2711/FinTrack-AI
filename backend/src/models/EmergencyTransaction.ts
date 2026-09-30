import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyTransaction extends Document {
  userId: string;
  amount: number;
  type: 'contribution' | 'withdrawal';
  category: string;
  description: string;
  date: Date;
  balanceAfter: number;
  monthsCoverageAfter: number;
  createdAt: Date;
}

const EmergencyTransactionSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['contribution', 'withdrawal'], required: true },
  category: { type: String, default: 'General' },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  balanceAfter: { type: Number, required: true },
  monthsCoverageAfter: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEmergencyTransaction>('EmergencyTransaction', EmergencyTransactionSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISecurityAlert extends Document {
  userId: string;
  type: 'duplicate_charge' | 'large_transaction' | 'high_frequency' | 'price_increase' | 'unusual_anomaly';
  title: string;
  description: string;
  transactionAmount?: number;
  merchant?: string;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'acknowledged' | 'dismissed';
  evidenceData: any;
  createdAt: Date;
}

const SecurityAlertSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['duplicate_charge', 'large_transaction', 'high_frequency', 'price_increase', 'unusual_anomaly'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  transactionAmount: Number,
  merchant: String,
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['active', 'acknowledged', 'dismissed'], default: 'active' },
  evidenceData: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISecurityAlert>('SecurityAlert', SecurityAlertSchema);

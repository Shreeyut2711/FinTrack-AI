import mongoose, { Schema, Document } from 'mongoose';

export interface ILifePlan extends Document {
  userId: string;
  eventType: 'higher_education' | 'relocation' | 'vehicle_purchase' | 'home_purchase' | 'marriage' | 'job_change' | 'custom';
  title: string;
  targetDate: Date;
  estimatedOneTimeCost: number;
  estimatedMonthlyCostChange: number;
  currentSavedAmount: number;
  monthlyContribution: number;
  notes?: string;
  createdAt: Date;
}

const LifePlanSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  eventType: { type: String, enum: ['higher_education', 'relocation', 'vehicle_purchase', 'home_purchase', 'marriage', 'job_change', 'custom'], required: true },
  title: { type: String, required: true },
  targetDate: { type: Date, required: true },
  estimatedOneTimeCost: { type: Number, default: 0 },
  estimatedMonthlyCostChange: { type: Number, default: 0 },
  currentSavedAmount: { type: Number, default: 0 },
  monthlyContribution: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILifePlan>('LifePlan', LifePlanSchema);

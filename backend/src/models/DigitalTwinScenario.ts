import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalTwinScenario extends Document {
  userId: string;
  name: string;
  type: 'job_loss' | 'salary_change' | 'rent_increase' | 'relocation' | 'large_purchase' | 'loan_repayment' | 'custom';
  durationMonths: number;
  incomeImpactPerMonth: number;
  expenseImpactPerMonth: number;
  oneTimeCost: number;
  projectedBalances: { month: number; balance: number; coverageMonths: number; netWorth: number }[];
  notes?: string;
  createdAt: Date;
}

const DigitalTwinScenarioSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['job_loss', 'salary_change', 'rent_increase', 'relocation', 'large_purchase', 'loan_repayment', 'custom'], required: true },
  durationMonths: { type: Number, default: 6 },
  incomeImpactPerMonth: { type: Number, default: 0 },
  expenseImpactPerMonth: { type: Number, default: 0 },
  oneTimeCost: { type: Number, default: 0 },
  projectedBalances: [
    {
      month: Number,
      balance: Number,
      coverageMonths: Number,
      netWorth: Number
    }
  ],
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDigitalTwinScenario>('DigitalTwinScenario', DigitalTwinScenarioSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISharedMember {
  userId: string;
  name: string;
  role: 'admin' | 'member';
}

export interface ISharedExpense {
  _id?: string;
  title: string;
  amount: number;
  paidByUserId: string;
  paidByName: string;
  splitBetween: string[]; // userIds
  date: Date;
}

export interface ISharedHousehold extends Document {
  name: string;
  members: ISharedMember[];
  sharedBudgets: { category: string; amount: number }[];
  expenses: ISharedExpense[];
  createdAt: Date;
}

const SharedHouseholdSchema: Schema = new Schema({
  name: { type: String, required: true },
  members: [
    {
      userId: String,
      name: String,
      role: { type: String, default: 'member' }
    }
  ],
  sharedBudgets: [
    {
      category: String,
      amount: Number
    }
  ],
  expenses: [
    {
      title: String,
      amount: Number,
      paidByUserId: String,
      paidByName: String,
      splitBetween: [String],
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISharedHousehold>('SharedHousehold', SharedHouseholdSchema);

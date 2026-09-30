import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  currency: string; // default INR
  currencySymbol: string; // ₹
  timezone: string;
  essentialMonthlyExpense: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  essentialMonthlyExpense: { type: Number, default: 25000 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IAssetLiability extends Document {
  userId: string;
  type: 'asset' | 'liability';
  name: string;
  category: string;
  value: number;
  notes?: string;
  createdAt: Date;
}

const AssetLiabilitySchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['asset', 'liability'], required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  value: { type: Number, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssetLiability>('AssetLiability', AssetLiabilitySchema);

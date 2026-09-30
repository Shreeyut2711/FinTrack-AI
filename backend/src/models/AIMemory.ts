import mongoose, { Schema, Document } from 'mongoose';

export interface IAIMemory extends Document {
  userId: string;
  key: string;
  value: string;
  category: 'preference' | 'priority' | 'goal_note' | 'general';
  createdAt: Date;
}

const AIMemorySchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  key: { type: String, required: true },
  value: { type: String, required: true },
  category: { type: String, enum: ['preference', 'priority', 'goal_note', 'general'], default: 'general' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAIMemory>('AIMemory', AIMemorySchema);

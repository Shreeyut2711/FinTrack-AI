import mongoose, { Schema, Document } from 'mongoose';

export interface IParsedDocument extends Document {
  userId: string;
  fileName: string;
  documentType: 'bank_statement' | 'credit_card' | 'salary_slip' | 'bill' | 'receipt';
  extractedData: {
    merchant?: string;
    amount?: number;
    date?: string;
    category?: string;
    items?: any[];
    rawText?: string;
  };
  isConfirmed: boolean;
  createdAt: Date;
}

const ParsedDocumentSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  documentType: { type: String, enum: ['bank_statement', 'credit_card', 'salary_slip', 'bill', 'receipt'], default: 'receipt' },
  extractedData: { type: Schema.Types.Mixed, default: {} },
  isConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IParsedDocument>('ParsedDocument', ParsedDocumentSchema);

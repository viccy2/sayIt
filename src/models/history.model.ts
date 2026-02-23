import { Schema, model, Document, Types } from 'mongoose';

export interface IHistory extends Document {
  userId: Types.ObjectId;
  originalText: string;
  detectedLanguage: string;
  meaning: string;
  createdAt: Date;
}

const historySchema = new Schema<IHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  originalText: { type: String, required: true },
  detectedLanguage: { type: String, required: true },
  meaning: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Indexing for faster history retrieval by user
historySchema.index({ userId: 1, createdAt: -1 });

export default model<IHistory>('History', historySchema);

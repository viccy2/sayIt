import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHistory extends Document {
  user: Types.ObjectId;
  originalText: string;
  meaning: string;
  detectedLanguage: string;
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  originalText: { type: String, required: true },
  meaning: { type: String, required: true },
  detectedLanguage: { type: String, default: 'English' }
}, { timestamps: true });

export default mongoose.model<IHistory>('History', HistorySchema);

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHistory extends Document {
  user: Types.ObjectId;
  originalText: string;
  meaning: string;
  detectedLanguage: string;
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  // This must match the field name 'user' in your Atlas documents
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  originalText: { type: String, required: true },
  meaning: { type: String, required: true },
  detectedLanguage: { type: String, default: 'English' }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

export default mongoose.model<IHistory>('History', HistorySchema);

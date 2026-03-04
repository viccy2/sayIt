import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  user: string; // Changed to string to match your Atlas data
  originalText: string;
  meaning: string;
  detectedLanguage: string;
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  user: { 
    type: String, // Matching the string format in your sample
    required: true,
    index: true 
  },
  originalText: { type: String, required: true },
  meaning: { type: String, required: true },
  detectedLanguage: { type: String, default: 'English' }
}, { 
  timestamps: true 
});

// Forcing it to use 'histories' as confirmed in your Atlas
export default mongoose.model<IHistory>('History', HistorySchema, 'histories');

import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @interface IUser
 * This defines the shape of your User document in TypeScript.
 * We include Types.ObjectId to help fix the "Argument not assignable" errors.
 */
export interface IUser extends Document {
  _id: Types.ObjectId; 
  username: string;
  email: string;
  password?: string; // Optional to allow for future Google Auth
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String,
      // Only required if no googleId exists
      required: function(this: any) {
        return !this.googleId;
      }
    },
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true // Allows multiple nulls for non-Google users
    },
  },
  { timestamps: true }
);

/**
 * Password Hashing Middleware
 * Automatically hashes the password before saving to MongoDB.
 */
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Password Verification Method
 */
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

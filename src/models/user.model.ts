import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId; 
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { 
      type: String,
      // select: false, // Optional: prevents password from being returned in queries by default
      required: function(this: any) { return !this.googleId; }
    },
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    // Fields for 6-digit OTP
    verificationToken: { type: String, select: false },
    verificationTokenExpire: Date,
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

/**
 * Password Hashing Middleware
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

import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @interface IUser
 */
export interface IUser extends Document {
  _id: Types.ObjectId; 
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  // Verification Fields (Now used for 6-digit OTP)
  isVerified: boolean;
  verificationToken?: string; // Will store hashed 6-digit code
  verificationTokenExpire?: Date;
  // Password Reset Fields (Now used for 6-digit OTP)
  resetPasswordToken?: string; // Will store hashed 6-digit code
  resetPasswordExpire?: Date;
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
      required: function(this: any) {
        return !this.googleId;
      }
    },
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    // Verification Schema
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    // We keep these names to avoid breaking existing queries, 
    // but they will now hold 6-digit hashed codes.
    verificationToken: String,
    verificationTokenExpire: Date,
    // Password Reset Schema
    resetPasswordToken: String,
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

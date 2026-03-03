import mongoose from 'mongoose';

const connectDB = async () => {
  // 1. If already connected, don't do anything
  if (mongoose.connection.readyState >= 1) return;

  try {
    // 2. Disable buffering globally so it fails immediately if not connected 
    // instead of hanging for 10 seconds.
    mongoose.set('bufferCommands', false);

    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000, // Fail faster (5s) so you can retry
      socketTimeoutMS: 45000,
    });
    
    console.log("✨ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    // Don't just log it; throw it so the server knows the request failed
    throw error; 
  }
};

export default connectDB;

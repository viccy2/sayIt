import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGODB_URI!, {
      connectTimeoutMS: 10000, // Give it 10s to connect
      socketTimeoutMS: 45000,
    });
    console.log("✨ MongoDB Connected");
  } catch (error) {
    console.error("Connection Error:", error);
  }
};

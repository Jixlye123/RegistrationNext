import mongoose from "mongoose";

let isConnected = false; // Global state to avoid too many connections

export async function connectDB() {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "digicluster", // you can name it whatever you want
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
}

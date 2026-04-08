import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI?.trim().replace(/;$/, "") ||
    process.env.MONGODB_URL?.trim().replace(/;$/, "");

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI or MONGODB_URL is not set in backend/.env"
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    if (mongoUri.startsWith("mongodb+srv://")) {
      error.message = `${error.message}. Atlas SRV DNS lookup failed. Check the cluster hostname, internet access, or use a full mongodb:// connection string instead of mongodb+srv://.`;
    }

    throw error;
  }

  console.log("MongoDB connected");
};

import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";

if (!DB_URI) throw new Error("Please define the MONGODB_URI environment variable inside .env<development/production>.local");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI as string);
    console.log(`Connect to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.log("Error connect to MongoDB", error);
  }
};
export default connectToDatabase;

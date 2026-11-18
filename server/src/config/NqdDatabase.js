import mongoose from "mongoose";
import { env } from "./NqdEnv.js";

export const connectDatabase = async () => {
    await mongoose.connect(env.mongoUri);

    console.log("Kết nối MongoDB thành công");
};
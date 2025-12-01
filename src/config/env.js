import dotenv from "dotenv";
dotenv.config();

export const MONGO_ATLAS_URL = process.env.ATLAS_URL;
export const PORT = process.env.PORT || 1234;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

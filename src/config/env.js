import dotenv from "dotenv";
dotenv.config();

export const MONGO_ATLAS_URL = process.env.ATLAS_URL;
export const PORT = process.env.PORT || 1234;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Google OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Frontend URL
export const FRONTEND_URL = process.env.FRONTEND_URL;

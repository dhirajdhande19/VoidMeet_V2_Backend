import {
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from "../config/env.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import axios from "axios";

export const register = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide data to continue" });
  }

  // email check call
  if (!validateEmail(email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  try {
    // To check if user alredy exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(httpStatus.FOUND).json({
        message:
          "User with the given email already exits! Please try another email.",
      });
    }

    // to hash the password entered by user
    const hashedPassword = await bcrypt.hash(password, 10);

    // thus new user is created
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User Registered Successfully" });
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: `${e}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Please provide data to continue" });
  }

  // email check
  if (!validateEmail(email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found!" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // create token for user
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email }, // payload
        JWT_SECRET, // Secret from .env
        { expiresIn: JWT_EXPIRES_IN } // expiry timeline
      );

      return res
        .status(httpStatus.OK)
        .json({ message: "Logged in Successfully", token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

// Validate email before saving user into db
const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const redirectToGoogle = async (req, res) => {
  try {
    const Redirect_URI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&access_type=offline&include_granted_scopes=true&state=xyz123&prompt=consent`;
    return res.redirect(Redirect_URI);
  } catch (e) {
    return res.json(e.response.data);
  }
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.json({ message: "Missing code" });
  }
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { id_token } = response.data;
    // u can also retrive {acccess_token} if we have to call google api's like (youtube, calender, drive etc...)
    const googleUser = jwt.decode(id_token);

    let user = await User.findOne({ googleId: googleUser.sub });
    if (!user) {
      user = await User.create({
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
  } catch (e) {
    return res.status(500).json({
      error: true,
      message: "OAuth token exchange failed",
      details: e.response?.data || e.message,
    });
  }
};

export const validUser = async (req, res) => {
  return res.json({
    user: req.user,
  });
};

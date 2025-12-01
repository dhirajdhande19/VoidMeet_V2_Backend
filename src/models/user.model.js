import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: { type: String, required: true },
  meetings: [{ type: mongoose.Schema.ObjectId, ref: "Meeting" }],
});

const User = mongoose.model("User", userSchema);

export { User };

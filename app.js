import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./src/controllers/socketManager.js";
import { PORT, MONGO_ATLAS_URL } from "./src/config/env.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", PORT);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://voidmeet.onrender.com"],
    credentials: true,
  })
);

import userRoute from "./src/routes/user.router.js";
import authRoute from "./src/routes/auth.router.js";

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Ok" });
});

const start = async () => {
  const connectionDB = await mongoose.connect(MONGO_ATLAS_URL);
  console.log(`MONGO Connected to Host: ${connectionDB.connection.host}`);

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};

start();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middlewares.js";
const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config({});
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-type"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(authenticationMiddleware);

app.get("/", (req, res) => {
  return res.json({
    status: "Server is up and running ...",
  });
});
app.use("/user", userRouter);
app.use(urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT $${PORT}`);
});

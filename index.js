import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middlewares.js";
const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
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

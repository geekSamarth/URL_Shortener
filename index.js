import express from "express";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middlewares.js";
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(authenticationMiddleware);

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running ..." });
});
app.use(urlRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT $${PORT}`);
});

import express from "express";
import {
  getUserDetails,
  login,
  logout,
  signup,
} from "../controllers/auth.controllers.js";
import { ensureAuthenticated } from "../middlewares/auth.middlewares.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/getuserprofile", ensureAuthenticated, getUserDetails);
router.post("/logout", ensureAuthenticated, logout);

export default router;

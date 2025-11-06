import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.middlewares";
const router = express.Router();

// routes for URL's

router.post("/shorten", ensureAuthenticated, shortenUrl);

export default router;

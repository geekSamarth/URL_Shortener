import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  deleteURL,
  getAllShortenedURLs,
  redirectOriginalURL,
  shortenUrl,
} from "../controllers/url.controllers.js";
const router = express.Router();

// routes for URL's

router.post("/shorten", ensureAuthenticated, shortenUrl);
router.get("/all-urls", ensureAuthenticated, getAllShortenedURLs);
router.delete("/urls/:id", ensureAuthenticated, deleteURL);
router.get("/:shortcode", redirectOriginalURL);

export default router;

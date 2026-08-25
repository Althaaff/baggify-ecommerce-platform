import express from "express";
import {
  getSearchSuggestions,
  trackSearch,
} from "../../controllers/user/search.controller.js";

const router = express.Router();

router.get("/suggestions", getSearchSuggestions);
router.post("/track", trackSearch);

export default router;

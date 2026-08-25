import express from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller.js";

const router = express.Router();

router.get("/", getDashboardStats);

export default router;

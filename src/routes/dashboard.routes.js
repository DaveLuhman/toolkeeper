
import { getAllTools } from "../middleware/tool.js";
import { Router } from "express";
const router = Router();
router.get("/", getAllTools, (_req, res) => {
  res.render("dashboard");
});
export default router;

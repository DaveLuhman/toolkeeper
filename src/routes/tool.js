import { Router } from "express";
import {
  checkTools,
  getToolByID,
  archiveTool,
  createTool,
  searchTools,
  updateTool,
} from "../middleware/tool.js";
const router = Router();

router.get("/:id", getToolByID, (_req, res) => {
  res.render("editTool"); // if tool exists render editTool
});
router.post("/search", searchTools, (_req, res) => {
  res.render("dashboard");
});
router.post("/checkTools", checkTools, (_req, res) => {
  res.render("editTool");
});
router.post("/submit", createTool, (_req, res) => {
  res.render("dashboard");
});
router.post("/update/", updateTool, (_req, res) => {
  res.render("dashboard");
});

router.get("/archive/:id", archiveTool, (_req, res) => {
  res.redirect("/dashboard");
});

export default router;

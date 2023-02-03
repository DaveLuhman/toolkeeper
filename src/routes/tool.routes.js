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

// get tool by id
router.get("/:id", getToolByID, (_req, res) => {
  res.render("editTool");
});

// search for tools
router.post("/search", searchTools, (_req, res) => {
  res.render("dashboard");
});

// determine if tool is checked in or out
router.post("/checkTools", checkTools, (_req, res) => {
  res.render("editTool");
});

// create new tool
router.post("/submit", createTool, (_req, res) => {
  res.render("dashboard");
});

// update tool
router.post("/update", updateTool, (_req, res) => {
  res.render("dashboard");
});

// archive tool
router.get("/archive/:id", archiveTool, (_req, res) => {
  res.redirect("/dashboard");
});

export default router;

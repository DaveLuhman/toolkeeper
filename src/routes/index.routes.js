import { Router } from "express";
import { login, logout } from "../middleware/auth.js";
import { default as t } from "../controllers/tool.js";

const router = Router();

// Render Public Landing Page
router.get("/", (_req, res) => {
  res.render("index", { layout: "public.hbs" });
});

// Render Login Page
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("login", { layout: "login.hbs" });
  }
});

// Login User
router.post("/login", login, (_req, res) => {
  res.redirect("/dashboard");
});

// Logout User
router.get("/logout", logout);

// Import Tool Data from CSV
router.post("/submitFile", t.importFromCSV);

export default router;

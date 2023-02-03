import { Router as expressRouter } from "express";
import { createUser, getUsers, updateUser, resetPassword, disableUser, getUserByID } from "../middleware/user.js";

const router = expressRouter();

// show user management dashboard
router.get("/", getUsers, (_req, res) => {
  res.render("userManagement", { layout: "user.hbs" });
});

// get user by ID and render edit page
router.get("/:id", getUserByID, (_req, res) => {
  res.render("editUser", { layout: "user.hbs" });
});

// update user
router.post("/:id", updateUser, (_req, res) => {
  res.redirect("./");
});

// reset user's password
router.post("/resetPW/:id", resetPassword, (_req, res) => {
  res.render("userManagement", { layout: "user.hbs" });
});

// disable user
router.post("/disableUser/:id", disableUser, (_req, res) => {
  res.render("userManagement", { layout: "user.hbs" });
});

// create new user
router.post("/createUser", createUser, (_req, res) => {
  res.render("userManagement", { layout: "user.hbs" });
});

export default router;

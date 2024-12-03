import { Router as expressRouter } from "express";
import { updateUser, resetPassword } from "../middleware/user.js";
import { sanitizeReqBody } from "../middleware/util.js";
import { login } from "../middleware/auth.js";
import {
	hoistOnboarding,
	profileOnboardingComplete,
} from "../middleware/onboarding.js";

export const userRouter = expressRouter();
// show user their own profile
userRouter.get("/profile", hoistOnboarding, (_req, res) => {
	res.render("profile");
});
// update user's own profile
userRouter.post("/profile", sanitizeReqBody, updateUser, login, (_req, res) => {
	res.redirect("/user/profile");
});
// update user's own password
userRouter.post("/resetPassword", resetPassword, (_req, res) => {
	res.redirect("/user/profile");
});



// @desc complete profile onboarding
// @endpoint POST /user/profile/onboarding-complete
userRouter.post("/profile/onboarding-complete", profileOnboardingComplete);
// src\routes\user.routes.js

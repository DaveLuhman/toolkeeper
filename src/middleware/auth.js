import passport from "passport";
import { Onboarding } from "../models/index.models.js";
/**
 * @param req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Checks if the user is authenticated
 * @example
 * app.get('/dashboard', checkAuth, (req, res) => {
 *  res.render('dashboard')
 * })
 **/
function checkAuth(req, res, next) {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
		return next();
	}
	res.locals.message = "You must be logged in to access that page";
	res.redirect("/login");
}
/**
 * @param req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Checks if the user is a manager
 * @example
 * app.get('/settings', checkAuth, isManager, (req, res) => {
 * res.render('settings/users')
 * })
 **/
function isManager(req, res, next) {
	if (req.user.role === "User") {
		res.locals.error =
			"You are not a manager, and have been redirected to the dashboard";
		return res.redirect("/dashboard");
	}
	return next();
}
/**
 * @param req Express Request object
 * @param  res  Express Response object
 * @param next()
 * @returns {void}
 * @description Logs the user in
 * @example
 * app.post('/login', login, (req, res) => {
 * res.redirect('/dashboard')
 * })
 * @todo fix the failure message
 **/
function login(req, res, next) {
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true,
		successRedirect: "/dashboard",
	}, async (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect("/login");
		}
		req.logIn(user, async (err) => {
			if (err) {
				return next(err);
			}
			// Hoist the user's onboarding document to the request object
			let onboardingDoc;
			try {
				onboardingDoc = await Onboarding.findOne({ user: user.id });
				res.locals.onboarding = onboardingDoc; // Store onboarding document on req
			} catch (error) {
				return next(error);
			}
			return res.redirect("/dashboard");
		});
	})(req, res, next);
}

/**
 * @param  req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Logs the user out
 * @example
 * app.get('/logout', logout, (req, res) => {
 * res.redirect('/')
 * })
 **/
function logout(req, res, next) {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
}

export { checkAuth, isManager, login, logout };

// src\middleware\auth.js

// add function that checks if the user's tenant's subscription is active



import passport from "passport";
import { Onboarding, User, Tenant, Subscription } from "../models/index.models.js";
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

// Enhance verifySubscriptionStatus to handle additional statuses
async function verifySubscriptionStatus(userId) {
	const user = await User.findById(userId);
	const tenant = await Tenant.findById(user.tenant);
	if (tenant) {
		const subscription = await Subscription.findOne({ tenant: tenant._id });
		if (subscription) {
			switch (subscription.status) {
				case "expired":
					return {
						proceed: false,
						message:
							"Your subscription has expired. Please contact support or update your subscription at https://store.ado.software.",
					};
				case "lapsed":
					return {
						proceed: false,
						message:
							"Your subscription has lapsed. Please renew your subscription.",
					};
				case "cancelled":
					return {
						proceed: false,
						message:
							"Your subscription has been cancelled. Please contact support for more information.",
					};
				case "paused":
					return {
						proceed: false,
						message:
							"Your subscription is currently paused. Please resume your subscription to continue.",
					};
				default:
					return { proceed: true };
			}
		}
	}
	return { proceed: true };
}
// Change hoistOnboardingDocument to an anonymous function
const hoistOnboardingDocument = async (user) => {
	try {
		const onboardingDoc = await Onboarding.findOne({ user: user.id });
		return onboardingDoc;
	} catch (error) {
		throw new Error("Error fetching onboarding document");
	}
};

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
	passport.authenticate(
		"local",
		{
			failureRedirect: "/login",
			failureFlash: true,
			successRedirect: "/dashboard",
		},
		async (err, user, info) => {
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
				user.lastLogin = new Date();
				await user.save();

				// Verify subscription status
				const subscriptionStatus = await verifySubscriptionStatus(user.id);
				if (!subscriptionStatus.proceed) {
					res.locals.message = subscriptionStatus.message;
					return res.redirect("/login");
				}

				// Hoist the user's onboarding document using the anonymous function
				try {
					const onboardingDoc = await hoistOnboardingDocument(user);
					res.locals.onboarding = onboardingDoc;
				} catch (error) {
					return next(error);
				}

				return res.redirect("/dashboard");
			});
		},
	)(req, res, next);
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

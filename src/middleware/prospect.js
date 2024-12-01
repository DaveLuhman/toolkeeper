import { Prospect, User } from "../models/index.models.js";


/**
 * Registers a pending user and redirects the user to the checkout page
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
export async function createProspect(req, res, next) {
	console.info("[MW] createProspect-in".bgBlue.white);

	const { name, email, companyName } = req.body;
	const userValues = { name, email, companyName };
	// Check if email and companyName are provided
	if (!email || !companyName) {
		const error = "Email and Company Name are required";
		console.warn(error.yellow);
		res.locals.message = error;
		console.info("[MW] createProspect-out-1".bgWhite.blue);
		return res.status(400).redirect("back");
	}
	// Check if email already registered
	try {
		const existingUser = await User.find({ email });
		if (existingUser) {
			const error = "Email is already registered";
			console.warn(error.yellow);
			res.locals.message = error;
			console.info("[MW] createProspect-out-2".bgWhite.blue);
			return res.location(req.get("Referrer") || "/")
		}
	} catch (err) {
		console.error(`[MW] Error checking email: ${err.message}`.bgRed.white);
		return next(err); // Pass error to error handler middleware
	}
	// Try to create a new user
	try {
		const newUser = await Prospect.create(userValues);
		console.info(`Created User ${newUser.email}`.green);
		res.redirect(await checkoutUrl());
	} catch (err) {
		console.error(`[MW] Error creating user: ${err.message}`.bgRed.white);
		return next(err); // Pass error to error handler middleware
	}
}

export async function convertProspect(email) {
	try {
		const prospect = await Prospect.findOne({ email });
		if (prospect) {
			prospect.converted = true;
			await prospect.save();
			return prospect;
		}
	} catch (err) {
		console.error(`[MW] Error converting prospect: ${err.message}`.bgRed.white);
		return null;
	}
}

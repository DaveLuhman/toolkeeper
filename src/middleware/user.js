import { User, Tenant, Subscription, Onboarding } from "../models/index.models.js";
import { mutateToArray } from "./util.js";
import { determineUserLimit } from "./subscription.js";
import logger from "../logging/index.js";

/**
 * getUsers - queries all users from db
 * @param {array} res.locals.users - if id is not provided, find all users
 * @param {*} next
 * @returns {array}
 */
const getUsers = async (req, res, next) => {
	console.info("[MW] getUsers-in".bgBlue.white);
	const users = await User.find()
		.where("tenant")
		.equals(req.user.tenant.valueOf())
		.where("role")
		.in(["Manager", "User", "Admin"]) // no super admins
		.sort({ createdAt: -1 });
	res.locals.users = mutateToArray(users);
	console.info("[MW] getUsers-out-2".bgWhite.blue);
	return next();
};

/**
 * Retrieves a user by their ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is retrieved.
 */
const getUserByID = async (req, res, next) => {
	console.info("[MW] getUserByID-in".bgBlue.white);
	const {id} = req.params;
	console.info(`[MW] searching id: ${id}`);
	const user = await User.findById(id);
	res.locals.userToEdit = mutateToArray(user);
	console.info("[MW] getUserByID-out".bgWhite.blue);
	return next();
};

/**
 * Creates a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
const createUserInTenant = async (req, res, next) => {
	console.info("[MW] createUser-in".bgBlue.white);
	let newUser;

	const { name, email, password, confirmPassword, role } = req.body;
	const tenant = req.user.tenant.valueOf();

	try {
		// Check if email and password are provided
		if (!email || !password) {
			throw new Error("Email and Password are required");
		}

		// Check if email already exists in the same tenant
		const existingUser = await User.findOne({ email, tenant });
		if (existingUser) {
			throw new Error("Email is already registered");
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			throw new Error("Passwords do not match");
		}
		// Check user limit based on subscription
		const subscriptionDoc = await Subscription.findOne({ tenant });

		if (!subscriptionDoc) {
			throw new Error("No subscription found. Please contact support at <a href='mailto:support@ado.software'>https://support@ado.software.</a>");
		}

		const currentUserCount = await User.countDocuments({ tenant });

		// Determine user limit using the external function
		const { userLimit, planName } = determineUserLimit(
			subscriptionDoc.lemonSqueezyObject.variant_name,
		);

		if (currentUserCount >= userLimit) {
			throw new Error(`User limit reached for ${planName} plan`);
		}

		// Create the new user in a try-catch block
		try {
			newUser = await User.create({
				name,
				email,
				password,
				role: role || "User",
				tenant,
			});
			console.info(`Created User ${newUser._id}`.green);
		} catch (userError) {
			console.error("[MW] Error creating user record:".bgRed.white, userError);
			throw new Error("Failed to create user account");
		}

		res.locals.message = "User created successfully";
		res.status(201);
		return next();
	} catch (error) {
		logger.error(`[MW] Error in createUser: ${error.message}`.bgRed.white);
		res.locals.error = error.message;
		res.status(400);
		return next(error);
	}
};

/**
 * Verifies if the current user is the same as the target user.
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next Callback function to pass control to the next middleware.
 */
const verifySelf = (req, res, next) => {
	console.info("[MW] verifySelf-in".bgBlue.white);
	const targetID = req.params.id || req.body._id;
	const currentUser = req.user._id;
	if (targetID !== currentUser) {
		res.status(401);
		res.locals.error = "Unauthorized";
		console.warn("Unauthorized".yellow);
		console.info("[MW] verifySelf-out-0".bgWhite.blue);
		res.redirect("back");
	}
	console.info("[MW] verifySelf-out-1".bgWhite.blue);
	next();
};

/**
 * Asynchronously updates user details based on the input provided in the request body.
 * @param {object} req The request object, containing user input data.
 * @param {object} res The response object, used to send back the updated user data.
 * @param {function} next Callback function to pass control to the next middleware.
 * @returns Calls the next middleware with updated user data or an error.
 */
const updateUser = async (req, res, next) => {
	console.info("[MW] updateUser-in".bgBlue.white);
	try {
		const {
			name,
			email,
			theme,
			sortField,
			sortDirection,
			pageSize,
			developer,
		} = req.body;
		const existingUser = await User.findById(req.body.id);
		if (name){ existingUser.name = name;}
		if (email) {existingUser.email = email;}
		if (theme) {existingUser.set("preferences.theme", theme);}
		if (sortField) {existingUser.set("preferences.sortField", sortField);}
		if (sortDirection) {existingUser.set("preferences.sortDirection", sortDirection);}
		if (pageSize !== undefined) {existingUser.set("preferences.pageSize", pageSize);}
		if (developer === undefined) {existingUser.set("preferences.developer", false);}
		else {existingUser.set("preferences.developer", true);}
		await existingUser.save();
		if (req.user._id.toString() === existingUser._id.toString()) {
			req.user = existingUser;
		}

		console.info("[MW] updateUser-out".bgWhite.blue);
		return next();
	} catch (error) {
		console.error(error);
		res.status(500);
		res.locals.error = "Something went wrong";
		console.info("[MW] updateUser-out-1".bgRed.black);
		return next();
	}
};

/**
 * Resets a user's password.
 * This function validates the new password and confirm password fields, hashes the new password, and updates it in the database.
 * @param {object} req - The request object containing the body with user ID, new password, and confirm password.
 * @param {object} res - The response object used to send responses to the client.
 * @param {function} next - The next middleware function in the stack.
 * @returns {Promise<void>} Executes the next middleware function.
 */
const resetPassword = async (req, res, next) => {
	console.info("[MW] resetPassword-in".bgBlue.white);

	const { _id, password, confirmPassword } = req.body;

	// if new password and confirm password are not set
	if (!password || !confirmPassword) {
		res.locals.message = "New password and confirm password are required";
		console.info("[MW] resetPassword-out-1".bgWhite.blue);
		res.status(400).redirect("back");
		return;
	}

	// if new password and confirm password do not match
	if (password !== confirmPassword) {
		res.locals.error = "New password and confirm password must match";
		console.info("[MW] resetPassword-out-2".bgWhite.blue);
		res.status(400).redirect("back");
		return;
	}

	try {
		const targetUser = await User.findById(_id);
		targetUser.password = password;
		targetUser.save();
		console.info("[MW] resetPassword-out-4".bgWhite.blue);
		next();
	} catch (error) {
		console.error(`[MW] resetPassword-error: ${error.message}`.bgRed.white);
		res.locals.error = "An error occurred while resetting the password";
		res.status(500).redirect("back");
	}
};

/**
 * Disables a user by setting the isDisabled flag to true in the database.
 * @param {object} req - The request object containing the user ID.
 * @param {object} res - The response object used to send responses to the client.
 * @param {function} next - The next middleware function in the stack.
 * @returns {Promise<void>} Executes the next middleware function.
 */
const disableUser = async (req, _res, next) => {
	console.info("[MW] disableUser-in".bgBlue.white);
	await User.findByIdAndUpdate(req.params.id, { $set: { isDisabled: true } });
	console.info("[MW] disableUser-out".bgBlue.white);
	next();
};

const deleteUser = async (req, res, next) => {
	console.info("[MW] deleteUser-in".bgBlue.white);
	const targetUser = await User.findById(req.params.id);
	if (targetUser._id !== req.user._id) {
		await User.findByIdAndDelete(req.params.id);
	} else {
		res.locals.error = "You cannot delete your own user account.";
		res.status(400).redirect("back");
		return;
	}
	console.info("[MW] deleteUser-out".bgBlue.white);
	next();
};

export {
	resetPassword,
	getUsers,
	createUserInTenant,
	verifySelf,
	updateUser,
	disableUser,
	getUserByID,
	deleteUser,
};

// src\middleware\user.js

import mongoose from "mongoose";
import { Tenant } from "../models/index.models.js";
import { User } from "../models/index.models.js";
import { sendEmail, getDomainFromEmail } from "../controllers/util.js";

// Utility function to generate a random password
const generatePassword = () => {
	const tools = ["Hammer", "Drill", "Wrench", "Saw", "Screwdriver", "Pliers"];
	const randomTool = tools[Math.floor(Math.random() * tools.length)];
	const randomNumbers = Math.floor(100 + Math.random() * 900).toString(); // 3 random digits
	return `${randomTool}${randomNumbers}`;
};

export const createTenant = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { tenantName, adminEmail } = req.body;
		const domain = getDomainFromEmail(adminEmail);
		// Check if the admin user already exists
		let adminUser = await User.findOne({ email: adminEmail }).session(session);

		if (!adminUser) {
			const password = generatePassword();

			// Create the Tenant document first without the adminUser field
			const tenant = new Tenant({
				name: tenantName,
				domain: domain,
				subscriptionTier: "default",
				subscriptionStatus: "inactive",
			});

			await tenant.save({ session });

			// Now create the User document with the tenant reference
			adminUser = new User({
				email: adminEmail,
				password,
				role: "admin",
				tenant: tenant._id, // Assign the tenant to the user
			});

			await adminUser.save({ session });

			// Update the Tenant document with the adminUser reference
			tenant.adminUser = adminUser._id;
			await tenant.save({ session });

			// Send an email to the new admin user with their credentials
			const subject = "Your ToolKeeper Admin Account";
			const text = `Your admin account for ToolKeeper has been created. Your login credentials are:\n\nEmail: ${adminEmail}\nPassword: ${password}\n\nPlease log in and change your password as soon as possible.`;

			await sendEmail(adminEmail, subject, text);
		}

		// Commit the transaction if everything is successful
		await session.commitTransaction();
		session.endSession();

		req.tenant = tenant;
		next();
	} catch (error) {
		// Abort the transaction in case of an error
		await session.abortTransaction();
		session.endSession();
		res.status(400).render("error", { message: error.message });
	}
};

/**
 * Middleware to fetch all tenants, split them into active and inactive, and hoist them to res.locals.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const getTenants = async (req, res, next) => {
	try {
		// Fetch all tenants from the database
		const tenants = await Tenant.find();

		// Split tenants into active and inactive groups
		const activeTenants = tenants.filter(
			(tenant) => tenant.subscriptionStatus === "active",
		);
		const inactiveTenants = tenants.filter(
			(tenant) => tenant.subscriptionStatus === "inactive",
		);

		// Hoist active and inactive tenants to res.locals
		res.locals.activeTenants = activeTenants;
		res.locals.inactiveTenants = inactiveTenants;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		// Handle any errors that occur during the database query
		res
			.status(500)
			.render("error", { message: "Failed to load tenants", error });
	}
};

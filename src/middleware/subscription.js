import {
	Subscription,
	User,
	Tenant,
	PendingUser,
} from "../models/index.models.js";
import { generatePassword } from "../middleware/tenant.js";
import { getDomainFromEmail, sendEmail } from "../controllers/util.js";
import { secret } from "../config/lemonSqueezy.js";
import { createHmac, timingSafeEqual } from "node:crypto";

const getInstanceUrl = () => {
	return process.env.NODE_ENV === "production"
		? "https://toolkeeper.site"
		: "https://dev.toolkeeper.site";
};

// Verify the X-Signature to ensure the request is legitimate
const verifySignature = (req) => {
	try {
		const hmac = createHmac("sha256", secret);
		const digest = Buffer.from(hmac.update(req.rawBody).digest("hex"), "utf8");
		const signature = Buffer.from(req.get("X-Signature") || "", "utf8");

		if (!timingSafeEqual(digest, signature)) {
			throw new Error("Invalid signature");
		}
	} catch (error) {
		console.error("Error verifying signature:", error.message);
		throw error;
	}
};

// Create a new user based on pending user data
const createUserFromPending = async (pendingUser) => {
	try {
		const newPassword = generatePassword();

		const activeUser = await User.create({
			firstName: pendingUser.firstName,
			lastName: pendingUser.lastName,
			email: pendingUser.email,
			password: newPassword,
			role: "Admin",
		});

		return { activeUser, newPassword };
	} catch (error) {
		console.error("Error creating user from pending data:", error.message);
		throw error;
	}
};

// Create a new tenant and associate the user as admin
const createTenantForUser = async (activeUser, pendingUser) => {
	try {
		const tenantData = {
			name: pendingUser.companyName,
			domain: getDomainFromEmail(activeUser.email),
			adminUser: activeUser._id, // Assign the admin user to the tenant
		};

		return await Tenant.createWithDefaults(tenantData);
	} catch (error) {
		console.error("Error creating tenant for user:", error.message);
		throw error;
	}
};

// Create a subscription in the database
const createSubscription = async (subscriptionData, activeUser, tenant) => {
	try {
		return await Subscription.create({
			user: activeUser._id,
			tenant: tenant._id,
			status: "active",
			lemonSqueezyId: subscriptionData.id, // Use subscription ID from webhook
			lemonSqueezyObject: subscriptionData.attributes, // Store full subscription details
		});
	} catch (error) {
		console.error("Error creating subscription:", error.message);
		throw error;
	}
};

// Send a welcome email to the new user
const sendWelcomeEmail = async (pendingUser, activeUser, newPassword) => {
	try {
		const instanceUrl = getInstanceUrl();
		const emailSubject = "Welcome to ToolKeeper!";
		const emailBody = `Dear ${pendingUser.firstName},\n\nYour ToolKeeper account has been created successfully. Your login credentials are:\n\nEmail: ${pendingUser.email}\nPassword: ${newPassword}\n\nPlease log in to your account at ${instanceUrl} and change your password immediately.\n\nBest regards,\nThe ToolKeeper Team`;

		await sendEmail(activeUser.email, emailSubject, emailBody);
	} catch (error) {
		console.error("Error sending welcome email:", error.message);
		throw error;
	}
};

// Main subscription webhook handler
const subscriptionCreatedWebhookHandler = async (req, res) => {
	try {
		// Verify the request signature
		verifySignature(req);

		// Parse the raw body into JSON
		const webhookPayload = JSON.parse(req.rawBody.toString("utf8"));
		const subscriptionData = webhookPayload.data;
		const userEmail = subscriptionData?.attributes?.user_email;

		// Find the pending user
		const pendingUser = await PendingUser.findOne({ email: userEmail });
		if (!pendingUser) {
			return res.status(400).json({ error: "Pending user not found." });
		}

		// Create the user and assign a password
		const { activeUser, newPassword } =
			await createUserFromPending(pendingUser);

		// Create the tenant and associate it with the user
		const tenant = await createTenantForUser(activeUser, pendingUser);

		// Create a new subscription linked to the user and tenant
		await createSubscription(subscriptionData, activeUser, tenant);

		// Assign the tenant to the user
		activeUser.tenant = tenant._id;
		await activeUser.save();

		// Delete the pending user
		await pendingUser.deleteOne();

		// Send a welcome email to the user
		await sendWelcomeEmail(pendingUser, activeUser, newPassword);

		// Send a success response
		res.status(200).json({
			message: "Subscription created, tenant assigned, and user updated.",
		});
	} catch (error) {
		// Centralized error handling
		console.error("Error processing subscription webhook:", error.message);
		res.status(500).json({ error: "Internal server error." });
	}
};

export { subscriptionCreatedWebhookHandler };

// src\middleware\subscription.js

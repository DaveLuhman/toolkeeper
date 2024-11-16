import {
	Subscription,
	User,
	Tenant,
	Prospect,
} from "../models/index.models.js";
import { generatePassword } from "../middleware/tenant.js";
import { getDomainFromEmail, sendEmail } from "../controllers/util.js";
import { secret } from "../config/lemonSqueezy.js";
import { createHmac, timingSafeEqual } from "node:crypto";
import logger from "../logging/index.js";

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
		logger.error("Error verifying signature:", error.message);
		throw error;
	}
};

// Create a new user based on pending user data
const createUserFromProspect = async (prospect) => {
	try {
		const newPassword = generatePassword();

		const activeUser = await User.create({
			firstName: prospect.firstName,
			lastName: prospect.lastName,
			email: prospect.email,
			password: newPassword,
			role: "Admin",
		});

		return { activeUser, newPassword };
	} catch (error) {
		logger.error("Error creating user from pending data:", error.message);
		throw error;
	}
};

// Create a new tenant and associate the user as admin
const createTenantForUser = async (activeUser, prospect) => {
	try {
		const tenantData = {
			name: prospect.companyName,
			domain: getDomainFromEmail(activeUser.email),
			adminUser: activeUser._id, // Assign the admin user to the tenant
		};

		return await Tenant.createWithDefaults(tenantData);
	} catch (error) {
		logger.error("Error creating tenant for user:", error.message);
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
		logger.error("Error creating subscription:", error.message);
		throw error;
	}
};

// Send a welcome email to the new user
const sendWelcomeEmail = async (prospect, activeUser, newPassword) => {
	try {
		const instanceUrl = getInstanceUrl();
		console.log(instanceUrl)
		const emailSubject = "Welcome to ToolKeeper!";
		const emailBody = `Dear ${prospect.firstName},\n\nYour ToolKeeper account has been created successfully. Your login credentials are:\n\nEmail: ${prospect.email}\nPassword: ${newPassword}\n\nPlease log in to your account at ${instanceUrl} and change your password immediately.\n\nBest regards,\nThe ToolKeeper Team`;

		await sendEmail(activeUser.email, emailSubject, emailBody);
	} catch (error) {
		logger.error("Error sending welcome email:", error.message);
		throw error;
	}
};

const createProspectFromSubscriptionData = (subscriptionData) => {
	const names = subscriptionData.attributes.user_name.split(" ");
	return {
		firstName: names[0],
		lastName: names[1],
		email: subscriptionData.attributes.user_email,
		companyName: `${subscriptionData.attributes.user_name}'s Tools`,
	};
};

const handleSubscriptionEvent = async (eventType, subscriptionData) => {
	let status;
	switch (eventType) {
		case "subscription_cancelled":
			status = "cancelled";
			break;
		case "subscription_resumed":
			status = "active";
			break;
		case "subscription_expired":
			status = "expired";
			break;
		case "subscription_created": {
			const prospect = createProspectFromSubscriptionData(subscriptionData);
			const { activeUser, newPassword } =
				await createUserFromProspect(prospect);
			const tenant = await createTenantForUser(activeUser, prospect);
			await createSubscription(subscriptionData, activeUser, tenant);
			await sendWelcomeEmail(prospect, activeUser, newPassword);
			return "Subscription created, user and tenant created, and welcome email sent.";
		}
		default:
			throw new Error("Unhandled event type");
	}

	// Find the subscription and update its status
	const subscription = await Subscription.findOneAndUpdate(
		{ lemonSqueezyId: subscriptionData.id },
		{ status: status },
		{ new: true },
	);

	if (!subscription) {
		throw new Error("Subscription not found");
	}

	return `Subscription ${status} and updated.`;
};

const handleWebhookEvent = async (req, res) => {
	let eventType = "unknown"; // Initialize eventType for error logging
	try {
		// Validate request body
		if (!req.rawBody) {
			return res.status(400).json({ error: "Missing request body" });
		}

		// Verify the request signature
		try {
			verifySignature(req);
		} catch (error) {
			return res.status(401).json({ error: "Invalid signature" });
		}

		// Parse the raw body into JSON
		let webhookPayload;
		try {
			webhookPayload = JSON.parse(req.rawBody.toString("utf8"));
		} catch (error) {
			return res.status(400).json({ error: "Invalid JSON payload" });
		}

		// Validate webhook payload structure
		if (!webhookPayload.data || !webhookPayload.meta || !webhookPayload.meta.event_name) {
			console.log(webhookPayload)
			return res
				.status(400)
				.json({ error: "Invalid webhook payload structure" });
		}

		const subscriptionData = webhookPayload.data;
		eventType = webhookPayload.meta.event_name;

		// Validate subscription data
		if (!subscriptionData.id || !subscriptionData.attributes) {
			return res.status(400).json({ error: "Invalid subscription data" });
		}

		// Handle the subscription event
		const message = await handleSubscriptionEvent(eventType, subscriptionData);

		// Log successful operation
		console.log(
			`Successfully processed ${eventType} webhook for subscription ${subscriptionData.id}`,
		);

		// Send a success response
		return res.status(200).json({
			success: true,
			message: message,
		});
	} catch (error) {
		// Determine appropriate status code based on error type
		let statusCode = 500;
		let errorMessage = "Internal server error";

		if (error.message === "Unhandled event type") {
			statusCode = 400;
			errorMessage = `Unsupported webhook event type: ${eventType}`;
		} else if (error.message === "Subscription not found") {
			statusCode = 404;
			errorMessage = `Subscription not found for event: ${eventType}`;
		}

		// Log the detailed error for debugging
		logger.error(`Error processing ${eventType} webhook:`, {
			error: error.message,
			stack: error.stack,
			eventType,
		});

		// Send error response
		return res.status(statusCode).json({
			success: false,
			error: errorMessage,
		});
	}
};

export default handleWebhookEvent;

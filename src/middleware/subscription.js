import {
	Subscription,
	User,
	Tenant,
	Prospect,
	Onboarding,
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

		// Initialize onboarding for the new user
		try {
			await Onboarding.create({
				user: activeUser._id,
				tenant: null, // Will be updated after tenant creation
				steps: {
					profileSetup: false,
					categoryCreated: false,
					serviceAssignmentCreated: false,
					firstToolAdded: false,
					csvImportUsed: false,
					userInvited: false,
					preferencesCustomized: false
				},
				progress: {
					currentStep: 'profile',
					completedAt: null
				}
			});
			logger.info(`Initialized onboarding for user ${activeUser._id}`);
		} catch (onboardingError) {
			logger.error("Error initializing onboarding:", onboardingError);
			await User.findByIdAndDelete(activeUser._id);
			throw new Error('Failed to initialize user onboarding');
		}

		return { activeUser, newPassword };
	} catch (error) {
		logger.error("Error in createUserFromProspect:", error.message);
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
		const subscription = await Subscription.create({
			user: activeUser._id,
			tenant: tenant._id,
			status: "active",
			lemonSqueezyId: subscriptionData.id,
			lemonSqueezyObject: subscriptionData.attributes,
		});

		// Update the onboarding document with the tenant ID
		await Onboarding.findOneAndUpdate(
			{ user: activeUser._id },
			{ tenant: tenant._id }
		);

		return subscription;
	} catch (error) {
		logger.error("Error creating subscription:", error.message);
		throw error;
	}
};

// Send a welcome email to the new user
const sendWelcomeEmail = async (prospect, activeUser, newPassword) => {
	try {
		const instanceUrl = getInstanceUrl();
		const emailSubject = "Welcome to ToolKeeper - Let's Get Started!";

		const emailBody = `
Dear ${prospect.firstName},

Welcome to ToolKeeper! Your account has been successfully created. Here's everything you need to get started:

🔐 Your Login Credentials:
Email: ${prospect.email}
Password: ${newPassword}

🚀 Quick Start Guide:
1. Login at ${instanceUrl}
2. Change your password immediately
3. Complete your company profile
4. Invite your team members
5. Start managing your tools inventory

💡 Key Features:
• Tool Inventory Management
• Team Collaboration
• Real-time Tracking
• Custom Reports

🔍 Need Help?
• Visit our documentation: ${instanceUrl}/docs
• Contact support: support@toolkeeper.site
• Join our community: ${instanceUrl}/community

We're excited to have you on board!

Best regards,
The ToolKeeper Team`;

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

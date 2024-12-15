import {
	Subscription,
	User,
	Tenant,
	Onboarding,
} from "../models/index.models.js";
import { generatePassword } from "../middleware/tenant.js";
import { getDomainFromEmail, sendEmail } from "../controllers/util.js";

import logger from "../logging/index.js";
import process from "node:process";

/**
 * DetermineUserLimit - Determines the user limit based on the variant name.
 * @param {string} variantName - The name of the subscription variant.
 * @returns {object} - An object containing the user limit and plan name.
 */
export function determineUserLimit(variantName) {
	const firstLetter = variantName.charAt(0).toUpperCase();
	let userLimit;
	let planName;

	switch (firstLetter) {
		case "P":
			userLimit = 5;
			planName = "Pro";
			break;
		case "E":
			userLimit = Number.POSITIVE_INFINITY;
			planName = "Enterprise";
			break;
		default:
			userLimit = 1;
			planName = "Basic";
	}

	return { userLimit, planName };
}

const getInstanceUrl = () => {
	return process.env.NODE_ENV === "production"
		? "https://toolkeeper.site"
		: "https://dev.toolkeeper.site";
};

// Send a welcome email to the new user
const sendWelcomeEmail = async (newUser, newPassword) => {
	try {
		const instanceUrl = getInstanceUrl();
		const emailSubject = "Welcome to ToolKeeper - Let's Get Started!";

		const emailBody = `
Dear ${newUser.name},

Welcome to ToolKeeper! Your account has been successfully created. Here's everything you need to get started:

	Your Login Credentials:
Email: ${newUser.email}
Password: ${newPassword}

	Quick Start Guide:
1. Login at ${instanceUrl}/login
2. Change your password immediately
3. Complete your company profile
4. Invite your team members
5. Start managing your tools inventory

	Key Features:
• Tool Inventory Management
• Team Collaboration
• Custom Reports

	Need Help?
• Visit our documentation: ${instanceUrl}/docs
• Contact support: support@toolkeeper.site


We're excited to have you on board!

Best regards,
The ToolKeeper Team`;

		await sendEmail(newUser.email, emailSubject, emailBody);
	} catch (error) {
		logger.error("Error sending welcome email:", error.message);
		throw error;
	}
};

export const handleWebhook = async (eventType, subscriptionData) => {
	try {
		const subscriptionId = subscriptionData.id;

		// Handle subscription creation separately
		if (eventType === "subscription_created") {
			try {
				// Create the admin user
				const newPassword = generatePassword();
				const newAdminUser = await User.create({
					name: subscriptionData.attributes.user_name,
					email: subscriptionData.attributes.user_email,
					password: newPassword,
					role: "Admin",
				});

				// Initialize onboarding
				await Onboarding.create({
					user: newAdminUser._id,
				});

				// Create tenant
				const tenant = await Tenant.createWithDefaults({
					domain: getDomainFromEmail(newAdminUser.email),
					adminUser: newAdminUser._id,
				});

				// Update user with tenant
				newAdminUser.tenant = tenant._id;
				await newAdminUser.save();

				// Create subscription using static method
				await Subscription.createFromWebhook(
					newAdminUser._id,
					tenant._id,
					subscriptionData,
				);

				// Send welcome email
				await sendWelcomeEmail(newAdminUser, newPassword);

				logger.info(`New subscription created: ${subscriptionId}`);
				return "Subscription created successfully";
			} catch (error) {
				logger.error("Error in subscription creation:", error);
				throw error;
			}
		}

		// For all other events, find and update the subscription
		const subscription = await Subscription.findOne({
			lemonSqueezyId: subscriptionId,
		});

		if (!subscription) {
			throw new Error(`Subscription not found: ${subscriptionId}`);
		}

		// Update the lemonSqueezyObject with the latest data
		subscription.lemonSqueezyObject = subscriptionData.attributes;
		await subscription.save();

		// Log the event
		switch (eventType) {
			case "subscription_updated":
				logger.info(`Subscription updated: ${subscriptionId}`);
				break;
			case "subscription_cancelled":
				logger.info(`Subscription cancelled: ${subscriptionId}`);
				break;
			case "subscription_resumed":
				logger.info(`Subscription resumed: ${subscriptionId}`);
				break;
			case "subscription_expired":
				logger.info(`Subscription expired: ${subscriptionId}`);
				break;
			case "subscription_paused":
				logger.info(`Subscription paused: ${subscriptionId}`);
				break;
			case "subscription_unpaused":
				logger.info(`Subscription unpaused: ${subscriptionId}`);
				break;
			case "subscription_payment_success":
				logger.info(`Subscription payment success: ${subscriptionId}`);
				break;
			case "subscription_payment_failed":
				logger.info(`Subscription payment failed: ${subscriptionId}`);
				break;
			case "subscription_payment_updated":
				logger.info(`Subscription payment updated: ${subscriptionId}`);
				break;
			default:
				logger.warn(`Unhandled subscription event type: ${eventType}`);
		}

		return "Subscription updated successfully";
	} catch (error) {
		logger.error(`Error handling webhook event: ${eventType}`, {
			error: error.message,
			subscriptionData,
		});
		throw error;
	}
};

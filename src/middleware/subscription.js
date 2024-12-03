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
		case 'P':
			userLimit = 5;
			planName = 'Pro';
			break;
		case 'E':
			userLimit = Number.POSITIVE_INFINITY;
			planName = 'Enterprise';
			break;
		default:
			userLimit = 1;
			planName = 'Basic';
	}

	return { userLimit, planName };
}

const getInstanceUrl = () => {
	return process.env.NODE_ENV === "production"
		? "https://toolkeeper.site"
		: "https://dev.toolkeeper.site";
};


// Create a new user based on pending user data
const createUserFromProspect = async (prospect) => {
	try {
		const newPassword = generatePassword();

		const activeUser = await User.create({
			name: prospect.name,
			email: prospect.email,
			password: newPassword,
			role: "Admin",
		});

		// Initialize onboarding for the new user
		try {
			await Onboarding.create({
				user: activeUser._id,
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
const createTenantForUser = async (newUser) => {
	try {
		const tenantData = {
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

		return subscription;
	} catch (error) {
		logger.error("Error creating subscription:", error.message);
		throw error;
	}
};

// Send a welcome email to the new user
const sendWelcomeEmail = async (newUser, newPassword) => {
	try {
		const instanceUrl = getInstanceUrl();
		const emailSubject = "Welcome to ToolKeeper - Let's Get Started!";

		const emailBody = `
Dear ${newUser.name},

Welcome to ToolKeeper! Your account has been successfully created. Here's everything you need to get started:

🔐 Your Login Credentials:
Email: ${newUser.email}
Password: ${newPassword}

🚀 Quick Start Guide:
1. Login at ${instanceUrl}/login
2. Change your password immediately
3. Complete your company profile
4. Invite your team members
5. Start managing your tools inventory

💡 Key Features:
• Tool Inventory Management
• Team Collaboration
• Custom Reports

🔍 Need Help?
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

export const handleSubscriptionEvent = async (eventType, subscriptionData) => {
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
		case "subscription_paused":
			status = "paused";
			break;
		case "subscription_unpaused":
			status = "active";
			break;
		case "subscription_created": {
			const newPassword = generatePassword();
			const newAdminUser = await User.create({
				name: subscriptionData.attributes.user_name,
				email: subscriptionData.attributes.user_email,
				password: newPassword,
				role: "Admin",
			});
			await Onboarding.create({
				user: newAdminUser._id,
			});
			const tenant = await Tenant.create({
				domain: getDomainFromEmail(newAdminUser.email),
				adminUser: newAdminUser._id,
			});
			newAdminUser.tenant = tenant._id;
			await newAdminUser.save();
			await Subscription.create({
				user: newAdminUser._id,
				tenant: tenant._id,
				status: "active",
				lemonSqueezyId: subscriptionData.id,
				lemonSqueezyObject: subscriptionData.attributes,
			});
			await sendWelcomeEmail(newAdminUser, newPassword);
			return "Subscription created, user and tenant created, and welcome email sent.";
		}
		case "subscription_updated": {
			status = "updated";
			break;
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




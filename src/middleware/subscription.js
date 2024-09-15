import {
	Subscription,
	User,
	Tenant,
	PendingUser,
} from "../models/index.models.js"; // Subscription model
import { generatePassword } from "../middleware/tenant.js"; // Password generation utility
import { getDomainFromEmail, sendEmail } from "../controllers/util.js"; // Email utility
import { secret } from "../config/lemonSqueezy.js"; // Signature for webhook verification
import { createHmac, timingSafeEqual } from "node:crypto";
// Utility function to generate ToolKeeper instance URL
const getInstanceUrl = () => {
	return process.env.NODE_ENV === "production"
		? "https://toolkeeper.site"
		: "https://dev.toolkeeper.site";
};

const subscriptionCreatedWebhookHandler = async (req, res, next) => {
	// Verify the X-Signature header from LemonSqueezy
	const hmac = createHmac("sha256", secret);
	const digest = Buffer.from(hmac.update(req.rawBody).digest("hex"), "utf8");
	const signature = Buffer.from(req.get("X-Signature") || "", "utf8");

	if (!timingSafeEqual(digest, signature)) {
		return res.send(304).json("Invalid signature");
	}

	try {
		const webhookPayload = JSON.parse(req.rawBody.toString('utf8')); // convert the payload back to an object
    const subscriptionData = webhookPayload.data
		const userEmail = subscriptionData?.attributes?.user_email; // Assuming user_id is part of the webhook payload

		// Find the pending user based on userId
		const pendingUser = await PendingUser.findOne({
			email: userEmail,
		});

		if (!pendingUser) {
			return res.status(400).json({ error: "Pending user not found." });
		}
		// Generate a password for the user
		const newPassword = generatePassword();
		// Create a User document using the data from the pendingUser document
		const activeUser = await User.create({
			firstName: pendingUser.firstName,
			lastName: pendingUser.lastName,
			email: pendingUser.email,
			password: newPassword,
			role: "Admin",
		});
		// Create the tenant using the Tenant model's static method (assuming tenantName is passed in subscription data)
		const tenantData = {
			name: pendingUser.companyName,
			domain: getDomainFromEmail(activeUser.email),
			adminUser: activeUser._id, // Assign the admin user to the tenant
		};
		const tenant = await Tenant.createWithDefaults(tenantData);

		// Create a new subscription entry
		await Subscription.create({
			userId: activeUser._id,
			tenantId: tenant._id,
			status: "active", // Set subscription as active
			lemonSqueezyId: subscriptionData.id, // Use subscription ID from webhook
			lemonSqueezyObject: subscriptionData.attributes, // Store full subscription details
		});

		// Update the user's status to active and assign the tenant to the user
		activeUser.tenant = tenant._id;
		await activeUser.save();

		await pendingUser.deleteOne()

		// Prepare and send the welcome email
		const instanceUrl = getInstanceUrl();
		const emailSubject = "Welcome to ToolKeeper!";
		const emailBody = `Dear ${pendingUser.firstName},\n\nYour ToolKeeper account has been created successfully. Your login credentials are:\n\nEmail: ${pendingUser.email}\nPassword: ${newPassword}\n\nPlease log in to your account at ${instanceUrl} and change your password immediately.\n\nBest regards,\nThe ToolKeeper Team`;

		await sendEmail(activeUser.email, emailSubject, emailBody);

		// Send success response to the webhook
		res.status(200).json({
			message: "Subscription created, tenant assigned, and user updated.",
		});
	} catch (error) {
		console.error("Error processing subscription webhook:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};

export { subscriptionCreatedWebhookHandler };

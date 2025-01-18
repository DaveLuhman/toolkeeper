import logger from "../logging/index.js";
import { handleWebhook } from "../middleware/subscription.js";
import { signingSecret } from "../config/lemonSqueezy.js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

// Verify the X-Signature to ensure the request is legitimate
const verifySignature = (req) => {
	try {
		const hmac = createHmac("sha256", signingSecret);
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
		const message = await handleWebhook(eventType, subscriptionData);

		// Log successful operation
		logger.info(
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

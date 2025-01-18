export const signingSecret = process.env.SIGNING_SECRET;
import { lemonSqueezySetup, listProducts } from "@lemonsqueezy/lemonsqueezy.js";
import process from "node:process";

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });

export const toolkeeperProductObject = async () => {
	try {
		const response = await listProducts();
		// Ensure we're working with the correct data structure
		const products = Array.isArray(response.data) ? response.data : response.data?.data || [];

		const toolkeeper = products.find(
			(product) => product.attributes.slug === "toolkeeper"
		);

		if (!toolkeeper) {
			throw new Error("Toolkeeper product not found");
		}

		return toolkeeper.attributes;
	} catch (err) {
		console.error("Error fetching Toolkeeper product:", err.message);
		throw err;
	}
};

export const checkoutUrl = async () => {
	const attributes = await toolkeeperProductObject();
	return attributes.buy_now_url;
};

export const inTestMode = async () => {
	const attributes = await toolkeeperProductObject();
	return attributes.test_mode;
};

export default toolkeeperProductObject;
// src\config\lemonSqueezy.js

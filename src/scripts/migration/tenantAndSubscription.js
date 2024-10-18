import { Tenant } from "../../models/index.models.js";
export async function createTenantAndSubscription() {
	const tenantId = await Tenant.findOne({ name: "Forward Electric" }).lean();
	return tenantId._id; // Return the tenant ID as a string to use in other migrations
}

// src\scripts\migration\tenantAndSubscription.js

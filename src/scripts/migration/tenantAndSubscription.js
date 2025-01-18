import { Subscription, Tenant } from "../../models/index.models.js";
export async function createTenantAndSubscription() {
	const tenant = await Tenant.create({ name: "Forward Electric", domain: "forwardelectric.com", adminUser: "663870c0a1a9cdb4b707c737" })
	const subscription = await Subscription.create({
		tenant: tenant._id,
		lemonSqueezyId: "1234567890",
	})
	return tenant._id; // Return the tenant ID as a string to use in other migrations
}

// src\scripts\migration\tenantAndSubscription.js

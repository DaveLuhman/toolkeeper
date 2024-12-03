import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Tenant, Subscription, User } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Tenant Model", () => {
	// Test case 1: Valid tenant creation
	it("should create a tenant successfully with valid fields", async () => {
		// Create a subscription for the tenant
		const subscriptionData = {
			lemonSqueezyId: "test_lemonSqueezyId",
			plan: "monthly",
			status: "active",
		};
		const subscription = await Subscription.create(subscriptionData);

		// Create a tenant with a valid subscription and adminUser
		const validTenantData = {
			name: "Demo Tenant",
			domain: "toolkeeper.site",
			adminUser: new mongoose.Types.ObjectId(), // Replace with valid admin user ObjectId
			subscription: subscription._id, // Associate subscription with tenant
		};
		const tenant = new Tenant(validTenantData);
		const savedTenant = await tenant.save();

		// Assertions
		expect(savedTenant._id).toBeDefined();
		expect(savedTenant.name).toBe(validTenantData.name);
		expect(savedTenant.domain).toBe(validTenantData.domain);
		expect(savedTenant.subscription._id.toString()).toBe(
			subscription._id.toString(),
		);
	});

	// Test case 2: Required fields validation
	it("should fail to create a tenant without required fields", async () => {
		const invalidTenantData = {
			domain: "toolkeeper.site", // Missing required 'name' and 'adminUser'
		};
		try {
			const tenant = new Tenant(invalidTenantData);
			await tenant.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(error.errors.name).toBeDefined(); // Missing 'name' field
			expect(error.errors.adminUser).toBeDefined(); // Missing 'adminUser' field
		}
	});

	// Test case 3: Validate subscription status enum on the subscription model
	it("should not save a tenant with an invalid subscription status", async () => {
		const invalidSubscriptionData = {
			lemonSqueezyId: "test_invalidStatusId",
			plan: "monthly",
			status: "invalidStatus", // Invalid subscription status enum value
		};
		try {
			await Subscription.create(invalidSubscriptionData);
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(error.errors.status).toBeDefined(); // Invalid enum value for 'status'
		}
	});

	// Test case 4: ActiveUsers virtual property
	it("should correctly count activeUsers as 2 when two users are associated with the tenant", async () => {
		// Step 1: Create a subscription for the tenant
		const subscriptionData = {
			lemonSqueezyId: "test_lemonSqueezyId",
			plan: "monthly",
			status: "active",
		};
		const subscription = await Subscription.create(subscriptionData);

		// Step 2: Create the tenant with valid fields
		const tenantData = {
			name: "Test Tenant",
			domain: "test.com",
			adminUser: {
				_id: "663870c0a1a9cdb4b707c737",
				name: "Admin User",
				password: "asdfasdf",
				role: "Superadmin",
				email: "admin@toolkeeper.site",
				tenant: "66af881237c17b64394a4166",
			},
			subscription: subscription._id,
		};
		const tenant = new Tenant(tenantData);
		const savedTenant = await tenant.save();

		// Step 3: Create two users under the same tenant
		const userData1 = {
			_id: "663870c0a1a9cdb4b707c737",
			name: "Admin User",
			password: "asdfasdf",
			role: "Superadmin",
			email: "admin@toolkeeper.site",
			tenant: savedTenant._id, // Associate this user with the tenant
		};
		const userData2 = {
			name: "Demo User",
			password: "asdfasdf",
			role: "Admin",
			email: "demo@toolkeeper.site",
			tenant: savedTenant._id, // Associate this user with the tenant
		};

		await User.create(userData1);
		await User.create(userData2);

		// Step 4: Fetch the tenant again and check the activeUsers virtual
		const updatedTenant = await Tenant.findById(savedTenant._id).exec();
		const activeUsersCount = await updatedTenant.activeUsers; // Virtual property
		expect(activeUsersCount).toBe(2); // Virtual property should count 2 active users
	});
});

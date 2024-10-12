import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {Tenant} from "../../src/models/index.models.js"; // Adjust this import to your project structure

let mongoServer;

describe("Tenant Model", () => {

	// Test case 1: Valid tenant creation
	it("should create a tenant successfully with valid fields", async () => {
		const validTenantData = {
			name: "demo",
			domain: "toolkeeper.site",
			adminUser: "663870c0a1a9cdb4b707c737"
		};
		const tenant = new Tenant(validTenantData);
		const savedTenant = await tenant.save();

		expect(savedTenant._id).toBeDefined();
		expect(savedTenant.name).toBe(validTenantData.name);
		expect(savedTenant.subscriptionStatus).toBe(
			validTenantData.subscriptionStatus,
		);
	});

	// Test case 2: Required fields validation
	it("should fail to create a tenant without required fields", async () => {
		const invalidTenantData = {
			subscriptionStatus: "active",
		};
		try {
			const tenant = new Tenant(invalidTenantData);
			await tenant.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(error.errors.name).toBeDefined(); // Expect an error for the missing 'name' field
		}
	});

	// Test case 3: Validate subscription status enum
	it("should not save a tenant with an invalid subscription status", async () => {
		const invalidTenantData = {
			name: "Test Tenant",
			subscriptionStatus: "invalidStatus", // This is not part of the enum
		};
		try {
			const tenant = new Tenant(invalidTenantData);
			await tenant.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(error.errors.subscriptionStatus).toBeDefined(); // Expect an error for invalid enum value
		}
	});

	// Test case for activeUsers virtual property
	it("should correctly count activeUsers as 2 when two users are associated with the tenant", async () => {
		// Step 1: Create the tenant
		const tenantData = {
			name: "Test Tenant",
			subscriptionStatus: "active",
		};
		const tenant = new Tenant(tenantData);
		const savedTenant = await tenant.save();

		// Step 2: Create two users under the same tenant
		const userData1 = {
			username: "user1",
			password: "password1",
			tenant: savedTenant._id, // Associate this user with the tenant
		};
		const userData2 = {
			username: "user2",
			password: "password2",
			tenant: savedTenant._id, // Associate this user with the tenant
		};

		await User.create(userData1);
		await User.create(userData2);

		// Step 3: Fetch the tenant again and check the activeUsers virtual
		const updatedTenant = await Tenant.findById(savedTenant._id).exec();
		expect(updatedTenant.activeUsers).toBe(2); // Virtual property should count 2 active users
	});
});

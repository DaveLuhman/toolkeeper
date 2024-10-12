import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Subscription, User, Tenant } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Subscription Model", () => {
  // Test case 1: Valid subscription creation
  it("should create a subscription successfully with valid fields", async () => {
    // Step 1: Create a user and tenant for the subscription
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    const user = await User.create(userData);

    const tenantData = {
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: user._id,
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create the subscription
    const validSubscriptionData = {
      user: user._id,
      tenant: tenant._id,
      lemonSqueezyId: "ls_12345",
      status: "active",
      plan: "monthly",
    };
    const subscription = new Subscription(validSubscriptionData);
    const savedSubscription = await subscription.save();

    // Assertions
    expect(savedSubscription._id).toBeDefined();
    expect(savedSubscription.user.toString()).toBe(user._id.toString());
    expect(savedSubscription.tenant.toString()).toBe(tenant._id.toString());
    expect(savedSubscription.status).toBe("active");
    expect(savedSubscription.plan).toBe("monthly");
  });

  // Test case 2: Required fields validation
  it("should fail to create a subscription without required fields", async () => {
    const invalidSubscriptionData = {
      status: "active",
    };
    try {
      const subscription = new Subscription(invalidSubscriptionData);
      await subscription.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.lemonSqueezyId).toBeDefined(); // Missing 'lemonSqueezyId'
      expect(error.errors.plan).toBeDefined(); // Missing 'plan'
    }
  });

  // Test case 3: Validate enum for status
  it("should not save a subscription with an invalid status", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    const user = await User.create(userData);

    const tenantData = {
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: user._id,
    };
    const tenant = await Tenant.create(tenantData);

    const invalidSubscriptionData = {
      user: user._id,
      tenant: tenant._id,
      lemonSqueezyId: "ls_12345",
      status: "invalidStatus", // Invalid status enum
      plan: "monthly",
    };
    try {
      const subscription = new Subscription(invalidSubscriptionData);
      await subscription.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.status).toBeDefined(); // Invalid enum value for 'status'
    }
  });

  // Test case 4: Association with user and tenant
  it("should associate a subscription with the correct user and tenant", async () => {
    // Step 1: Create a user and tenant for the subscription
    const userData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password123",
    };
    const user = await User.create(userData);

    const tenantData = {
      name: "Tenant 2",
      domain: "tenant2.example.com",
      adminUser: user._id,
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create the subscription
    const validSubscriptionData = {
      user: user._id,
      tenant: tenant._id,
      lemonSqueezyId: "ls_98765",
      status: "pending",
      plan: "annual",
    };
    const subscription = new Subscription(validSubscriptionData);
    const savedSubscription = await subscription.save();

    // Assertions
    expect(savedSubscription.user.toString()).toBe(user._id.toString());
    expect(savedSubscription.tenant.toString()).toBe(tenant._id.toString());
    expect(savedSubscription.status).toBe("pending");
    expect(savedSubscription.plan).toBe("annual");
  });
});

import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Category, Tenant } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Category Model", () => {
  // Test case 1: Valid category creation
  it("should create a category successfully with valid fields", async () => {
    // Step 1: Create a tenant for the category
    const tenantData = {
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create the category
    const validCategoryData = {
      name: "Tools",
      tenant: tenant._id,
    };
    const category = new Category(validCategoryData);
    const savedCategory = await category.save();

    // Assertions
    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe("Tools");
    expect(savedCategory.tenant.toString()).toBe(tenant._id.toString());
  });

  // Test case 2: Required fields validation
  it("should fail to create a category without required fields", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 2",
      domain: "tenant2.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidCategoryData = {
      tenant: tenant._id, // Missing required 'name' field
    };
    try {
      const category = new Category(invalidCategoryData);
      await category.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.name).toBeDefined(); // 'name' field is required
    }
  });

  // Test case 3: Ensure category names are unique per tenant (if unique constraint exists)
  it("should not allow duplicate category names within the same tenant", async () => {
    // Step 1: Create a tenant for the categories
    const tenantData = {
      name: "Tenant 3",
      domain: "tenant3.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create the first category
    const categoryData1 = {
      name: "Equipment",
      tenant: tenant._id,
    };
    await Category.create(categoryData1);

    // Step 3: Try to create a second category with the same name for the same tenant
    const categoryData2 = {
      name: "Equipment", // Duplicate name
      tenant: tenant._id,
    };

    try {
      await Category.create(categoryData2);
    } catch (error) {
      expect(error.code).toBe(11000); // Duplicate key error
    }
  });

  // Test case 4: Allow duplicate category names across different tenants
  it("should allow duplicate category names across different tenants", async () => {
    // Step 1: Create two tenants
    const tenant1 = await Tenant.create({
      name: "Tenant 4",
      domain: "tenant4.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const tenant2 = await Tenant.create({
      name: "Tenant 5",
      domain: "tenant5.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    // Step 2: Create the same category name for both tenants
    const categoryData1 = {
      name: "Supplies",
      tenant: tenant1._id,
    };
    const categoryData2 = {
      name: "Supplies",
      tenant: tenant2._id,
    };

    const savedCategory1 = await Category.create(categoryData1);
    const savedCategory2 = await Category.create(categoryData2);

    // Assertions
    expect(savedCategory1.name).toBe("Supplies");
    expect(savedCategory2.name).toBe("Supplies");
    expect(savedCategory1.tenant.toString()).not.toBe(savedCategory2.tenant.toString()); // Different tenants
  });
});

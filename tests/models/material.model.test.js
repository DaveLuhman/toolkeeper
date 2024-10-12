import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Material, Tenant } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Material Model", () => {
  // Test case 1: Valid material creation
  it("should create a material successfully with valid fields", async () => {
    // Step 1: Create a tenant for the material
    const tenantData = {
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create the material
    const validMaterialData = {
      name: "Wood",
      description: "High-quality wood",
      tenant: tenant._id,
    };
    const material = new Material(validMaterialData);
    const savedMaterial = await material.save();

    // Assertions
    expect(savedMaterial._id).toBeDefined();
    expect(savedMaterial.name).toBe("Wood");
    expect(savedMaterial.description).toBe("High-quality wood");
    expect(savedMaterial.tenant.toString()).toBe(tenant._id.toString());
  });

  // Test case 2: Required fields validation
  it("should fail to create a material without required fields", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 2",
      domain: "tenant2.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidMaterialData = {
      description: "Missing name", // Missing required 'name' field
      tenant: tenant._id,
    };
    try {
      const material = new Material(invalidMaterialData);
      await material.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.name).toBeDefined(); // 'name' is required
    }
  });

  // Test case 3: Ensure material names are unique per tenant
  it("should not allow duplicate material names within the same tenant", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 3",
      domain: "tenant3.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const materialData1 = {
      name: "Steel",
      description: "High-strength steel",
      tenant: tenant._id,
    };
    await Material.create(materialData1);

    const materialData2 = {
      name: "Steel", // Duplicate name
      description: "Duplicate steel entry",
      tenant: tenant._id,
    };

    try {
      await Material.create(materialData2);
    } catch (error) {
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    }
  });

  // Test case 4: Allow duplicate material names across different tenants
  it("should allow duplicate material names across different tenants", async () => {
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

    // Step 2: Create the same material name for both tenants
    const materialData1 = {
      name: "Concrete",
      description: "Strong concrete",
      tenant: tenant1._id,
    };
    const materialData2 = {
      name: "Concrete",
      description: "Same name different tenant",
      tenant: tenant2._id,
    };

    const savedMaterial1 = await Material.create(materialData1);
    const savedMaterial2 = await Material.create(materialData2);

    // Assertions
    expect(savedMaterial1.name).toBe("Concrete");
    expect(savedMaterial2.name).toBe("Concrete");
    expect(savedMaterial1.tenant.toString()).not.toBe(savedMaterial2.tenant.toString()); // Different tenants
  });
});

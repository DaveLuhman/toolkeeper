import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { ServiceAssignment, Tenant } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("ServiceAssignment Model", () => {
  // Test case 1: Valid service assignment creation
  it("should create a service assignment successfully with valid fields", async () => {
    // Step 1: Create a tenant
    const tenantData = {
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create a service assignment
    const validServiceAssignmentData = {
      jobNumber: "JOB001",
      jobName: "Demo Job",
      type: "Contract Jobsite",
      tenant: tenant._id,
    };
    const serviceAssignment = new ServiceAssignment(validServiceAssignmentData);
    const savedServiceAssignment = await serviceAssignment.save();

    // Assertions
    expect(savedServiceAssignment._id).toBeDefined();
    expect(savedServiceAssignment.jobNumber).toBe("JOB001");
    expect(savedServiceAssignment.jobName).toBe("Demo Job");
    expect(savedServiceAssignment.type).toBe("Contract Jobsite");
    expect(savedServiceAssignment.tenant.toString()).toBe(tenant._id.toString());
    expect(savedServiceAssignment.active).toBe(true); // Default value
  });

  // Test case 2: Required fields validation
  it("should fail to create a service assignment without required fields", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 2",
      domain: "tenant2.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidServiceAssignmentData = {
      jobName: "Missing Job Number", // Missing required 'jobNumber'
      tenant: tenant._id,
    };
    try {
      const serviceAssignment = new ServiceAssignment(invalidServiceAssignmentData);
      await serviceAssignment.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.jobNumber).toBeDefined(); // 'jobNumber' is required
    }
  });

  // Test case 3: Enum validation for type
  it("should not allow an invalid service assignment type", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 3",
      domain: "tenant3.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidServiceAssignmentData = {
      jobNumber: "JOB002",
      jobName: "Invalid Type Job",
      type: "InvalidType", // Invalid enum value
      tenant: tenant._id,
    };
    try {
      const serviceAssignment = new ServiceAssignment(invalidServiceAssignmentData);
      await serviceAssignment.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.type).toBeDefined(); // Invalid enum should throw an error
    }
  });

  // Test case 4: Unique jobNumber per tenant
  it("should not allow duplicate job numbers within the same tenant", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 4",
      domain: "tenant4.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const serviceAssignmentData1 = {
      jobNumber: "JOB003",
      jobName: "Original Job",
      type: "Stockroom",
      tenant: tenant._id,
    };
    await ServiceAssignment.create(serviceAssignmentData1);

    const serviceAssignmentData2 = {
      jobNumber: "JOB003", // Duplicate job number
      jobName: "Duplicate Job",
      type: "Stockroom",
      tenant: tenant._id,
    };
    try {
      await ServiceAssignment.create(serviceAssignmentData2);
    } catch (error) {
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    }
  });

  // Test case 5: Allow duplicate job numbers across different tenants
  it("should allow duplicate job numbers across different tenants", async () => {
    // Step 1: Create two tenants
    const tenant1 = await Tenant.create({
      name: "Tenant 5",
      domain: "tenant5.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const tenant2 = await Tenant.create({
      name: "Tenant 6",
      domain: "tenant6.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    // Step 2: Create service assignments with the same job number but different tenants
    const serviceAssignmentData1 = {
      jobNumber: "JOB004",
      jobName: "Job Tenant 5",
      type: "Vehicle",
      tenant: tenant1._id,
    };
    const serviceAssignmentData2 = {
      jobNumber: "JOB004", // Same job number
      jobName: "Job Tenant 6",
      type: "Vehicle",
      tenant: tenant2._id,
    };

    const savedServiceAssignment1 = await ServiceAssignment.create(serviceAssignmentData1);
    const savedServiceAssignment2 = await ServiceAssignment.create(serviceAssignmentData2);

    // Assertions
    expect(savedServiceAssignment1.jobNumber).toBe("JOB004");
    expect(savedServiceAssignment2.jobNumber).toBe("JOB004");
    expect(savedServiceAssignment1.tenant.toString()).not.toBe(savedServiceAssignment2.tenant.toString()); // Different tenants
  });
});

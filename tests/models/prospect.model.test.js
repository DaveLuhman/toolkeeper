import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Prospect } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Prospect Model", () => {
  // Test case 1: Valid prospect creation
  it("should create a prospect successfully with valid fields", async () => {
    const validProspectData = {
      name: "John Doe",
      email: "john.doe@example.com",
      companyName: "ToolCo",
    };
    const prospect = new Prospect(validProspectData);
    const savedProspect = await prospect.save();

    // Assertions
    expect(savedProspect._id).toBeDefined();
    expect(savedProspect.name).toBe("John Doe");
    expect(savedProspect.email).toBe("john.doe@example.com");
    expect(savedProspect.companyName).toBe("ToolCo");
  });

  // Test case 2: Required fields validation
  it("should fail to create a prospect without required fields", async () => {
    const invalidProspectData = {
      name: "Missing Email", // Missing required 'email' field
    };
    try {
      const prospect = new Prospect(invalidProspectData);
      await prospect.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.email).toBeDefined(); // 'email' is required
    }
  });

  // Test case 3: Ensure prospect email is unique
  it("should not allow duplicate email addresses", async () => {
    const prospectData1 = {
      name: "John Smith",
      email: "john.smith@example.com",
      companyName: "TechCo",
    };
    await Prospect.create(prospectData1);

    const prospectData2 = {
      name: "Jane Doe",
      email: "john.smith@example.com", // Duplicate email
      companyName: "ToolCo",
    };

    try {
      await Prospect.create(prospectData2);
    } catch (error) {
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    }
  });

  // Test case 4: Optional fields
  it("should allow creation of a prospect without optional fields", async () => {
    const validProspectData = {
      email: "jane.doe@example.com", // Required field
    };
    const prospect = new Prospect(validProspectData);
    const savedProspect = await prospect.save();

    // Assertions
    expect(savedProspect._id).toBeDefined();
    expect(savedProspect.email).toBe("jane.doe@example.com");
    expect(savedProspect.name).toBeUndefined(); // Optional field not provided
    expect(savedProspect.companyName).toBeUndefined(); // Optional field not provided
  });
});

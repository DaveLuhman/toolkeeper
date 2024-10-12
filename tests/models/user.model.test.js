import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User, Tenant } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("User Model", () => {
  // Test case 1: Valid user creation with hashed password
  it("should create a user successfully with a hashed password", async () => {
    // Step 1: Create a tenant for the user
    const tenantData = {
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    };
    const tenant = await Tenant.create(tenantData);

    // Step 2: Create a user
    const validUserData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "Admin",
      tenant: tenant._id,
    };
    const user = new User(validUserData);
    const savedUser = await user.save();

    // Assertions
    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe("John");
    expect(savedUser.email).toBe("john.doe@example.com");
    expect(savedUser.tenant.toString()).toBe(tenant._id.toString());

    // Ensure password is hashed
    const isPasswordHashed = await bcrypt.compare("password123", savedUser.password);
    expect(isPasswordHashed).toBe(true);
  });

  // Test case 2: Required fields validation
  it("should fail to create a user without required fields", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 2",
      domain: "tenant2.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidUserData = {
      firstName: "Jane", // Missing email and password
      tenant: tenant._id,
    };
    try {
      const user = new User(invalidUserData);
      await user.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.email).toBeDefined(); // 'email' is required
      expect(error.errors.password).toBeDefined(); // 'password' is required
    }
  });

  // Test case 3: Enum validation for role
  it("should not allow invalid roles", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 3",
      domain: "tenant3.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidUserData = {
      firstName: "Invalid",
      lastName: "Role",
      email: "invalid.role@example.com",
      password: "password789",
      role: "InvalidRole", // Invalid enum value
      tenant: tenant._id,
    };
    try {
      const user = new User(invalidUserData);
      await user.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.role).toBeDefined(); // Invalid enum value for role
    }
  });

  // Test case 4: Virtual property 'displayName'
  it("should correctly get and set the virtual displayName", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 4",
      domain: "tenant4.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const validUserData = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      password: "password123",
      tenant: tenant._id,
    };
    const user = new User(validUserData);
    const savedUser = await user.save();

    // Getter test
    expect(savedUser.displayName).toBe("Alice Smith");

    // Setter test
    savedUser.displayName = "Bob Johnson";
    expect(savedUser.firstName).toBe("Bob");
    expect(savedUser.lastName).toBe("Johnson");
  });

  // Test case 5: Static method 'findByEmail'
  it("should find a user by email using findByEmail static method", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 5",
      domain: "tenant5.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const validUserData = {
      firstName: "Chris",
      lastName: "Jones",
      email: "chris.jones@example.com",
      password: "password456",
      tenant: tenant._id,
    };
    const user = new User(validUserData);
    await user.save();

    // Static method test
    const foundUser = await User.findByEmail("chris.jones@example.com");
    expect(foundUser).toBeTruthy();
    expect(foundUser.email).toBe("chris.jones@example.com");
  });

  // Test case 6: Static method 'findByToken'
  it("should find a user by token using findByToken static method", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 6",
      domain: "tenant6.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const validUserData = {
      firstName: "Sam",
      lastName: "Lee",
      email: "sam.lee@example.com",
      password: "password789",
      token: "unique-token",
      tenant: tenant._id,
    };
    const user = new User(validUserData);
    await user.save();

    // Static method test
    const foundUser = await User.findByToken("unique-token");
    expect(foundUser).toBeTruthy();
    expect(foundUser.token).toBe("unique-token");
  });

  // Test case 7: Default preferences
  it("should set default preferences for a new user", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 7",
      domain: "tenant7.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const validUserData = {
      firstName: "Sara",
      lastName: "Wong",
      email: "sara.wong@example.com",
      password: "password987",
      tenant: tenant._id,
    };
    const user = new User(validUserData);
    const savedUser = await user.save();

    // Check default preferences
    expect(savedUser.preferences.theme).toBe("dracula");
    expect(savedUser.preferences.sortField).toBe("serialNumber");
    expect(savedUser.preferences.pageSize).toBe(10);
    expect(savedUser.preferences.developer).toBe(false);
  });
});

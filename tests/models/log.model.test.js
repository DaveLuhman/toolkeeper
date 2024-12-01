import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { Log, Tenant, User, ServiceAssignment, Tool } from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Log Model", () => {
  // Test case 1: Valid log creation
  it("should create a log entry successfully with valid fields", async () => {
    // Step 1: Create a tenant for the log entry
    const tenant = await Tenant.create({
      name: "Tenant 1",
      domain: "tenant1.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    // Step 2: Create a log entry
    const validLogData = {
      tenantId: tenant._id,
      level: "info",
      message: "User logged in successfully",
    };
    const log = new Log(validLogData);
    const savedLog = await log.save();

    // Assertions
    expect(savedLog._id).toBeDefined();
    expect(savedLog.tenantId.toString()).toBe(tenant._id.toString());
    expect(savedLog.level).toBe("info");
    expect(savedLog.message).toBe("User logged in successfully");
    expect(savedLog.timestamp).toBeDefined(); // Default timestamp should be present
  });

  // Test case 2: Required fields validation
  it("should fail to create a log entry without required fields", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 2",
      domain: "tenant2.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidLogData = {
      tenantId: tenant._id, // Missing 'level' and 'message'
    };

    try {
      const log = new Log(invalidLogData);
      await log.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.level).toBeDefined(); // 'level' is required
      expect(error.errors.message).toBeDefined(); // 'message' is required
    }
  });

  // Test case 3: Enum validation for 'level'
  it("should not allow an invalid log level", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 3",
      domain: "tenant3.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const invalidLogData = {
      tenantId: tenant._id,
      level: "critical", // Invalid level
      message: "Critical error occurred",
    };

    try {
      const log = new Log(invalidLogData);
      await log.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.level).toBeDefined(); // Invalid 'level' should trigger an error
    }
  });

  // Test case 4: Log entry with metadata
  it("should create a log entry with metadata", async () => {
    // Step 1: Create tenant, user, service assignment, and tool for metadata
    const tenant = await Tenant.create({
      name: "Tenant 4",
      domain: "tenant4.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    const user = await User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      tenant: tenant._id,
    });

    const serviceAssignment = await ServiceAssignment.create({
      jobNumber: "JOB001",
      jobName: "Demo Job",
      tenant: tenant._id,
    });

    const tool = await Tool.create({
      serialNumber: "SN12345",
      barcode: "BC12345",
      tenant: tenant._id,
    });

    // Step 2: Create a log entry with metadata
    const logDataWithMetadata = {
      tenantId: tenant._id,
      level: "warn",
      message: "Tool assignment failed",
      metadata: {
        userId: user._id,
        serviceAssignmentId: serviceAssignment._id,
        toolId: tool._id,
        action: "tool assignment",
        request: {
          method: "POST",
          url: "/tools/assign",
          ip: "192.168.0.1",
          userAgent: "Mozilla/5.0",
        },
      },
    };

    const logWithMetadata = new Log(logDataWithMetadata);
    const savedLogWithMetadata = await logWithMetadata.save();

    // Assertions
    expect(savedLogWithMetadata.metadata.userId.toString()).toBe(user._id.toString());
    expect(savedLogWithMetadata.metadata.serviceAssignmentId.toString()).toBe(serviceAssignment._id.toString());
    expect(savedLogWithMetadata.metadata.toolId.toString()).toBe(tool._id.toString());
    expect(savedLogWithMetadata.metadata.action).toBe("tool assignment");
    expect(savedLogWithMetadata.metadata.request.method).toBe("POST");
    expect(savedLogWithMetadata.metadata.request.url).toBe("/tools/assign");
    expect(savedLogWithMetadata.metadata.request.ip).toBe("192.168.0.1");
    expect(savedLogWithMetadata.metadata.request.userAgent).toBe("Mozilla/5.0");
  });

  // Test case 5: Filtering logs by tenant and timestamp
  it("should filter logs by tenant and timestamp", async () => {
    const tenant = await Tenant.create({
      name: "Tenant 5",
      domain: "tenant5.example.com",
      adminUser: new mongoose.Types.ObjectId(),
    });

    // Create multiple log entries
    const logData1 = {
      tenantId: tenant._id,
      level: "info",
      message: "First log entry",
      timestamp: new Date("2024-01-01T10:00:00Z"),
    };

    const logData2 = {
      tenantId: tenant._id,
      level: "error",
      message: "Second log entry",
      timestamp: new Date("2024-01-02T10:00:00Z"),
    };

    await Log.create(logData1);
    await Log.create(logData2);

    // Fetch logs for tenant filtered by timestamp
    const filteredLogs = await Log.find({
      tenantId: tenant._id,
      timestamp: { $gte: new Date("2024-01-02T00:00:00Z") },
    });

    // Assertions
    expect(filteredLogs.length).toBe(1);
    expect(filteredLogs[0].message).toBe("Second log entry");
  });
});

import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import {
	Tool,
	ServiceAssignment,
	Category,
	Tenant,
} from "../../src/models/index.models.js"; // Adjust this import to your project structure

describe("Tool Model", () => {
	// Test case 1: Valid tool creation
	it("should create a tool successfully with valid fields", async () => {
		// Step 1: Create necessary associations (tenant, serviceAssignment, category)
		const tenant = await Tenant.create({
			name: "Tenant 1",
			domain: "tenant1.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const serviceAssignment = await ServiceAssignment.create({
			jobNumber: "JOB001",
			jobName: "Demo Job",
			type: "Stockroom",
			tenant: tenant._id,
		});

		const category = await Category.create({
			name: "Power Tools",
			tenant: tenant._id,
		});

		// Step 2: Create a tool
		const validToolData = {
			serialNumber: "SN12345",
			barcode: "BC12345",
			serviceAssignment: serviceAssignment._id,
			category: category._id,
			tenant: tenant._id,
		};
		const tool = new Tool(validToolData);
		const savedTool = await tool.save();

		// Assertions
		expect(savedTool._id).toBeDefined();
		expect(savedTool.serialNumber).toBe("SN12345");
		expect(savedTool.barcode).toBe("BC12345");
		expect(savedTool.serviceAssignment._id.toString()).toBe(
			serviceAssignment._id.toString(),
		);
		expect(savedTool.category._id.toString()).toBe(category._id.toString());
		expect(savedTool.tenant._id.toString()).toBe(tenant._id.toString());
		expect(savedTool.archived).toBe(false); // Default value
	});

	// Test case 2: Required fields validation
	it("should fail to create a tool without required fields", async () => {
		const tenant = await Tenant.create({
			name: "Tenant 2",
			domain: "tenant2.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const invalidToolData = {
			serviceAssignment: new mongoose.Types.ObjectId(),
			tenant: tenant._id, // Missing 'serialNumber' and 'barcode'
		};

		try {
			const tool = new Tool(invalidToolData);
			await tool.save();
		} catch (error) {
			expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(error.errors.serialNumber).toBeDefined(); // 'serialNumber' is required
			expect(error.errors.barcode).toBeDefined(); // 'barcode' is required
		}
	});

	// Test case 3: Unique serialNumber and barcode
	it("should not allow duplicate serialNumbers or barcodes", async () => {
		const tenant = await Tenant.create({
			name: "Tenant 3",
			domain: "tenant3.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const toolData = {
			serialNumber: "SN123456",
			barcode: "BC123456",
			tenant: tenant._id,
		};
		await Tool.create(toolData);

		// Try to create another tool with the same serialNumber and barcode
		const duplicateToolData = {
			serialNumber: "SN123456", // Duplicate serialNumber
			barcode: "BC123456", // Duplicate barcode
			tenant: tenant._id,
		};

		try {
			await Tool.create(duplicateToolData);
		} catch (error) {
			expect(error.code).toBe(11000); // MongoDB duplicate key error
		}
	});

	// Test case 4: Virtual property 'status'
	it("should correctly derive the status based on serviceAssignment", async () => {
		const tenant = await Tenant.create({
			name: "Tenant 4",
			domain: "tenant4.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const serviceAssignmentCheckedIn = await ServiceAssignment.create({
			jobNumber: "STOCK001",
			jobName: "Stockroom",
			type: "Stockroom",
			tenant: tenant._id,
		});

		const serviceAssignmentCheckedOut = await ServiceAssignment.create({
			jobNumber: "JOB002",
			jobName: "Jobsite",
			type: "Contract Jobsite",
			tenant: tenant._id,
		});

		// Create a tool with serviceAssignment set to Stockroom (should be "Checked In")
		const toolCheckedIn = await Tool.create({
			serialNumber: "SN9999",
			barcode: "BC9999",
			serviceAssignment: serviceAssignmentCheckedIn._id,
			tenant: tenant._id,
		});

		// Create another tool with serviceAssignment set to Jobsite (should be "Checked Out")
		const toolCheckedOut = await Tool.create({
			serialNumber: "SN8888",
			barcode: "BC8888",
			serviceAssignment: serviceAssignmentCheckedOut._id,
			tenant: tenant._id,
		});

		expect(toolCheckedIn.status).toBe("Checked In");
		expect(toolCheckedOut.status).toBe("Checked Out");
	});

	// Test case 5: History tracking
	it("should correctly track history records", async () => {
		const tenant = await Tenant.create({
			name: "Tenant 5",
			domain: "tenant5.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const serviceAssignment = await ServiceAssignment.create({
			jobNumber: "JOB003",
			jobName: "Jobsite 3",
			type: "Contract Jobsite",
			tenant: tenant._id,
		});

		const user = await User.create({
			name: "Alex Johnson",
			email: "alex.johnson@example.com",
			password: "password123",
			tenant: tenant._id,
		});

		const tool = await Tool.create({
			serialNumber: "SN7777",
			barcode: "BC7777",
			serviceAssignment: serviceAssignment._id,
			tenant: tenant._id,
		});

		// Add a history record
		tool.history.push({
			updatedBy: user._id,
			serviceAssignment: serviceAssignment._id,
			status: "Checked Out",
			changeDescription: "Tool assigned to jobsite",
		});
		await tool.save();

		const updatedTool = await Tool.findById(tool._id)
			.populate("history.updatedBy")
			.exec();

		// Assertions
		expect(updatedTool.history.length).toBe(1);
		expect(updatedTool.history[0].updatedBy.name).toBe("Alex Johnson");
		expect(updatedTool.history[0].status).toBe("Checked Out");
		expect(updatedTool.history[0].changeDescription).toBe(
			"Tool assigned to jobsite",
		);
	});
});

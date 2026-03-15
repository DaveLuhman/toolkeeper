import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { batchImportTools } from "../../src/middleware/import/batch.js";
import {
	Tool,
	ServiceAssignment,
	Category,
	Tenant,
} from "../../src/models/index.models.js";

describe("batchImportTools", () => {
	it("creates tools and returns an empty errorList", async () => {
		const tenant = await Tenant.create({
			name: "Batch Tenant",
			domain: "batch.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const serviceAssignment = await ServiceAssignment.create({
			jobNumber: "JOB-BATCH",
			jobName: "Batch Job",
			type: "Contract Jobsite",
			tenant: tenant._id,
		});

		const category = await Category.create({
			name: "Batch Tools",
			tenant: tenant._id,
		});

		const payload = {
			serialNumber: "SN100,SN101",
			barcode: "BC100,BC101",
			toolID: "TID100,TID101",
			description: "Batch Tool",
			serviceAssignment: serviceAssignment._id.toString(),
			category: category._id.toString(),
			tenant: tenant._id.toString(),
		};

		const { newTools, errorList } = await batchImportTools(payload);

		expect(Array.isArray(errorList)).toBe(true);
		expect(errorList.length).toBe(0);
		expect(newTools.length).toBe(2);

		const createdCount = await Tool.countDocuments({ tenant: tenant._id });
		expect(createdCount).toBe(2);
	});

	it("collects duplicate errors and creates no tools", async () => {
		const tenant = await Tenant.create({
			name: "Duplicate Tenant",
			domain: "dupe.example.com",
			adminUser: new mongoose.Types.ObjectId(),
		});

		const serviceAssignment = await ServiceAssignment.create({
			jobNumber: "JOB-DUPE",
			jobName: "Duplicate Job",
			type: "Contract Jobsite",
			tenant: tenant._id,
		});

		const category = await Category.create({
			name: "Duplicate Tools",
			tenant: tenant._id,
		});

		await Tool.create({
			serialNumber: "SN200",
			barcode: "BC200",
			toolID: "TID200",
			serviceAssignment: serviceAssignment._id,
			category: category._id,
			tenant: tenant._id,
		});

		const payload = {
			serialNumber: "SN200",
			barcode: "BC201",
			toolID: "TID201",
			description: "Duplicate Tool",
			serviceAssignment: serviceAssignment._id.toString(),
			category: category._id.toString(),
			tenant: tenant._id.toString(),
		};

		const { newTools, errorList } = await batchImportTools(payload);

		expect(newTools.length).toBe(0);
		expect(errorList.length).toBeGreaterThan(0);
	});
});

import mongoose, { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { Category, ServiceAssignment } from "./index.models.js";

const TenantSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			index: true,
		},
		domain: {
			type: String,
			required: true,
		},
		adminUser: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			autopopulate: true,
		},
		subscription: {
			type: Schema.Types.ObjectId,
			ref: "Subscription",
			autopopulate: true,
		  }
		},
	{
		timestamps: true,
	},
);
TenantSchema.plugin(mongooseAutoPopulate);
TenantSchema.statics.createWithDefaults = async function (tenantData) {

	try {
		// Step 1: Create the tenant
		const tenant = await this.create(tenantData);

		// Step 2: Create the default Category
		const defaultCategory = new Category({
			name: "Uncategorized",
			tenant: tenant._id, // Reference the tenant's ID
		});
		await defaultCategory.save();

		// Step 3: Create default ServiceAssignments
		const stockroomAssignment = new ServiceAssignment({
			jobNumber: "STOCK",
			jobName: "Default Stockroom",
			type: "Stockroom",
			tenant: tenant._id,
		});

		const importedAssignment = new ServiceAssignment({
			jobNumber: "IMPORT",
			jobName: "Imported",
			type: "Stockroom",
			tenant: tenant._id,
		});

		const partsAssignment = new ServiceAssignment({
			jobNumber: "PARTS",
			jobName: "Parts",
			type: "Stockroom",
			tenant: tenant._id,
		});

		await Promise.all([
			stockroomAssignment.save(),
			importedAssignment.save(),
			partsAssignment.save(),
		]);
		return tenant; // Return the created tenant
	} catch (error) {
		// biome-ignore lint/complexity/noUselessCatch: <explanation>
		throw error; // Re-throw the error to be handled by the caller
	}
};
export default TenantSchema;

// src\models\Tenant.schema.js

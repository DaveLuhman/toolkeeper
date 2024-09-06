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
		subscriptionTier: {
			type: String,
			required: true,
			enum: ["Trial", "Pro", "Premium"],
			default: "Trial",
		},
		subscriptionActive: {
			type: Boolean,
			default: true,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);
TenantSchema.plugin(mongooseAutoPopulate);
TenantSchema.statics.createWithDefaults = async function (tenantData) {
	// Start a session for transactional consistency
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Step 1: Create the tenant
		const tenant = await this.create([tenantData], { session });

		// Step 2: Create the default Category
		const defaultCategory = new Category({
			name: "Uncategorized",
			tenant: tenant[0]._id, // Reference the tenant's ID
		});
		await defaultCategory.save({ session });

		// Step 3: Create default ServiceAssignments
		const stockroomAssignment = new ServiceAssignment({
			jobNumber: "STOCK",
			jobName: "Default Stockroom",
			type: "Stockroom",
			tenant: tenant[0]._id,
		});

		const importedAssignment = new ServiceAssignment({
			jobNumber: "IMPORT",
			jobName: "Imported",
			type: "Stockroom",
			tenant: tenant[0]._id,
		});

		const partsAssignment = new ServiceAssignment({
			jobNumber: "PARTS",
			jobName: "Parts",
			type: "Stockroom",
			tenant: tenant[0]._id,
		});

		// Save all service assignments within the same session
		await Promise.all([
			stockroomAssignment.save({ session }),
			importedAssignment.save({ session }),
			partsAssignment.save({ session }),
		]);

		// Step 4: Commit the transaction
		await session.commitTransaction();
		session.endSession();

		return tenant[0]; // Return the created tenant
	} catch (error) {
		// If any error occurs, abort the transaction
		await session.abortTransaction();
		session.endSession();
		throw error; // Re-throw the error to be handled by the caller
	}
};
export default TenantSchema;

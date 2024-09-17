import { Schema } from "mongoose";
import { Tool } from "./index.models.js";

const ServiceAssignmentSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		jobNumber: {
			type: String,
			required: true,
		},
		jobName: {
			type: String,
			required: false,
		},
		type: {
			type: String,
			enum: [
				"Contract Jobsite",
				"Service Jobsite",
				"Stockroom",
				"Vehicle",
				"Employee",
				"Imported - Uncategorized",
				"Error - Uncategorized",
			],
		},
		active: {
			type: Boolean,
			default: true,
		},
		phone: {
			type: String,
		},
		notes: {
			type: String,
		},
		tenant: {
			type: Schema.Types.ObjectId,
			ref: "Tenant",
			default: "66af881237c17b64394a4166",
			required: true,
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
		timestamps: true,
	},
);
ServiceAssignmentSchema.index({ jobNumber: 1, tenant: 1 }, { unique: true });

export default ServiceAssignmentSchema;

// src\models\ServiceAssignment.schema.js

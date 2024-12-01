import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { ServiceAssignment } from "./index.models.js";
import logger from "../logging/index.js";

const ToolSchema = new Schema(
	{
		serialNumber: {
			type: String,
			upperCase: true,
			maxLength: 32,
			trim: true,
			required: true,
		},
		modelNumber: {
			type: String,
			upperCase: true,
			maxLength: 32,
			trim: true,
		},
		barcode: {
			type: String,
			maxLength: 32,
			trim: true,
			required: true,
		},
		toolID: {
			type: String,
			upperCase: true,
			trim: true,
		},
		serviceAssignment: {
			type: Schema.Types.ObjectId,
			ref: "ServiceAssignment",
			autopopulate: true,
			default: "64a34b651288871770df1086",
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			autopopulate: true,
			default: "64a1c3d8d71e121dfd39b7ab",
		},
		description: {
			type: String,
			maxLength: 128,
			trim: true,
		},
		manufacturer: {
			type: String,
			trim: true,
		},
		material: {
			type: Schema.Types.ObjectId,
			ref: "Material",
		},
		size: {
			width: { type: String },
			height: { type: String },
			length: { type: String },
			weight: { type: String },
		},
		archived: {
			type: Boolean,
			default: false,
		},
		createdBy: {
			ref: "User",
			type: Schema.Types.ObjectId,
		},
		updatedBy: {
			ref: "User",
			type: Schema.Types.ObjectId,
		},
		tenant: {
			type: Schema.Types.ObjectId,
			ref: "Tenant",
			default: "66af881237c17b64394a4166",
			required: true,
		},
		history: [
			{
				updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
				updatedAt: { type: Date, default: Date.now },
				serviceAssignment: {
					type: Schema.Types.ObjectId,
					ref: "ServiceAssignment",
				},
				status: { type: String }, // Derived status
				changeDescription: { type: String }, // Optional field to describe the change
			},
		],
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
		strict: false,
	},
);
ToolSchema.index({ serialNumber: 1, tenant: 1 }, { unique: true });
ToolSchema.index({ barcode: 1, tenant: 1 }, { unique: true });

ToolSchema.plugin(mongooseAutoPopulate);

ToolSchema.virtual("status").get(function () {
	if (!this.serviceAssignment) return "Undefined";
	switch (this.serviceAssignment?.type) {
		case "Stockroom":
			return "Checked In";
		case "Contract Jobsite":
		case "Service Jobsite":
		case "Employee":
		case "Vehicle":
			return "Checked Out";
		default:
			return "Unavailable";
	}
});

ToolSchema.post('save', async (doc) => {
	const lastHistoryEntry = doc.history[doc.history.length - 1];

	if (lastHistoryEntry) {
		const { serviceAssignment } = lastHistoryEntry;

		try {
			// Update previous service assignment if it exists
			if (doc.serviceAssignment) {
				await ServiceAssignment.findByIdAndUpdate(doc.serviceAssignment, {
					$inc: { toolCount: doc.serviceAssignment ? 0 : -1 } // Decrement tool count for previous assignment
				});
			}

			// Update new service assignment if it exists
			if (serviceAssignment) {
				await ServiceAssignment.findByIdAndUpdate(serviceAssignment, {
					$inc: { toolCount: serviceAssignment ? 1 : 0 } // Increment tool count for new assignment
				});
			}
		} catch (error) {
			logger.error(`Error updating toolCount for ServiceAssignment: ${error.message}`);
		}
	}
});

export default ToolSchema;

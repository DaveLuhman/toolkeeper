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
	if (!this.serviceAssignment) {
   return "Undefined";
 }
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

ToolSchema.pre("save", async function (next) {
	if (!this.isModified("serviceAssignment")) {
		return next();
	}

	if (this.isNew) {
		this.$locals.previousServiceAssignment = null;
		return next();
	}

	try {
		const existing = await this.constructor
			.findById(this._id)
			.select("serviceAssignment");
		this.$locals.previousServiceAssignment = existing?.serviceAssignment || null;
		return next();
	} catch (error) {
		logger.error(
			`Error fetching previous serviceAssignment: ${error.message}`,
		);
		return next(error);
	}
});

ToolSchema.post("save", async (doc) => {
	const previousServiceAssignment = doc.$locals?.previousServiceAssignment;
	if (previousServiceAssignment === undefined) {
		return;
	}

	const previousId = previousServiceAssignment
		? previousServiceAssignment.valueOf()
		: null;
	const currentId = doc.serviceAssignment ? doc.serviceAssignment.valueOf() : null;

	if (previousId === currentId) {
		return;
	}

	try {
		if (previousId) {
			await ServiceAssignment.findByIdAndUpdate(previousId, {
				$inc: { toolCount: -1 },
			});
		}

		if (currentId) {
			await ServiceAssignment.findByIdAndUpdate(currentId, {
				$inc: { toolCount: 1 },
			});
		}
	} catch (error) {
		logger.error(
			`Error updating toolCount for ServiceAssignment: ${error.message}`,
		);
	}
});

export default ToolSchema;

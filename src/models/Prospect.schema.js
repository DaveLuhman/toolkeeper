import { Schema } from "mongoose";
const ProspectSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: true,
		},
		companyName: String,
		converted: {
			type: Boolean,
			default: false,
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
		timestamps: true,
	},
);

export default ProspectSchema;

// src\models\Prospect.schema.js

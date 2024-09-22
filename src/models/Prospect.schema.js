import { Schema } from "mongoose";
const ProspectSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: true,
		},
		companyName: String,
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
		timestamps: true,
	},
);

export default ProspectSchema;

// src\models\Prospect.schema.js

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
// This code creates a new schema that is used to define the User model
// The schema contains the fields for a user, as well as the timestamps
// that are automatically added when the user is created and updated
const UserSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		name: {
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
		password: {
			type: String,
			required: true,
			set: (cleartextPassword) => {
				if (!cleartextPassword) return cleartextPassword;

				const saltRounds = 10;
				try {
					const hashedPassword = bcrypt.hashSync(cleartextPassword, saltRounds);
					return hashedPassword;
				} catch (error) {
					throw new Error("Error hashing password");
				}
			},
		},
		role: {
			type: String,
			default: "User",
			enum: ["User", "Manager", "Admin", "Superadmin"],
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		lastLogin: {
			type: Date,
		},
		preferences: {
			type: Object,
			default: {
				theme: "dracula",
				sortField: "serialNumber",
				sortDirection: "asc",
				pageSize: 10,
				developer: false,
			},
		},
		token: String,
		tokenExpiry: Number,
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

UserSchema.statics.findByEmail = async (email) =>
	(await model("User").findOne({ email: { $eq: email } })) || false;
UserSchema.statics.findByToken = async (token) =>
	(await model("User").findOne({ token: { $eq: token } })) || false;

export default UserSchema;

// src\models\User.schema.js

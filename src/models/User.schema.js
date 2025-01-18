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
			lowercase: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			set: (cleartextPassword) => {
				if (!cleartextPassword) {
					return cleartextPassword;
				}

				const saltRounds = 10;
				try {
					return bcrypt.hashSync(cleartextPassword, saltRounds);
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

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.statics.findByEmail = async (email) =>
	(await model("User").findOne({ email: { $eq: email } })) || false;
UserSchema.statics.findByToken = async (token) =>
	(await model("User").findOne({ token: { $eq: token } })) || false;

UserSchema.post('save', async function(doc) {
	// Only run this for newly created users
	if (this.isNew) {
		try {
			const OnboardingModel = model('Onboarding');

			// Check if onboarding document already exists
			const existingOnboarding = await OnboardingModel.findOne({ user: doc._id });

			if (!existingOnboarding) {
				// Create new onboarding document with just the user ID
				await OnboardingModel.create({
					user: doc._id,
				});
			}
		} catch (error) {
			console.error('Error creating onboarding document:', error);
			// Don't throw the error to prevent blocking user creation
		}
	}
});

export default UserSchema;

// src\models\User.schema.js

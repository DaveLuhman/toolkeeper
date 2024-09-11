import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User" }, // For renewal contact
	tenantId: { type: Schema.Types.ObjectId, ref: "Tenant" }, // Tenant associated with this subscription
	status: {
		type: String,
		enum: ["pending", "active", "lapsed", "cancelled"],
		default: "pending",
	},
	plan: { type: String, enum: ["monthly", "annual"] },

	lemonSqueezyId: { type: String, required: true }, // Corresponds to the "id" field
	lemonSqueezyObject: {
		storeId: { type: Number, required: true },
		customerId: { type: Number, required: true },
		orderId: { type: Number, required: true },
		orderItemId: { type: Number, required: true },
		productId: { type: Number, required: true },
		variantId: { type: Number, required: true },
		productName: { type: String, required: true },
		variantName: { type: String, required: true },
		userName: { type: String, required: true },
		userEmail: { type: String, required: true },
		status: {
			type: String,
			enum: ["pending", "active", "lapsed", "cancelled"],
			required: true,
		},
		statusFormatted: { type: String }, // Optional field
		cardBrand: { type: String },
		cardLastFour: { type: String },
		pause: { type: String, default: null }, // Can be null, depending on your business logic
		cancelled: { type: Boolean, default: false },
		trialEndsAt: { type: Date, default: null },
		billingAnchor: { type: Number, required: true }, // Billing cycle anchor, e.g., 12 for the 12th of the month

		firstSubscriptionItem: {
			id: { type: Number, required: true },
			subscriptionId: { type: Number, required: true },
			priceId: { type: Number, required: true },
			quantity: { type: Number, required: true },
			createdAt: { type: Date, required: true },
			updatedAt: { type: Date, required: true },
		},

		urls: {
			updatePaymentMethod: { type: String },
			customerPortal: { type: String },
			customerPortalUpdateSubscription: { type: String },
		},

		renewsAt: { type: Date },
		endsAt: { type: Date, default: null },
		createdAt: { type: Date, required: true },
		updatedAt: { type: Date, required: true },
		testMode: { type: Boolean, default: false },
	},
});

export default subscriptionSchema
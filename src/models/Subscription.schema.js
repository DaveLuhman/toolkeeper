import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User" }, // For renewal contact
	tenant: { type: Schema.Types.ObjectId, ref: "Tenant" }, // Tenant associated with this subscription
	lemonSqueezyId: { type: String, required: true }, // Corresponds to the "id" field
	lemonSqueezyObject: {
		type: Object,
		required: true,
		default: {},
		// Define some common fields, but allow for flexibility
		storeId: Number,
		customerId: Number,
		orderId: Number,
		orderItemId: Number,
		productId: Number,
		variantId: Number,
		productName: String,
		variantName: String,
		userName: String,
		userEmail: String,
		status: String,
		statusFormatted: String,
		cardBrand: String,
		cardLastFour: String,
		pause: String,
		cancelled: Boolean,
		trialEndsAt: Date,
		billingAnchor: Number,
		firstSubscriptionItem: {
			id: Number,
			subscriptionId: Number,
			priceId: Number,
			quantity: Number,
			createdAt: Date,
			updatedAt: Date,
		},
		urls: {
			updatePaymentMethod: String,
			customerPortal: String,
			customerPortalUpdateSubscription: String,
		},
		renewsAt: Date,
		endsAt: Date,
		createdAt: Date,
		updatedAt: Date,
		testMode: Boolean,
	}
},
{
	timestamps: true,
	strict: false // This allows for additional fields not explicitly defined
});

// Virtual property to get status from lemonSqueezyObject
subscriptionSchema.virtual("status").get(function () {
  if (!this.lemonSqueezyObject) {
    return "unknown";
  }
  return this.lemonSqueezyObject.status || "unknown";
});

// Static method to create a subscription from webhook event
subscriptionSchema.statics.createFromWebhook = async function(userId, tenantId, webhookData) {
  if (!webhookData?.id || !webhookData?.attributes) {
    throw new Error('Invalid webhook data: Missing required fields');
  }

  try {
    return await this.create({
          user: userId,
          tenant: tenantId,
          lemonSqueezyId: webhookData.id,
          lemonSqueezyObject: webhookData.attributes
        });
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

export default subscriptionSchema

/** saving this data shape for posterity
 * 	storeId: { type: Number, required: true },
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
*/

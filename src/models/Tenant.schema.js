import { Schema } from 'mongoose'

const TenantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    adminUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionTier: {
      type: String,
      required: true,
    },
    subscriptionStatus: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true
  }
)

export default TenantSchema

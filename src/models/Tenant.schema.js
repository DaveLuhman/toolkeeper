import { Schema } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'


const TenantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    domain: {
      type: String,
      required: true,
    },
    adminUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    subscriptionTier: {
      type: String,
      required: true,
    },
    subscriptionStatus: {
      type: String,  //active, inactive
      required: true,
    },
  },
  {
    timestamps: true
  }
)
TenantSchema.plugin(mongooseAutoPopulate)

export default TenantSchema

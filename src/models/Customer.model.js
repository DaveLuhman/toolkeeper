import { Schema } from 'mongoose'

const CustomerSchema = new Schema({
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
  active: {
    type: Boolean,
    default: true,
  },
  subscriptionTier: {
    type: String,
    required: true,
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
})

const Customer = model('Customer', CustomerSchema)
export default Customer
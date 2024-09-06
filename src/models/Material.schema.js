import { Schema } from 'mongoose'

const MaterialSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false,
      maxLength: 64
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      default: '66af881237c17b64394a4166',
      required: true
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
)
MaterialSchema.index({ name: 1, tenant: 1 }, { unique: true });

export default MaterialSchema

import { Schema } from 'mongoose'

const ServiceAssignmentSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    jobNumber: {
      type: String,
      required: true,
    },
    jobName: {
      type: String,
      required: false
    },
    type: {
      type: String,
      enum: [
        'Contract Jobsite',
        'Service Jobsite',
        'Stockroom',
        'Vehicle',
        'Employee',
        'Imported - Uncategorized',
        'Error - Uncategorized'
      ]
    },
    active: {
      type: Boolean,
      default: true
    },
    phone: {
      type: String
    },
    toolCount: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: {
      type: String
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

export default ServiceAssignmentSchema

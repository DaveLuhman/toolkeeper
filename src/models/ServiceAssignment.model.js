import mongoose, { Schema, model } from 'mongoose'

const ServiceAssignmentSchema = new Schema(
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
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
)

export default model('ServiceAssignment', ServiceAssignmentSchema)

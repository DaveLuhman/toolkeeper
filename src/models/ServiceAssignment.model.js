import { Schema, model } from 'mongoose'

const ServiceAssignmentSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    name: {
      type: String,
      required: true
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
    phone: {
      type: String
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

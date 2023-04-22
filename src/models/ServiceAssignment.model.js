import { Schema, model } from 'mongoose'

const ServiceAssignmentSchema = new Schema({
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
  }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true
})

export default model('ServiceAssignment', ServiceAssignmentSchema)

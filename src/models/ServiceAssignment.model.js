import { Schema, model } from 'mongoose'

const ServiceAssignmentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  vehicle: {
    type: String
  },
  jobName: {
    type: String
  },
  jobNumber: {
    type: String
  },
  employee: {
    type: String
  }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true
})

ServiceAssignmentSchema.virtual('displayName')
  .get(function () {
    if (this.vehicle) {
      return this.vehicle + ' - ' + this.employee
    } else if (this.jobName) {
      return this.jobName + ' - ' + this.jobNumber
    } else {
      return this.employee
    }
  })

export default model('ServiceAssignment', ServiceAssignmentSchema)

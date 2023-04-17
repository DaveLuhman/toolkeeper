import { Schema, model } from 'mongoose'

const ServiceAssignmentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
    get: (_id) => _id.toString()
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
// write a setter that changes the _id to a string
ServiceAssignmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})

export default model('serviceAssignment', ServiceAssignmentSchema)

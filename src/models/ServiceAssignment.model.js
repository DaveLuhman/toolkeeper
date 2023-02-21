import { Schema, model } from 'mongoose'

const ServiceAssignment = new Schema({
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

ServiceAssignment.virtual('displayName')
  .get(function () {
    if (this.vehicle) {
      return this.vehicle + ' ' + this.employee
    } else if (this.jobName) {
      return this.jobName + ' ' + this.jobNumber
    } else {
      return this.employee
    }
  })

export default model('serviceAssignment', ServiceAssignment)

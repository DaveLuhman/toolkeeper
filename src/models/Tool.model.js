import { Schema, model } from 'mongoose'

const toolSchema = new Schema(
  {
    serialNumber: {
      type: String,
      upperCase: true,
      unique: true
    },
    partNumber: {
      type: String,
      upperCase: true
    },
    barcode: {
      type: Number
    },
    status: {
      type: String
    },
    serviceAssignment: {
      type: String,
      ref: 'ServiceAssignment.displayName'
    },
    category: {
      type: String,
      ref: 'Category.name'
    },
    description: {
      type: String,
      maxLength: 128
    },
    manufacturer: {
      type: String,
      trim: true
    },
    archived: {
      type: Boolean,
      default: false
    },
    createdBy: {
      ref: 'User.displayName',
      type: Schema.Types.ObjectId
    },
    updatedBy: {
      ref: 'User.displayName',
      type: Schema.Types.ObjectId
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true,
    strict: false
  }
)

toolSchema.findAll = function (callback) {
  return this.model('tool').find({}, callback)
}

const Tool = model('tool', toolSchema)

export default Tool

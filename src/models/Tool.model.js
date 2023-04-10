import { Schema, model } from 'mongoose'

const toolSchema = new Schema(
  {
    serialNumber: {
      type: String,
      upperCase: true,
      unique: true,
      maxLength: 32
    },
    partNumber: {
      type: String,
      upperCase: true,
      maxLength: 32
    },
    barcode: {
      type: Number,
      maxLength: 32
    },
    status: {
      type: String,
      enum: ['Checked In', 'Checked Out', 'Missing']
    },
    serviceAssignment: {
      type: String,
      maxLength: 32
    },
    category: {
      type: Schema.ObjectId,
      ref: 'category'
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
      refPath: 'User.displayName',
      type: Schema.Types.ObjectId
    },
    updatedBy: {
      refPath: 'User.displayName',
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

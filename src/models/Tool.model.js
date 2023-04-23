import { Schema, model } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const toolSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
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
      type: Schema.Types.ObjectId,
      ref: 'ServiceAssignment',
      autopopulate: { select: 'name' }
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      autopopulate: { select: 'name' }
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
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
    strict: false
  }
)

toolSchema.findAll = function (callback) {
  return this.model('tool').find({}, callback)
}

// write a setter that changes the _id to a string called id
toolSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})
toolSchema.plugin(mongooseAutoPopulate)

const Tool = model('tool', toolSchema)

export default Tool

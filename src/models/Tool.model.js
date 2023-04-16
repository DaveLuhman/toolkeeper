import { Schema, model } from 'mongoose'

const toolSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
      get: (_id) => _id.toString()
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
      type: String,
      maxLength: 32
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
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
toolSchema.add = function (tool, callback) {
  return this.model('tool').create(tool, callback)
}
toolSchema.findById = function (id, callback) {
  return this.model('tool').findOne({ _id: id }, callback)
}
toolSchema.update = function (id, tool, callback) {
  return this.model('tool').findByIdAndUpdate(id, tool, callback)
}
// write a setter that changes the _id to a string
toolSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})
const Tool = model('tool', toolSchema)

export default Tool

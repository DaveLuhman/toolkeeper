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
      maxLength: 32,
      trim: true
    },
    modelNumber: {
      type: String,
      upperCase: true,
      maxLength: 32,
      trim: true
    },
    barcode: {
      type: Number,
      maxLength: 32,
      trim: true
    },
    toolID: {
      type: String,
      upperCase: true,
      required: false,
      trim: true
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
      maxLength: 128,
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    material: {
      type: Schema.Types.ObjectId,
      ref: 'Material'
    },
    size: {
      width: {
        type: String
      },
      height: {
        type: String
      },
      length: {
        type: String
      },
      weight: {
        type: String
      }
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

toolSchema.virtual('status')
 .get(function () {
  if(this.serviceAssignment == undefined) return 'Unavailable'
  switch(this.serviceAssignment.type) {
    case 'stockroom': return 'Checked In'
    case 'contractJob': return 'Checked Out'
    case 'serviceJob': return 'Checked Out'
    case 'employee': return 'Checked Out'
    case 'vehicle': return 'Checked Out'
    case undefined: return 'Checked In'
    default: return 'Checked In'
  }
 })

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

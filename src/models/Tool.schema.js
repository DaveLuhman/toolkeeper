import { Schema } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const ToolSchema = new Schema(
  {
    serialNumber: {
      type: String,
      upperCase: true,
      unique: true,
      maxLength: 32,
      trim: true,
      required: true
    },
    modelNumber: {
      type: String,
      upperCase: true,
      maxLength: 32,
      trim: true
    },
    barcode: {
      type: String,
      maxLength: 32,
      trim: true,
      required: true
    },
    toolID: {
      type: String,
      upperCase: true,
      trim: true
    },
    serviceAssignment: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceAssignment',
      autopopulate: true,
      default: '64a34b651288871770df1086'
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      autopopulate: true,
      default: '64a1c3d8d71e121dfd39b7ab'
    },
    description: {
      type: String,
      maxLength: 128,
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true
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
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      default: '66af881237c17b64394a4166',
      required: true
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: false
  }
)
ToolSchema.index({ serialNumber: 1, tenant: 1 }, { unique: true });

ToolSchema.findAll = function (callback) {
  return this.model('tool').find({}, callback)
}

ToolSchema.virtual('status').get(function () {
  if (this?.serviceAssignment === undefined) return 'Undefined'
  switch (this.serviceAssignment?.type) {
    case 'Stockroom':
      return 'Checked In'
    case 'Contract Jobsite':
      return 'Checked Out'
    case 'Service Jobsite':
      return 'Checked Out'
    case 'Employee':
      return 'Checked Out'
    case 'Vehicle':
      return 'Checked Out'
    default:
      return 'Unavailable'
  }
})

// write a setter that changes the _id to a string called id
ToolSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    ret._id = undefined
  }
})
ToolSchema.plugin(mongooseAutoPopulate)



export default ToolSchema

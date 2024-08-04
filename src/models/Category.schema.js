import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const CategorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    prefix: {
      type: String,
      required: false,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false,
      maxLength: 64
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
)
CategorySchema.plugin(mongooseUniqueValidator)

export default CategorySchema

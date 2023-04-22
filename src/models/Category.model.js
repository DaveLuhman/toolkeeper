import { Schema, model } from 'mongoose'

const CategorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
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
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true
})

// eslint-disable-next-line new-cap
export default model('Category', CategorySchema)

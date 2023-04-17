import { Schema, model } from 'mongoose'

const CategorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
    get: (_id) => _id.toString()
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 64
  }
})

// write a setter that changes the _id to a string
CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})

// eslint-disable-next-line new-cap
export default model('Category', CategorySchema)

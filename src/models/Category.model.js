import { Schema, model } from 'mongoose'

const CategorySchema = new Schema({
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

// write a getter that changes the _id to a string
CategorySchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
  }
})

// eslint-disable-next-line new-cap
export default model('Category', CategorySchema)

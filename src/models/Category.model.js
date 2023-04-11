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
// eslint-disable-next-line new-cap
export default model('Category', CategorySchema)

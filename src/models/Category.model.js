import { Schema, model } from 'mongoose'

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxLength: 64
  }
})
export default model('Category', CategorySchema)

import { Schema, model } from 'mongoose'

const ToolCategory = new Schema({
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
export default model('toolCategory', ToolCategory)

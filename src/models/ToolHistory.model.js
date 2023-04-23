/* eslint-disable camelcase */
import { Schema, model } from 'mongoose'
const toolHistorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: false
  },
  history: []
}, {
  strict: false,
  timestamps: true
})
const ToolHistory = model('toolHistory', toolHistorySchema)

export default ToolHistory

/* eslint-disable camelcase */
import { Schema, model } from 'mongoose'
const ToolHistorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: false
  },
  history: [{
    type: Schema.Types.ObjectId,
    ref: 'tool'
  }]
})
const Tool_History = model('tool_history', ToolHistorySchema)

export default Tool_History

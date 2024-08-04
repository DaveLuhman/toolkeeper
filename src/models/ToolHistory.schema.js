/* eslint-disable camelcase */
import { Schema, model } from 'mongoose'
const ToolHistorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: false
    },
    history: []
  },
  {
    strict: false,
    timestamps: true
  }
)
export default ToolHistorySchema

/* eslint-disable camelcase */
import { Schema, model } from 'mongoose'
const ToolHistorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: false
    },
    history: [],
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      default: '66af881237c17b64394a4166',
      required: true
    }
  },
  {
    strict: false,
    timestamps: true
  }
)
export default ToolHistorySchema

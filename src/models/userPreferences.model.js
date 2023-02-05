import { Schema, model } from 'mongoose'
const userPreferences = new Schema({
  owner: {
    type: 'User',
    ref: 'Schema.Types.ObjectId'
  },
  theme: {
    type: String,
    default: 'light'
  },
  language: {
    type: String,
    default: 'en'
  },
  sortField: {
    type: String,
    default: 'serialNumber'
  },
  sortOrder: {
    type: String,
    default: 'asc'
  },
  pageSize: {
    type: Number,
    default: 10
  }
})
export default model('userPreferences', userPreferences)

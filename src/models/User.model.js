import { Schema, model } from 'mongoose'
// This code creates a new schema that is used to define the User model
// The schema contains the fields for a user, as well as the timestamps
// that are automatically added when the user is created and updated
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String
    },
    role: {
      type: String
      // TODO: Build getter/setter for field validation
      // enum: ['User', 'Manager', 'Admin'],
    },
    category: {
      type: Object,
      ref: 'Category'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    },
    preferences: {
      type: Object,
      default: {
        theme: 'default',
        sortField: 'serialNumber',
        sortDirection: 'asc',
        pageSize: 10
      }
    }
  },
  {
    timestamps: true
  }
)

// Create a virtual property `displayName` with a getter and setter.
UserSchema.virtual('displayName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`
  })
  .set(function (v) {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const firstName = v.substring(0, v.indexOf(' '))
    const lastName = v.substring(v.indexOf(' ') + 1)
    this.set({ firstName, lastName })
  })

const User = model('User', UserSchema)
export default User

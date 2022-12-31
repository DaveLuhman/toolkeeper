const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type:String,
        trim: true
    },
    lastName: {
        type:String,
        trim: true
    },
    email: {
        type:String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type:String
    },
    role: {
        type:String,
        enum: ['User', 'Manager','Admin'],},
    disabled: {
        type:Boolean,
        default: false},
    lastLogin: {
        type:Date
    },

},{
    timestamps: true,
});

// Create a virtual property `displayName` with a getter and setter.
userSchema.virtual('displayName').
  get(function() { return `${this.firstName} ${this.lastName}`; }).
  set(function(v) {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
  });
// update lastLogin on login
userSchema.pre('save', function(next) {
    this.lastLogin = Date.now();
    next();
    });


module.exports = mongoose.model('User', userSchema, "users");
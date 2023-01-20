const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    expires: Date,
    session: {
        cookie: {
            originalMaxAge: Number,
            expires: Date,
            secure: Boolean,
            httpOnly: Boolean,
            path: String,
            domain: String,
            sameSite: String
        },
        passport: {
            user: String
        }
    }


}, {})


const Session = mongoose.model('session', sessionSchema, "sessions")

module.exports = Session
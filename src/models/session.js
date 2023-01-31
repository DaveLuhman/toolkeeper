import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
    _id: Schema.Types.ObjectId,
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


const Session = model('session', sessionSchema, "sessions")

export default Session
import passport from 'passport'
import User from '../models/User.model.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { compare } from 'bcrypt'

const passportConfig = (app) => {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      console.info(`[AUTH] ${email} attempting login`.blue.bold)
      const user = await User.findOne({ email: { $eq: email } })
      if (!user) {
        return done(null, false, { message: 'That email is not registered'.red })
      }
      if (user.isDisabled === true) {
        return done(null, false, { message: 'That user has been disabled. Contact your manager' })
      }
      compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect'.red })
        }
      })
    })
  )

  // stores user to session
  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}

export default passportConfig

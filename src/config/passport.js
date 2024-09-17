import passport from 'passport'
import { User } from '../models/index.models.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { compare } from 'bcrypt'

/**
 * Configures passport for authentication handling.
 * @param {object} _app - The Express application instance for configuring middlewares and routes.
 */
const passportConfig = (_app) => {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      console.info(`[AUTH] ${email} attempting login`.blue.bold)
      const user = await User.findOne({ email: { $eq: email } })
      if (!user) {
        return done(null, false, { message: 'That email is not registered' })
      }
      if (user.isDisabled === true) {
        return done(null, false, { message: 'That user has been disabled. Contact your manager' })
      }
      compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        }
          return done(null, false, { message: 'Password incorrect' })
      })
    })
  )

  // stores user to session
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}

export default passportConfig

// src\config\passport.js

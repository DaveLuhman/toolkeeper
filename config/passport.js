import passport from 'passport';
import User from '../models/user.js';
import { Strategy as localStrategy } from 'passport-local';
import { compare } from 'bcrypt';

const passportConfig = (app) => {

  passport.use(new localStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      console.log(` ${email} attempting login`.green.bold)
      let user = await User.findOne({ email: email })
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }
      compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    })
  )

  // stores user to session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // retrieves user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default passportConfig;
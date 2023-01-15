const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('../models/user');

 function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        console.table(`Passport is setting the user as ${user}`)
        if (user == null) { return done(null, false, { message: 'No user with that email' }) }
        try {
            if (bcrypt.compare(password, user.password)) {

                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {return done(e)}
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
     })

}

module.exports = initialize
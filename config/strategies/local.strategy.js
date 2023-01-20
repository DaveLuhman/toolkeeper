import passport from 'passport';
import { Strategy } from 'passport-local';

const localStrategy = () => {
    passport.use(new Strategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            // Match user
            let user = await findOne({ email: email })
            console.log(`User ${user.displayName} logged in`.green.bold)
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
};

export default localStrategy;
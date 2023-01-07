//load bcrypt
const bCrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models').User;
const LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findOneByID(id).then(user => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  passport.use(
    'local-register',
    new LocalStrategy({ passReqToCallback: true },
      (_req, email, password, done) => {
        const generateHash = password => {
          return bCrypt.hashSync(password, 8);
        };
        User.findOne({ where: { email: email } }).then(user => {
          if (user) {
            return done(null, false, {
              message: 'That email is already taken'
            });
          } else {
            const userPassword = generateHash(password);
            let data = {
              email: email,
              password: userPassword,
            };

            User.create(data).then((newUser, created) => {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );

  //LOCAL SIGNIN
  passport.use(
    'local-auth',
    new LocalStrategy({ passReqToCallback: true }, (_req, email, password, done) => {
      const isValidPassword = (hashedPassword, password) => {
        return bCrypt.compareSync(hashedPassword, password);
      };
      User.findOne({ where: { email: email } })
        .then(user => {
          if (!user) {
            console.log=('User not found with email ' + email)
            return done(null, false, { message: 'Incorrect Email / Password' });
          }
          let hash = user.password;

          if (!isValidPassword(password, hash)) {
            console.log=('Incorrect password')
            return done(null, false, { message: 'Incorrect Email / Password' });
          }
          let userinfo = user.get();
          return done(null, userinfo);
        })
        .catch(err => {
          console.log('Error:', err);
          return done(null, false, {
            message: 'Something unknown went wrong with your sign-in'
          });
        });
    }
    )
  );
  passport.use(
    'password-reset',
    new LocalStrategy({ passReqToCallback: true },
      (req, email, newPassword, done) => {
        if (!req.isAuthenticated) {
          return done(null, false)
        }
        const generateHash = (newPassword) => {
          return bCrypt.hashSync(newPassword, 8);
        };
        User.findOne({ where: { email: email } }).then(user => {
          if (user) {
            const userPassword = generateHash(newPassword);
            let data = {
              password: userPassword,
            };

            User.update(data).then((updated) => {
              if (!newPassword) {
                return done(null, false);
              }

              if (newPassword) {
                return done(null, newUser);
              }
            })
          }
        })
      }
    ))


//load bcrypt
const bCrypt = require('bcrypt');

module.exports = (passport, user) => {
  const User = user;
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
    'local-signup',
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
    'local-signin',
    new LocalStrategy({ passReqToCallback: true }, (_req, email, password, done) => {
      let User = user;
      let isValidPassword = (hashedPassword, password) => {
        return bCrypt.compareSync(hashedPassword, password);
      };
      User.findOne({ where: { email: email } })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Incorrect Email / Password' });
          }
          let hash = user.password;
          console.log(hash);
          if (!isValidPassword(password, hash)) {
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
    }

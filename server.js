const express = require('express');
const morgan = require('morgan') // logging
const path = require('path');
const _colors = require('colors');
require('dotenv').config("../.env");
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser') // middleware
const exphbs = require('express-handlebars'); // templating engine
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
var MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const { authenticateMiddleware } = require('./middleware/auth.js');
//Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  console.log('>>>>> Morgan enabled for logging in this development environment')
}
//database stuff
connectDB();
let store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

//handlebars config
// Handlebars
app.engine('.hbs',
    exphbs.engine({
        extname: '.hbs',
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }));
app.set('view engine', '.hbs');
app.set('views', './views');

// Express Middleware
app.use(express.static(path.join(__dirname, 'public'))); //Serve Static Files
app.use(bodyParser.json()) // JSON Body Parser
app.use(bodyParser.urlencoded({ extended: true }))  // URL Encoded Body Parser
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded values
app.use(cookieParser());
app.use(session({
  store: store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,  maxAge: 1000 * 60 * 60 * 24  }
}))
app.use(flash());

// Configure passport middleware
const passport = require('passport') //auth toolkit
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/user') // mongoose model for userAuth
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PUBLIC SECURITY CONTEXT
app.use('/' , require('./routes/index.js'));
// PUBLIC SECURITY CONTEXT

// HTTP Page rendering Routes (User Context)
app.use('/user', authenticateMiddleware, require('./routes/user.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/tool',  require('./routes/tool.js'));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
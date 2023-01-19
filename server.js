const express = require('express');
require('dotenv').config("../.env");
const PORT = process.env.PORT || 5000;
const morgan = require('morgan') // logging
const path = require('path');
const _colors = require('colors');
const bodyParser = require('body-parser') // middleware
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars'); // templating engine
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const handlebarsHelpers = require('handlebars-helpers')
const paginate = require('handlebars-paginate');
const app = express();

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

const hbs = exphbs.create({
  helpers: {
    paginate: paginate,
    ...handlebarsHelpers(),
  },
  extname: '.hbs',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
})

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

// Express Middleware
app.use(express.static(path.join(__dirname, 'public'))); //Serve Static Files
app.use(bodyParser.json()) // JSON Body Parser
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: false }))  // URL Encoded Body Parser
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded values
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  store: store
}))
app.use(flash());
const passport = require('passport')
require('./config/passport')(passport);
app.use(passport.initialize()) // Initialize Passport
app.use(passport.session()) // Use Passport for Sessions

const { checkAuth } = require('./middleware/auth.js');

// HTTP Page rendering Routes (User Context)
app.use('/user', checkAuth, require('./routes/user.js'));
app.use('/dashboard', checkAuth, require('./routes/dashboard.js'));
app.use('/tool', checkAuth, require('./routes/tool.js'));
// HTTP Page rendering Routes (No User Context)
app.use('/', require('./routes/index.js'));
// Public Context End
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
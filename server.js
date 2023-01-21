import colors from 'colors';
import 'body-parser';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import flash from 'express-flash';
import { create } from 'express-handlebars'; // templating engine
import session from 'express-session';
import handlebarsHelpers from 'handlebars-helpers';
import paginate from 'handlebars-paginate';
import morgan from 'morgan'; // logging
import passport from 'passport';
import connectDB from './config/db.js';
import passportConfig from './config/passport.js';
import { checkAuth } from './middleware/auth.js';
import { default as dashboardRouter} from './routes/dashboard.js';
import { default as toolRouter }  from './routes/tool.js';
import { default as userRouter } from './routes/user.js';
import { default as indexRoutes } from './routes/index.js';
dotenv.config()
const MongoDBStore = connectMongoDBSession(session);
const PORT = process.env.PORT || 5000;

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

const hbs = create({
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
app.use(express.static('public')); //Serve Static Files
app.use(express.json()) // JSON Body Parser
app.use(fileUpload())
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
// Passport
passportConfig(passport);

// Routes (No User Context)
app.use('/', indexRoutes);
// Routes (User Context)
app.use('/user', checkAuth, userRouter);
app.use('/dashboard',  checkAuth, dashboardRouter);
app.use('/tool',  checkAuth, toolRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
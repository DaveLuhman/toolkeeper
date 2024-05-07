// dev depenancies
// eslint-disable-next-line no-unused-vars
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
// db depenancies
import connectMongoDBSession from 'connect-mongodb-session'
import connectDB from './config/db.js'
// express depenancies
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import express from 'express'
import fileUpload from 'express-fileupload'
import flash from 'express-flash'
import session from 'express-session'
import helmet from 'helmet'
// handlebars depenancies
import { create } from 'express-handlebars' // templating engine
import handlebarsHelpers from 'handlebars-helpers'
import paginate from 'handlebars-paginate'
// auth depenancies
import passport from 'passport'
import { checkAuth, isManager } from './middleware/auth.js'
import passportConfig from './config/passport.js'
// utility depenancies
import { getCategoryName } from './middleware/category.js'
import { getServiceAssignmentName } from './middleware/serviceAssignment.js'
import {
  isSelected,
  populateDropdownItems,
  rateLimiter,
  getPackageVersion
} from './middleware/util.js'
// routers
import { dashboardRouter } from './routes/dashboard.routes.js'
import { indexRouter } from './routes/index.routes.js'
import { settingsRouter } from './routes/settings/index.routes.js'
import { toolRouter } from './routes/tool.routes.js'
import { userRouter } from './routes/user.routes.js'

// use the imported dependencies as needed in the server.js file

dotenv.config({ path: './src/config/.env', debug: true }) // Load environment variables
const MongoDBStore = connectMongoDBSession(session)
const PORT = process.env.PORT || 5000
const app = express() // Create Express App

connectDB() // Connect to MongoDB and report status to console
// create mongo store for session persistence
const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})
// Configure session options
const sessionConfig = {
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 }
}
// If in production, use secure cookies and mongo store
if (process.env.NODE_ENV === 'production') {
  sessionConfig.cookie = {
    secure: true,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24
  }
  sessionConfig.store = mongoStore
  // app.use(helmet()) // Add Helmet for HTTP Header controls
}

// Morgan Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  console.info(
    '[INIT]>>>>> Morgan enabled for logging in this development environment'.yellow
  )
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'script-src': ["'unsafe-inline'", "'self'"], // allow client-side inline scripting
        'script-src-attr': ["'unsafe-inline'"]
      }
    })
  ) // Allow inline scripts for development
}
// Handlebars Setup
const hbs = create({
  helpers: {
    isSelected,
    getCategoryName,
    getServiceAssignmentName,
    paginate,
    getPackageVersion,
    ...handlebarsHelpers()
  },
  extname: '.hbs',
  defaultLayout: 'main',
  partialsDir: ['./src/views/partials', './src/views/partials/modals'],
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './src/views')
app.set('trust proxy', true)

// Express Middleware
app.use(cookieParser())
if (process.NODE_ENV === 'PRODUCTION') app.use(csurf({ cookie: true })) // Cross Site Request Forgery protection middleware
app.use(express.static('./src/public')) // Serve Static Files
app.use(fileUpload())
app.use(express.json()) // JSON Body Parser
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded values
app.use(session(sessionConfig))
app.use(flash())
// Passport
passportConfig(app)
app.use(passport.initialize())
app.use(passport.session())

app.use(rateLimiter)

// Routes (No User Context)
app.use('/', indexRouter)
// Routes (User Context)
app.use(checkAuth)
app.use(populateDropdownItems)
app.use('/user', userRouter)
app.use('/dashboard', dashboardRouter)
app.use('/tool', toolRouter)
app.use(isManager)
app.use('/settings', settingsRouter)
// catch 404 and forward to error handler
app.use((_req, res) => {
  res.status(404).render('error/404', { layout: 'public', title: '404' })
})

app.listen(PORT, () => {
  console.info(`[INIT] Server is running at http://localhost:${PORT}`.bgWhite.black)
})

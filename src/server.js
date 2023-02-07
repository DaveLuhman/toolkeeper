import 'body-parser'
import helmet from 'helmet'
// eslint-disable-next-line no-unused-vars
import colors from 'colors'
// eslint-disable-next-line import/no-named-default
import { default as connectMongoDBSession } from 'connect-mongodb-session'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import flash from 'express-flash'
import { create } from 'express-handlebars' // templating engine
import session from 'express-session'
import handlebarsHelpers from 'handlebars-helpers'
import paginate from 'handlebars-paginate'
import morgan from 'morgan' // logging
import passport from 'passport'
import connectDB from './config/db.js'
import passportConfig from './config/passport.js'
import { rateLimiter } from './config/util.config.js'
import { checkAuth, isManager } from './middleware/auth.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { indexRouter } from './routes/index.routes.js'
import { managerRouter } from './routes/manager.routes.js'
import { toolRouter } from './routes/tool.routes.js'
import { userRouter } from './routes/user.routes.js'
dotenv.config()
const MongoDBStore = connectMongoDBSession(session)
const PORT = process.env.PORT || 5000

const app = express() // Create Express App

connectDB() // Connect to MongoDB and report status to console
// create mongo store for session persistence
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})
// Configure session options
const sessionConfig = {
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 }
}
// If in production, use secure cookies and mongo store
if (process.env.NODE_ENV === 'production') {
  sessionConfig.cookie = { secure: true, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 }
  sessionConfig.store = store
}

// Morgan Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  console.info(
    '[INIT]>>>>> Morgan enabled for logging in this development environment'
  )
}
// Handlebars Setup
const hbs = create({
  helpers: {
    paginate,
    ...handlebarsHelpers()
  },
  extname: '.hbs',
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './src/views')

// Express Middleware
app.use(helmet()) // Add Helmet for HTTP Header controls
app.use(express.static('./src/public')) // Serve Static Files
app.use(express.json()) // JSON Body Parser
app.use(fileUpload())
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded values
app.use(cookieParser())
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
app.use('/user', userRouter)
app.use('/dashboard', dashboardRouter)
app.use('/tool', toolRouter)
app.use(isManager)
app.use('/manager', managerRouter)
// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.listen(PORT, () => {
  console.info(`[INIT] Server is running on port ${PORT}`)
})

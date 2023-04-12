// server.js
import {
  checkAuth,
  connectDB,
  connectMongoDBSession,
  cookieParser,
  create,
  csurf,
  dashboardRouter,
  dotenv,
  express,
  fileUpload,
  flash,
  getCategoryName,
  handlebarsHelpers,
  helmet,
  indexRouter,
  isManager,
  isSelected,
  listCategoryNames,
  morgan,
  paginate,
  passport,
  passportConfig,
  rateLimiter,
  session,
  settingsRouter,
  toolRouter,
  userRouter
} from './config/dependencies.js'

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
  secret: process.env.SESSION_KEY,
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
  app.use(helmet()) // Add Helmet for HTTP Header controls
}

// Morgan Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  console.info(
    '[INIT]>>>>> Morgan enabled for logging in this development environment'
  )
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'script-src': ["'unsafe-inline'", "'self'"] // allow client-side inline scripting
      }
    })
  ) // Allow inline scripts for development
}
// Handlebars Setup
const hbs = create({
  helpers: {
    isSelected,
    getCategoryName,
    paginate,
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

// Express Middleware
app.use(csurf({ cookie: true })) // Cross Site Request Forgery protection middleware
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
app.use(listCategoryNames)
app.use('/user', userRouter)
app.use('/dashboard', dashboardRouter)
app.use('/tool', toolRouter)
app.use(isManager)
app.use('/settings', settingsRouter)
// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.listen(PORT, () => {
  console.info(`[INIT] Server is running on port ${PORT}`)
})

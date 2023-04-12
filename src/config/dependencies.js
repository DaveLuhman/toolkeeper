// dependencies.js

import bodyParser from 'body-parser'
import helmet from 'helmet'
import colors from 'colors'
import connectMongoDBSession from 'connect-mongodb-session'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import flash from 'express-flash'
import handlebarsHelpers from 'handlebars-helpers'
import paginate from 'handlebars-paginate'
import morgan from 'morgan'
import passport from 'passport'
import csurf from 'csurf'
import connectDB from './config/db.js'
import passportConfig from './config/passport.js'
import { rateLimiter } from './config/util.config.js'
import { checkAuth, isManager } from './middleware/auth.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { indexRouter } from './routes/index.routes.js'
import { settingsRouter } from './routes/settings/index.routes.js'
import { toolRouter } from './routes/tool.routes.js'
import { listCategoryNames, getCategoryName } from './middleware/category.js'
import { isSelected } from './middleware/util.js'

export {
  bodyParser,
  helmet,
  colors,
  connectMongoDBSession,
  cookieParser,
  dotenv,
  express,
  fileUpload,
  flash,
  handlebarsHelpers,
  paginate,
  morgan,
  passport,
  csurf,
  connectDB,
  passportConfig,
  rateLimiter,
  checkAuth,
  isManager,
  dashboardRouter,
  indexRouter,
  settingsRouter,
  toolRouter,
  listCategoryNames,
  getCategoryName,
  isSelected
}

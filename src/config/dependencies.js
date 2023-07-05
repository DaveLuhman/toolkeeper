// dependencies.js
// dev depenancies
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
// db depenancies
import connectMongoDBSession from 'connect-mongodb-session'
import connectDB from './db.js'
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
import { checkAuth, isManager } from '../middleware/auth.js'
import passportConfig from './passport.js'
// utility depenancies
import { getCategoryName } from '../middleware/category.js'
import { getServiceAssignmentName } from '../middleware/serviceAssignment.js'
import {
  isSelected,
  populateDropdownItems,
  rateLimiter
} from '../middleware/util.js'
// routers
import { dashboardRouter } from '../routes/dashboard.routes.js'
import { indexRouter } from '../routes/index.routes.js'
import { settingsRouter } from '../routes/settings/index.routes.js'
import { toolRouter } from '../routes/tool.routes.js'
import { userRouter } from '../routes/user.routes.js'

export {
  checkAuth,
  colors,
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
  getServiceAssignmentName,
  handlebarsHelpers,
  helmet,
  indexRouter,
  isManager,
  isSelected,
  morgan,
  paginate,
  passport,
  passportConfig,
  populateDropdownItems,
  rateLimiter,
  session,
  settingsRouter,
  toolRouter,
  userRouter
}

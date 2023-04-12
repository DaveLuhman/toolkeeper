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
import passportConfig from './passport.js'
import { checkAuth, isManager } from '../middleware/auth.js'
// utility depenancies
import { getCategoryName, listCategoryNames } from '../middleware/category.js'
import { isSelected } from '../middleware/util.js'
import { rateLimiter } from './util.config.js'
// routers
import { dashboardRouter } from '../routes/dashboard.routes.js'
import { indexRouter } from '../routes/index.routes.js'
import { settingsRouter } from '../routes/settings/index.routes.js'
import { toolRouter } from '../routes/tool.routes.js'
import { userRouter } from '../routes/user.routes.js'

export {
  checkAuth, colors, connectDB, connectMongoDBSession,
  cookieParser, create, csurf, dashboardRouter, dotenv,
  express,
  fileUpload,
  flash, getCategoryName, handlebarsHelpers, helmet, indexRouter, isManager, isSelected, listCategoryNames, morgan, paginate, passport, passportConfig,
  rateLimiter, session, settingsRouter, userRouter,
  toolRouter
}

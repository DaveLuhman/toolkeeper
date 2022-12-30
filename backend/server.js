const express = require('express');
const morgan = require('morgan') // logging
const path = require('path');
const _colors = require('colors');
require('dotenv').config("../.env");
const PORT = process.env.PORT || 5555;
const { errorHandler } = require('./middleware/error.js')
const bodyParser = require('body-parser') // middleware
const connectDB = require('../config/db.config');
const app = express();

// Passport Import and Config
const passport = require('passport') //auth toolkit
const User = require('/backend/models/user') // mongoose model for userAuth
require('./config/passport.js')(passport, User); // passport import
const expressSession = require('express-session') // session storage middleware
const { ensureAuth } = require('./middleware/auth') // auth middleware to protect routes

//Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  console.log('>>>>> Morgan enabled for logging in this development environment')
}
connectDB();

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); //Serve Static Files
app.use(bodyParser.json()) // JSON Body Parser
app.use(bodyParser.urlencoded({ extended: true }))  // URL Encoded Body Parser
app.use(express.json())  // JSON support on Express
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/*+json' })) // JSON Body Parser

app.use('/' , require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));

app.use(errorHandler)
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
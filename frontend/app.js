const express = require('express')
const app = express()
require('dotenv').config("../.env")

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser') // middleware
const path = require('path')

const PORT = process.env.FRONT_END_PORT || 5000

// Handlebars
// Handlebars
app.engine(
    '.hbs',
    exphbs.engine({
      defaultLayout: 'main',
      extname: '.hbs',
    })
  );
  app.set('view engine', '.hbs');

app.set('views', './frontend/views');

// Express Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); //Serve Static Files
app.use(bodyParser.json()) // JSON Body Parser
app.use(bodyParser.urlencoded({ extended: true }))  // URL Encoded Body Parser
app.use(express.json())  // JSON support on Express
app.use(express.urlencoded({ extended: true }))

app.use('/' , require('./routes/index.js'));

app.listen(PORT , ()=> console.log('> Server is up and running on port : ' + PORT))
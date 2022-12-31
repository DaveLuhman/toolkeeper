const express = require('express')
const app = express()
require('dotenv').config("../config/.env")
const PORT = process.env.FRONT-END-PORT || 5000

// Handlebars
app.engine('.hbs',
    exphbs.engine({
        extname: '.hbs',
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }));
app.set('view engine', '.hbs');

// Express Middleware
app.use(express.static(path.join(__dirname, 'public'))); //Serve Static Files
app.use(bodyParser.json()) // JSON Body Parser
app.use(bodyParser.urlencoded({ extended: true }))  // URL Encoded Body Parser
app.use(express.json())  // JSON support on Express
app.use(express.urlencoded({ extended: true }))

app.use('/' , require('./routes/index.js'));

app.listen(PORT , ()=> console.log('> Server is up and running on port : ' + port))
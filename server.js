const express = require('express')
var app = express()

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const cors = require('cors')

var config = require('./config/config')
var con = require('./config/db')

/**
 * access the .env file from the package of dotenv
 */
require('dotenv').config()

/**
 * access the requested encoded request parameters
 * from the package of body-parser
 */
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser)

/**
 * middleware for cross orgin request error
 */
app.use(cors())

/**
 * Verify the user token as part from authentication
 */
verifyToken = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (authHeader == undefined) {
        res.status(401).send({ error: "Invalid token" })
    }
    let token = authHeader.split(" ")[1]

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            res.status(401).send({ error: "Invalid token" })
        } else {
            next();
        }
    })
}

/**
 * import all user related apis.
 */
var userApi = require('./api/routes/user')

app.use(userApi)

/**
 * import all book specific apis.
 */
var bookApi = require('./api/routes/book.js')

app.use(verifyToken, bookApi)


/**
 * listen the server to the specific port for loading
 */
app.listen(process.env.APP_PORT, () => {
    console.log('server started')
})
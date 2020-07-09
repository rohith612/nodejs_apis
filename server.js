const express = require('express')
var app = express()


const server = require('http').createServer(app);
var io = require('socket.io')(server);



// app.use(express.static(__dirname + '/bower_components'));

app.get('/chat-room', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
// io.use(verifyToken)

io.on('connection', function (client) {

    console.log(client.id);
    var ipAddress = client.handshake.address;


    client.on('disconnect', () => {
        console.log(ipAddress + 'user disconnected');
    });


    client.on('join', function (data) {
        if (data.token == 100000)
            console.log(ipAddress + ' user connected...');
        else
            client.emit('failed', 'unable to connect the server');
    });

    client.on('messages', function (data) {
        client.emit('broadMe', data);
        client.broadcast.emit('broad', data);
    });

    client.on('typing', function (data) {
        client.broadcast.emit('broadType', data);
    });

});



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
            req.decoded = decoded;
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
server.listen(process.env.APP_PORT, () => {
    console.log('server started')
})


/**
 * @db module for the database connection
 * here used database are mysql
 */
var mysql = require('mysql');
require('dotenv').config()


var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


con.connect((err) => {
    if (err) throw err;
    console.log('connected to database server')
})


module.exports = con;
/**
 * @User module
 */
const express = require('express')
const jwt = require('jsonwebtoken')
const con = require('../../config/db')
const config = require('../../config/config')

const router = express.Router()

/**
 * User authentication 
 * @param : username , password
 */
router.post('/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    if (username == undefined || password == undefined)
        res.status(500).send({ error: "authentication failed" })

    let query = `select * from users where email = '${username}' and password = sha1('${password}')`;

    con.query(query, (err, result) => {
        if (err || result.length == 0) {
            res.status(500).send({ error: "login failed" })
        } else {
            let response = {
                id: result[0].id,
                name: result[0].name
            }

            let token = jwt.sign(response, config.secret, { expiresIn: config.token_exp });
            res.status(200).send({ auth: true, token: token });
        }


    })

})


module.exports = router

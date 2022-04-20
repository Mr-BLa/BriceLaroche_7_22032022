// get the client
const mysql = require('mysql2')
const {promisify} = require("util")

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'groupomania_bdd'
})

connection.query = promisify(connection.query)
connection.execute = promisify(connection.execute)

module.exports = connection

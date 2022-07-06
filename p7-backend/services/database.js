// get the client
const mysql = require('mysql2')
const {promisify} = require("util")

// create the connection to database
const connection = mysql.createConnection({
    // PROCESS.ENV pour ce qui suit
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE
})

connection.query = promisify(connection.query)
connection.execute = promisify(connection.execute)

module.exports = connection

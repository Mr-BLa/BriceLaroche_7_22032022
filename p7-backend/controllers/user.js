/*
*          CONTROLLERS AUTHENTIFICATION
*/

// Import package bcrypt
const bcrypt = require('bcrypt')

// Import package jsonWebToken
const jwt = require('jsonwebtoken')
const connection = require('../services/database')

exports.getAllUsers = (req, res) => {
    // get the client
    connection.query(`SELECT * FROM users`).then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

exports.getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    // get the client
    connection.execute(`SELECT * FROM users WHERE user_id=?`,[id]).then(results => {
        return res.send(results[0])
    }).catch(err=> {
        return res.sendStatus(400)
    })
}




// Création de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // Hacher le mdp
   
}


// Connecter utilisateurs existants
exports.login = (req, res, next) => {
   
}
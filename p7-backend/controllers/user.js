/*
*          CONTROLLERS AUTHENTIFICATION
*/

// Import package bcrypt
const bcrypt = require('bcrypt')

// Import package jsonWebToken
const jwt = require('jsonwebtoken')
const connection = require('../services/database')

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    // Connection BDD MySql
    connection.query(`SELECT * FROM users`).then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Trouver un utilisateur par son Id
exports.getUserById = (req, res, next) => {
    // Connection BDD MySql
    const id = parseInt(req.params.id)
    connection.execute(`SELECT * FROM users WHERE user_id=?`,[id]).then(results => {
        return res.send(results[0])
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Modification d'un utilisateur
exports.modifyUser = (req, res, next) => {
    // Connection BDD MySql
    const id = parseInt(req.auth.userId)
    connection.execute(`UPDATE users SET email = ?`,req.body.email `, username = ?`,req.body.username `, firstname = ?`, req.body.firstname `, lastname = ?`, req.body.lastname `, role = ?`, req.body.role `, bio = ?`, req.body.bio ` WHERE user_id = ?`,[id]).then(modifications => {
        return res.send(modifications)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
    const id = parseInt(req.auth.userId)
    connection.execute(`DELETE FROM users WHERE user_id = ?`,[id]).then(suppr => {
        return res.send(suppr)
    })
    .catch(err => {
        return res.sendStatus(400)
    })
}

// Création de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // Hacher le mdp
    bcrypt.hash(req.body.password, 10)
        // On récupère le hash...
        .then(hash => {
            // ... Qu'on enregistre dans un nouvel User...
            connection.execute("INSERT INTO `users` (`email`, `password`, `username`, `firstname`, `lastname`, `role`, `bio`) VALUES "(req.body.email, hash, req.body.username, req.body.firstname, req.body.lastname, req.body.role, req.body.bio))
                .then(newUser => {
                    return res.send(newUser)
                }).catch(err => {
                    return res.sendStatus(400)
                })
        })
        .catch(err => {
            return res.sendStatus(500)
        })
}

// Connecter utilisateurs existants
exports.login = (req, res, next) => {
    // Retrouver le mail dans la BDD
    connection.query("SELECT `email` FROM `users` WHERE email = ?", req.body.email).then(email => {
        // Si email introuvable
        if (!email) {
            return res.sendStatus(401)
        } else {
            // Si mail présent
            connection.query("SELECT `password` FROM `users` WHERE `email`= ?", email).then(password => {
                bcrypt.compare(req.body.password, password)
                    // Si Mdp incorrect
                    .then(valid => {
                        if (!valid) {
                            return res.sendStatus(401)
                        } else {
                            // Si Mdp correct, renvoyer un user_id + un token
                            connection.query("SELECT `user_id` FROM `users` WHERE `email`= ?", email).then(user_id =>{
                                res.status(200).json({
                                    userId: user_id,
                                    // Utilisation jwt: création et vérification de token
                                    token: jwt.sign(
                                    // Payload: données que l'on veut encoder à l'intérieur du token:
                                        // Objet avec l'userId qui est l'identifiant utilisateur (donc vérification que la requête correspond bien à l'userId)
                                        { userId: user_id },
                                        // Clé secrète pour encodage
                                        process.env.SECRET_KEY,
                                        // Expiration du TOKEN à 24h
                                        { expiresIn: "24h" }
                                    )
                                })
                            })
                            .catch(err => {
                                return res.sendStatus(500)
                            })
                        }
                    })
                    .catch(err => {
                        return res.sendStatus(500)
                    })
            })
            .catch(err => {
                return res.sendStatus(500)
            })
        }
    })
    .catch(err => {
        return res.sendStatus(500)
    })
}
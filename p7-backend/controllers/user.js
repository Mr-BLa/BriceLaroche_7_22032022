/*
*          CONTROLLERS USER
*/

// Import package bcrypt
const bcrypt = require('bcrypt')

// Import package jsonWebToken
const jwt = require('jsonwebtoken')
// Connexion BDD
const connection = require('../services/database')



// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM users ORDER BY `username` ASC").then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Trouver un utilisateur par son Id
exports.getUserById = (req, res, next) => {
    // Connexion BDD MySql + verification présence id
    const id = parseInt(req.params.id)
    connection.execute(`SELECT * FROM users WHERE user_id=?`,[id]).then(results => {
        if (results.length === 0) {
            return res.sendStatus(404)
        } else {
            return res.send(results[0])
        }
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
    const password = req.body.password
    console.log(password)
    // Hacher le mdp
    bcrypt.hash(password, 10)
        // On récupère le hash...
        .then(function(hash){
            console.log("mdp hashé")
            console.log(hash)
            // ... Qu'on enregistre dans un nouvel User...
            connection.execute('INSERT INTO `users` (`email`, `password`, `username`, `firstname`, `lastname`, `role`, `bio`) VALUES (?, ?, ?, ?, ?, ?, ?)',[req.body.email, hash, req.body.username, req.body.firstname, req.body.lastname, req.body.role, req.body.bio])
                .then(newUser => {
                    return res.send(newUser)
                }).catch(err => {
                    console.log(err)
                    console.log("hash passé, mais pas enregistré dans bdd")
                    return res.sendStatus(400)
                })
            return res.sendStatus(200)
        })
        .catch(err => {
            console.log(err)
            console.log("mdp hashé: mais ERREUR")
            return res.sendStatus(500)
        })
}

// Connecter utilisateurs existants
exports.login = (req, res, next) => {
    // Retrouver le mail dans la BDD
    connection.query("SELECT email FROM users WHERE email = ?", req.body.email).then(function(email){
        console.log(email)
        // Si email introuvable
        if (!email) {
            return res.sendStatus(401)
        } else {
            // Si mail présent
            connection.query("SELECT password FROM users WHERE email= ?", req.body.email).then(function(userPassword){
                console.log(req.body.password)
                console.log(userPassword[0])
                let { password } = userPassword[0]
                console.log(password)
                bcrypt.compare(req.body.password, password)
                    // Si Mdp incorrect
                    .then(valid => {
                        if (!valid) {
                            return res.sendStatus(401)
                        } else {
                            // Si Mdp correct, renvoyer un user_id + un token
                            connection.query("SELECT user_id FROM users WHERE email= ?", req.body.email).then(function(userId){
                                let { user_id } = userId[0]
                                res.status(200).json({
                                    user_id: user_id,
                                    // Utilisation jwt: création et vérification de token
                                    token: jwt.sign(
                                    // Payload: données que l'on veut encoder à l'intérieur du token:
                                        // Objet avec l'userId qui est l'identifiant utilisateur (donc vérification que la requête correspond bien à l'userId)
                                        { user_id: user_id },
                                        // Clé secrète pour encodage
                                        process.env.SECRET_KEY,
                                        // Expiration du TOKEN à 24h
                                        { expiresIn: "24h" }
                                    )
                                })
                                console.log(userId)
                                console.log(user_id)
                            })
                            .catch(err => {
                                console.log("1")
                                console.log(err)
                                return res.sendStatus(500)
                            })
                        }
                    })
                    .catch(err => {
                        console.log("2")
                        console.log(err)
                        return res.sendStatus(500)
                    })
            })
            .catch(err => {
                console.log("3")
                console.log(err)
                return res.sendStatus(500)
            })
        }
    })
    .catch(err => {
        console.log("4")
        console.log(err)
        return res.sendStatus(500)
    })
}
/*
*          CONTROLLERS USER
*/


// Import package bcrypt
const bcrypt = require('bcrypt')
// Import package jsonWebToken
const jwt = require('jsonwebtoken')
// Connexion BDD
const connection = require('../services/database')



// POST: SIGN-UP
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
        })
        .catch(err => {
            console.log(err)
            console.log("mdp hashé: mais ERREUR")
            return res.sendStatus(500)
        })
}



// POST: LOGIN
exports.login = (req, res, next) => {
    console.log(req.body)
    // Retrouver le mail dans la BDD
    connection.query("SELECT email FROM users WHERE email = ?", req.body.email).then(function(email){
        // Si email introuvable
        if (!email) {
            return res.sendStatus(401)
        } else {
            // Si mail présent
            connection.query("SELECT password FROM users WHERE email= ?", req.body.email).then(function(userPassword){
                let { password } = userPassword[0]
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
                                        // Objet avec l'userId qui est l'identifiant utilisateur (donc vérification que la requête correspond bien à l'user_id)
                                        { userId: user_id },
                                        // Clé secrète pour encodage
                                        process.env.SECRET_KEY,
                                        // Expiration du TOKEN à 24h
                                        { expiresIn: "24h" }
                                    )
                                })
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


// GET ALL
exports.getAllUsers = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM users ORDER BY `username` ASC").then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}



// GET By ID
exports.getUserById = (req, res, next) => {
    // Connexion BDD MySql + verification présence id
    const id = parseInt(req.params.id)
    console.log(id)
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



// UPDATE: Modification d'un utilisateur
exports.modifyUser = (req, res, next) => {
    // Connection BDD MySql
    //const user_id = parseInt(req.user.user_id)
    const id = parseInt(req.params.id)

    // On passe la commande sql pour enregistrer les modifications dans la bdd
    connection.execute('UPDATE users SET (`username`, `firstname`, `lastname`, `role`, `bio`) VALUES (?, ?, ?, ?, ?, ?)',[req.body.username, req.body.firstname, req.body.lastname, req.body.role, req.body.bio], "WHERE user_id='?'",[id]).then(modifications => {
        console.log(modifications)
        return res.send(modifications)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}



// DELETE: Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
    const id = parseInt(req.params.id)
    connection.execute(`DELETE FROM users WHERE user_id = ?`,[id]).then(suppr => {
        return res.send(suppr)
    })
    .catch(err => {
        return res.sendStatus(400)
    })
}
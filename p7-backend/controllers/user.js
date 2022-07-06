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
exports.signup = (req, res) => {
    const password = req.body.password
    // Hacher le mdp
    bcrypt.hash(password, 10)
        // On récupère le hash...
        .then(function(hash){
            // ... Qu'on enregistre dans un nouvel User...
            connection.execute('INSERT INTO `users` (`email`, `password`, `firstname`, `lastname`, `role`, `bio`) VALUES (?, ?, ?, ?, ?, ?)',[req.body.email, hash, req.body.firstname, req.body.lastname, req.body.role, req.body.bio])
                .then(newUser => {
                    return res.send(newUser)
                }).catch(err => {
                    console.log(err)
                    return res.sendStatus(400)
                })
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(500)
        })
}



// POST: LOGIN
exports.login = (req, res) => {
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
                            connection.query("SELECT user_id, isadmin FROM users WHERE email= ?", req.body.email).then(function(userData){
                                let user_id  = userData[0].user_id
                                let isAdmin  = userData[0].isadmin
                                res.status(200).json({
                                    user_id: user_id,

                                    isAdmin: isAdmin,
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
                                console.log(err)
                                return res.sendStatus(500)
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        return res.sendStatus(500)
                    })
            })
            .catch(err => {
                console.log(err)
                return res.sendStatus(500)
            })
        }
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })
}


// GET ALL
exports.getAllUsers = (req, res) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM users ORDER BY `username` ASC").then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}


// GET By ID
exports.getUserById = (req, res) => {
    const id = parseInt(req.params.id)

    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof id == 'number') {
        connection.execute(`SELECT * FROM users WHERE user_id=?`,[id]).then(results => {
            // Connexion BDD MySql + verification présence id
            if (results.length === 0) {
                return res.sendStatus(404)
            } else {
                return res.send(results[0])
            }
        }).catch(err=> {
            console.log(err)
            return res.sendStatus(400)
        })
    } else {
        return res.sendStatus(400)
    }
}



// UPDATE: Modification d'un utilisateur
exports.modifyUser = (req, res) => {
    // Connection BDD MySql
    const id = parseInt(req.params.id)

    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof id == 'number') {
        // On passe la commande sql pour enregistrer les modifications dans la bdd
        connection.execute(`UPDATE users SET firstname = ?, lastname = ?, role = ?, bio = ? WHERE user_id=?`,[req.body.firstname, req.body.lastname, req.body.role, req.body.bio, id]).then(modifications => {
            return res.send(modifications)
        }).catch(err=> {
            console.log(err)
            return res.sendStatus(400)
        })
    } else {
        return res.sendStatus(400)
    }
    
}



// DELETE: Suppression d'un utilisateur
exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id)
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof id == 'number') {
        connection.execute(`DELETE FROM users WHERE user_id = ?`,[id]).then(suppr => {
            return res.send(suppr)
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(400)
        })
    } else {
        return res.sendStatus(400)
    }
    
}
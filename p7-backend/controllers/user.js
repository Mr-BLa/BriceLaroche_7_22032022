/*
*          CONTROLLERS AUTHENTIFICATION
*/

// Import package bcrypt
const bcrypt = require('bcrypt')

// Import package jsonWebToken
const jwt = require('jsonwebtoken')

// Import Model User
const User = require('../models/User')



// Création de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // Hacher le mdp
    bcrypt.hash(req.body.password, 10)
        // On récupère le hash...
        .then(hash => {
            // ... Qu'on enregistre dans un nouvel User...
            const user = new User({ 
                email: req.body.email,
                password: hash
            })
            //... qu'on enregistre dans la BDD
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch(error => res.status(400).json( error ))
        })
        .catch(error => res.status(500).json( error ))
}


// Connecter utilisateurs existants
exports.login = (req, res, next) => {
    // Retrouver le mail dans la BDD
    User.findOne({ email: req.body.email })
    // Vérifier si on a trouvé un user
    .then(user => {

        // Si l'on n'a pas trouvé de user
        if (!user) {
            return res.status(401).json( 'Utilisateur non trouvé !' )
        }

        // Si on a trouvé un user: on compare le mdp envoyé par la requête, avec le mdp hash enregistré dans notre user
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // Si Mdp incorrect
                if (!valid) {
                return res.status(401).json('Mot de passe incorrect !' )
                }
                // Si Mdp correct, renvoyer un user._id + un token
                res.status(200).json({
                    userId: user._id,
                    // Utilisation jwt: création et vérification de token
                    token: jwt.sign(
                        // Payload: données que l'on veut encoder à l'intérieur du token:

                        // Objet avec l'userId qui est l'identifiant utilisateur (donc vérification que la requête correspond bien à l'userId)
                        { userId: user._id },
                        // Clé secrète pour encodage
                        process.env.SECRET_KEY,
                        // Expiration du TOKEN à 24h
                        { expiresIn: "24h" }
                    )
                })
            })
            .catch(error => res.status(500).json( error ))
    })

    .catch(error => res.status(500).json( error ))
}
/*
*       MIDDLEWARE D'AUTHENTIFICATION
*/

// Import package jsonwebtoken pour vérifier token
const jwt = require('jsonwebtoken')

// Export middleware
module.exports = (req, res, next) => {
    try {
        // Récupérer token dans le header authorization
        const token = req.headers.authorization.split(' ')[1]

        // Décoder le token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        // Récupérer l'id dedans
        const userId = decodedToken.userId

        // Attribuer userId à l'objet requête
        req.auth = { userId }

        // Si jamais il y a un user.Id dans le corps de la requête et que celui-ci est différent que l'userId: on n'authentifie pas la requête
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'
        } else {
            next()
        }

    } catch {
        res.status(401).json({
            error: new Error('Requête non authentifiée!')
        })
    }
}
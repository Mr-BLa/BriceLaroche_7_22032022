/*
*       ROUTER LIKES
*/



// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const likesController = require('../controllers/likes')

// Import Middleware Authentification Token
const auth = require("../middleware/auth")


// Création d'un like
router.post('/', auth, likesController.createLike)
// Suppression d'un like
router.delete('/:id', auth, likesController.deleteLike)
// Recherche du nombre de likes par l'Id
router.get('/all/:id', auth, likesController.getLikesByPostId)



// Export router
module.exports = router
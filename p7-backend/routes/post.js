/*
*       ROUTER POST
*/


// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const postController = require('../controllers/post')

// Import Middleware Authentification Token
const auth = require("../middleware/auth")


// Recherche de tous les posts
router.get('/all', auth, postController.getAllPosts)
// Création d'un post
router.post('/', auth, postController.createPost)
// Modification d'un post
router.put('/:id', auth, postController.modifyPost)
// Suppression d'un post
router.delete('/:id', auth, postController.deletePost)
// Recherche d'un post par son Id
router.get('/all/:id', auth, postController.getPostById)
// Modification de userLikeId dans post (likes)
router.put('/userLikeId/:id', auth, postController.modifyUserLikeId)


// Export router
module.exports = router
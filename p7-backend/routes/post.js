/*
*       ROUTER POST
*/


// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const postCtrl = require('../controllers/post')

// Import Middleware Authentification Token
const auth = require("../middleware/auth")


// Recherche de tous les posts
router.get('/all', auth, postCtrl.getAllPosts)
// Création d'un post
router.post('/', auth, postCtrl.createPost)
// Modification d'un post
router.put('/:id', auth, postCtrl.modifyPost)
// Suppression d'un post
router.delete('/:id', auth, postCtrl.deletePost)
// Recherche d'un post par son Id
router.get('/all/:id', auth, postCtrl.getPostById)



// Export router
module.exports = router
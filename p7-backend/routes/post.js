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

// Import Middleware multer-config
//const multer = require('../middleware/multer-config')


// Recherche de tous les posts
router.get('/all', auth, postCtrl.getAllPosts)
// Création d'un post
router.post('/', auth,/* multer,*/ postCtrl.createPost)
// Modification d'un post
router.put('/:id', auth, /*multer,*/ postCtrl.modifyPost)
// Suppression d'un post
router.delete('/:id', auth, postCtrl.deletePost)
// Recherche d'un post par son Id
router.get('/all/:id', postCtrl.getPostById)



// Export router
module.exports = router
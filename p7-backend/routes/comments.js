/*
*       ROUTER COMMENT
*/
// commentsController à tous les endroits commentsController

// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const commentsController = require('../controllers/comments')

// Import Middleware Authentification Token
const auth = require("../middleware/auth")


// Recherche de tous les comments
router.get('/all', auth, commentsController.getAllComments)
// Création d'un comment
router.post('/', auth, commentsController.createComment)
// Modification d'un comment
router.put('/:id', auth, commentsController.modifyComment)
// Suppression d'un comment
router.delete('/:id', auth, commentsController.deleteComment)
// Recherche d'un comment par son Id
router.get('/all/:id', auth, commentsController.getCommentById)



// Export router
module.exports = router
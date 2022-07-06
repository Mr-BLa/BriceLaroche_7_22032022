/*
*       ROUTER COMMENT
*/
// commentsController à tous les endroits commentsCtrl

// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const commentsCtrl = require('../controllers/comments')

// Import Middleware Authentification Token
const auth = require("../middleware/auth")


// Recherche de tous les comments
router.get('/all', auth, commentsCtrl.getAllComments)
// Création d'un comment
router.post('/', auth, commentsCtrl.createComment)
// Modification d'un comment
router.put('/:id', auth, commentsCtrl.modifyComment)
// Suppression d'un comment
router.delete('/:id', auth, commentsCtrl.deleteComment)
// Recherche d'un comment par son Id
router.get('/all/:id', auth, commentsCtrl.getCommentById)



// Export router
module.exports = router
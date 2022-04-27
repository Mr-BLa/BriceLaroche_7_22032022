/*
*       ROUTER COMMENT
*/


// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const commentsCtrl = require('../controllers/comments')
// Import Middleware Authentification Token
//const auth = require("../middleware/auth")
// Import Middleware multer-config
//const multer = require('../middleware/multer-config')


// Recherche de tous les comments
router.get('/all', /*auth,*/commentsCtrl.getAllComments)
// Création d'un comment
router.post('/', /*auth, multer,*/ commentsCtrl.createComment)
// Modification d'un comment
router.put('/:id', /*auth, multer,*/ commentsCtrl.modifyComment)
// Suppression d'un comment
router.delete('/:id', /*auth,*/ commentsCtrl.deleteComment)
// Recherche d'un comment par son Id
router.get('/all/:id', commentsCtrl.getCommentById)



// Export router
module.exports = router
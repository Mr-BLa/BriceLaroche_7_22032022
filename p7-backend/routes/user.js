/*
*       ROUTER USER
*/


// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const userController = require('../controllers/user')

// Import Middleware Authentification Token
const auth = require("../middleware/auth")

// Création de nouveaux utilisateurs
router.post('/signup', userController.signup)
// Connection utilisateurs existants
router.post('/login', userController.login)
// Recherche de tous les utilisateurs
router.get('/all', auth, userController.getAllUsers)
// Recherche d'un utilisateur par son Id
router.get('/all/:id', auth, userController.getUserById)
// Modification d'un utilisateur
router.put('/:id', auth, userController.modifyUser)
// Suppression d'un utilisateur
router.delete('/:id', auth, userController.deleteUser)

// Export router
module.exports = router
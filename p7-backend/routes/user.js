/*
*       ROUTER USER
*/


// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const userCtrl = require('../controllers/user')
// Import Middleware Authentification Token
const auth = require("../middleware/auth")

// Création de nouveaux utilisateurs
router.post('/signup', userCtrl.signup)
// Connection utilisateurs existants
router.post('/login', userCtrl.login)
// Recherche de tous les utilisateurs
router.get('/all', auth, userCtrl.getAllUsers)
// Recherche d'un utilisateur par son Id
router.get('/all/:id', auth, userCtrl.getUserById)
// Modification d'un utilisateur
router.put('/:id', auth, userCtrl.modifyUser)
// Suppression d'un utilisateur
router.delete('/:id', auth, userCtrl.deleteUser)

// Export router
module.exports = router
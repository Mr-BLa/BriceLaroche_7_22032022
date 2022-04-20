/*
*       ROUTER USER
*/


// Import Express pour créer routeur
const express = require('express')

// Création routeur
const router = express.Router()

// Associer fonctions aux différentes routes
const userCtrl = require('../controllers/user')

// Création de nouveaux utilisateurs
router.post('/signup', userCtrl.signup)
// Connection utilisateurs existants
router.post('/login', userCtrl.login)
// Recherche de tous les utilisateurs
router.get('/all', userCtrl.getAllUsers)
// Recherche d'un utilisateur par son Id
router.get('/all/:id', userCtrl.getUserById)
// Modification d'un utilisateur
/*router.put('/:id',  userCtrl.modifyUser)
// Suppression d'un utilisateur
router.delete('/:id', userCtrl.deleteUser)
*/
// Export router
module.exports = router
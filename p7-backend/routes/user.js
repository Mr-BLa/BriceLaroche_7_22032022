/*
*       ROUTER AUTHENTIFICATION
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

// Export router
module.exports = router
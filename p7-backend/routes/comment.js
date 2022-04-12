/*
**      ROUTERS COMMENT
*/


// Implémentation des routes 
const express = require('express')
const router = express.Router()

// Import controllers
const comCtrl = require("../controllers/comment")
// Import Middleware Authentification Token
const auth = require("../middleware/auth")
// Import Middleware multer-config
const multer = require('../middleware/multer-config')

// Router LIKE et DISLIKE 
router.post('/:id/like', auth, comCtrl.createLikeCom)

// Router POST + import et application Controller POST
router.post('/', auth, multer, comCtrl.createCom )

// Router PUT + import et application Controller PUT
router.put('/:id', auth, multer, comCtrl.modifyCom )

// Router DELETE + import et application Controller DELETE
router.delete('/:id', auth, comCtrl.deleteCom )

// Router GET/:id + import et application Controller GET/:id
router.get('/:id', auth, comCtrl.getOneCom)

// Router GET + import et application Controller GET
router.get("/", auth, comCtrl.getAllCom)


module.exports = router
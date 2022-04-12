/*
**      ROUTERS POST
*/


// Implémentation des routes 
const express = require('express')
const router = express.Router()

// Import controllers
const postCtrl = require("../controllers/post")
// Import Middleware Authentification Token
const auth = require("../middleware/auth")
// Import Middleware multer-config
const multer = require('../middleware/multer-config')

// Router LIKE et DISLIKE 
router.post('/:id/like', auth, postCtrl.createLikePost)

// Router POST + import et application Controller POST
router.post('/', auth, multer, postCtrl.createPost )

// Router PUT + import et application Controller PUT
router.put('/:id', auth, multer, postCtrl.modifyPost )

// Router DELETE + import et application Controller DELETE
router.delete('/:id', auth, postCtrl.deletePost )

// Router GET/:id + import et application Controller GET/:id
router.get('/:id', auth, postCtrl.getOnePost)

// Router GET + import et application Controller GET
router.get("/", auth, postCtrl.getAllPost)


module.exports = router
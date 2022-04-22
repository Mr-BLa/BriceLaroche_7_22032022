/*
*          CONTROLLERS POST
*/

// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un post
/*exports.createPost = (req, res, next) =>{
    connection.execute("INSERT INTO `post` (`email`, `password`, `username`, `firstname`, `lastname`, `role`, `bio`) VALUES "(req.body.email, hash, req.body.username, req.body.firstname, req.body.lastname, req.body.role, req.body.bio))
}
router.post('/', auth, multer, postCtrl.login)
*/

// Récupérer tous les posts
exports.getAllPosts = (req, res, next) => {
    // Connection BDD MySql
    connection.query(`SELECT * FROM post`).then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Recherche d'un post par son Id
exports.getPostById = (req, res, next) => {
    // Connection BDD MySql
    const id = parseInt(req.params.id)
    connection.execute(`SELECT * FROM post WHERE post_id=?`,[id]).then(results => {
        return res.send(results[0])
    }).catch(err=> {
        return res.sendStatus(400)
    })
}
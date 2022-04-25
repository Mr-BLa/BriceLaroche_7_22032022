/*
*          CONTROLLERS COMMENT
*/


// Import package File System (accès aux différentes opérations liées au système de fichier)
const { timeStamp } = require('console')
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Récupérer tous les posts
exports.getAllComments = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM comments ORDER BY `comment_id` DESC ").then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Recherche d'un post par son Id
exports.getCommentById = (req, res, next) => {
    // Connection BDD MySql
    const comment_id = parseInt(req.params.comment_id)
    connection.execute(`SELECT * FROM comments WHERE comment_id=?`,[comment_id]).then(results => {
        return res.send(results[0])
    }).catch(err=> {
        return res.sendStatus(400)
    })
}
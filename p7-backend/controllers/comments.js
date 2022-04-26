/*
*          CONTROLLERS COMMENT
*/


// Import package File System (accès aux différentes opérations liées au système de fichier)
const { timeStamp } = require('console')
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un commentaire
exports.createComment = (req, res, next) => {
    const id = parseInt(req.auth.userId)
    const post_id = parseInt(req.body.post_id)
    connection.execute("INSERT INTO `comments` (`user_id`, `post_id`, `text`) VALUES "([id], [post_id], req.body.text)).then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Modification d'un commentaire
exports.modifyComment = (req, res, next) => {
    // Connection BDD MySql
    const comment_id = parseInt(req.body.comment_id)
    connection.execute(`UPDATE comments SET text = ?`, req.body.text `WHERE comment_id = ?`,[comment_id]).then(modifications => {
        return res.send(modifications)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    const comment_id = parseInt(req.body.comment_id)
    connection.execute(`DELETE FROM post WHERE comment_id = ?`,[comment_id]).then(suppr => {
        return res.send(suppr)
    })
    .catch(err => {
        return res.sendStatus(400)
    })
}

// Récupérer tous les commentaires
exports.getAllComments = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM comments ORDER BY `comment_id` DESC ").then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Recherche d'un commentaire par son Id
exports.getCommentById = (req, res, next) => {
    // Connection BDD MySql
    const comment_id = parseInt(req.params.comment_id)
    connection.execute(`SELECT * FROM comments WHERE comment_id=?`,[comment_id]).then(results => {
        return res.send(results[0])
    }).catch(err=> {
        return res.sendStatus(400)
    })
}
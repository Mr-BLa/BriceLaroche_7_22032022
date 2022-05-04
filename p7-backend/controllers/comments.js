/*
*          CONTROLLERS COMMENT
*/


// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un commentaire
exports.createComment = (req, res, next) => {
    const id = parseInt(req.params.id)
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
    const comment_id = parseInt(req.params.id)
    connection.execute(`UPDATE comments SET text = ? WHERE comment_id = ?`,[req.body.text, comment_id]).then(modifications => {
        return res.send(modifications)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    const comment_id = parseInt(req.params.id)
    connection.execute(`DELETE FROM post WHERE comment_id = ?`,[comment_id]).then(suppr => {
        console.log(suppr)
        return res.send(suppr)
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(400)
    })
}

// Récupérer tous les commentaires
exports.getAllComments = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM comments ORDER BY `comment_id` DESC ").then(results => {
        console.log(results)
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}

// Recherche d'un commentaire par son Id
exports.getCommentById = (req, res, next) => {
    // Connection BDD MySql
    const id = parseInt(req.params.id)
    connection.execute(`SELECT * FROM comments WHERE comment_id =?`,[id]).then(results => {
        console.log(results)
        return res.send(results[0])
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}
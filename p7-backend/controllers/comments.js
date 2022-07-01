/*
*          CONTROLLERS COMMENT
*/


// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un commentaire
exports.createComment = (req, res, next) => {
    connection.execute('INSERT INTO `comments` (`user_id`, `post_id`, `text`) VALUES (?, ?, ?)', [req.body.user_id, req.body.post_id, req.body.text]).then(results => {
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
    connection.execute(`DELETE FROM comments WHERE comment_id = ?`, [comment_id] ).then(suppr => {
        return res.send(suppr)
    })
    .catch(err => {
        return res.sendStatus(400)
    })
}

// Récupérer tous les commentaires
exports.getAllComments = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT comments.comment_id, comments.user_id, comments.post_id, comments.text, comments.createdat, comments.updateat, users.user_id, users.firstname, users.lastname, users.isadmin FROM comments JOIN users ON comments.user_id = users.user_id ORDER BY comment_id DESC ").then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Recherche d'un commentaire par son Id
exports.getCommentById = (req, res, next) => {
    // Connection BDD MySql
    const post_id = parseInt(req.params.id)
    connection.query(`SELECT comments.comment_id, comments.user_id, comments.post_id, comments.text, comments.createdat, comments.updateat, users.user_id, users.firstname, users.lastname, users.isadmin FROM comments JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = ?`, post_id).then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}
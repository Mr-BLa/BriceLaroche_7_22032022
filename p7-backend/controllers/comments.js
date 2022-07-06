/*
*          CONTROLLERS COMMENT
*/


// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un commentaire
exports.createComment = (req, res) => {
    connection.execute('INSERT INTO `comments` (`user_id`, `post_id`, `text`) VALUES (?, ?, ?)', [req.body.user_id, req.body.post_id, req.body.text]).then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}

    

// Modification d'un commentaire
exports.modifyComment = (req, res) => {
    // Connection BDD MySql
    const comment_id = parseInt(req.params.id)
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof comment_id == 'number') {
        connection.execute(`UPDATE comments SET text = ? WHERE comment_id = ?`,[req.body.text, comment_id]).then(modifications => {
            return res.send(modifications)
        }).catch(err=> {
            console.log(err)
            return res.sendStatus(400)
        })
    } else { 
        return res.sendStatus(400)
    }
}

// Suppression d'un commentaire
exports.deleteComment = (req, res) => {
    const comment_id = parseInt(req.params.id)
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof comment_id == 'number') {
        connection.execute(`DELETE FROM comments WHERE comment_id = ?`, [comment_id] ).then(suppr => {
            return res.send(suppr)
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(400)
        })
    } else {
        return res.sendStatus(400)
    }
    
}

// Récupérer tous les commentaires
exports.getAllComments = (req, res) => {
    // Connection BDD MySql
    connection.query("SELECT comments.comment_id, comments.user_id, comments.post_id, comments.text, comments.createdat, comments.updateat, users.user_id, users.firstname, users.lastname, users.isadmin FROM comments JOIN users ON comments.user_id = users.user_id ORDER BY comment_id DESC ").then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}

// Recherche d'un commentaire par son Id
exports.getCommentById = (req, res) => {
    // Connection BDD MySql
    const post_id = parseInt(req.params.id)
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.query(`SELECT comments.comment_id, comments.user_id, comments.post_id, comments.text, comments.createdat, comments.updateat, users.user_id, users.firstname, users.lastname, users.isadmin FROM comments JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = ?`, post_id).then(results => {
            return res.send(results)
        }).catch(err=> {
            console.log(err)
            return res.sendStatus(400)
        })
    } else {
        return res.sendStatus(400)
    }
}
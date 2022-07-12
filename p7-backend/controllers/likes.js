/*
*          CONTROLLERS LIKES
*/


// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un like
exports.createLike = (req, res) => {
    connection.execute('INSERT INTO `likes_users_post` (`user_id`, `post_id`) VALUES (?, ?)', [req.body.user_id, req.body.post_id]).then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}


// Suppression d'un like
exports.deleteLike = (req, res) => {
    const post_id = parseInt(req.params.id)
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.execute(`DELETE FROM likes_users_post WHERE (user_id = ? AND post_id = ?)`, [req.body.user_id, post_id] ).then(suppr => {
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

// Obtenir le nombre de likes par post 
exports.getLikesByPostId = (req, res) => {
    const post_id = parseInt(req.params.id)
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.query("SELECT COUNT(post_id) AS Likes FROM likes_users_post WHERE post_id = ?", [post_id]).then(results => {
            return res.send(results)
        }).catch(err=> {
            console.log(err)
            return res.sendStatus(400)
        })
    } else { 
        return res.sendStatus(400)
    }
}
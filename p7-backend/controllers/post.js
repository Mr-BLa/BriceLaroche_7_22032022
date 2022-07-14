/*
*          CONTROLLERS POST
*/

// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un post
exports.createPost = (req, res) => {
    connection.execute('INSERT INTO `post` (`user_id`, `title`, `content`, `attachement`) VALUES (?, ?, ?, ?)', [req.body.user_id, req.body.title, req.body.content, req.body.attachement]).then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}


// Modification d'un post
exports.modifyPost = (req, res) => {
    const post_id = parseInt(req.params.id)
    // Connection BDD MySql
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.execute(`UPDATE post SET title = ?, content = ?, attachement = ? WHERE post_id = ?`, [req.body.title, req.body.content, req.body.attachement, post_id]).then(modifications => {
                return res.send(modifications)
            }).catch(err=> {
                console.log(err)
                return res.sendStatus(400)
            })
    } else {
        return res.sendStatus(400)
    }
}

// Suppression d'un post
exports.deletePost = (req, res) => {
    const post_id = parseInt(req.params.id)

    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.execute(`DELETE FROM post WHERE post_id = ?`, [post_id]).then(suppr => {
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


// Récupérer tous les posts
exports.getAllPosts = (req, res) => {
    // Connection BDD MySql
    connection.query("SELECT users.user_id, users.firstname, users.lastname, users.isadmin, post.post_id, post.user_id, post.title, post.content, post.attachement, post.userLikeId, post.createdat FROM users JOIN post ON users.user_id = post.user_id ORDER BY post_id DESC").then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log(err)
        return res.sendStatus(400)
    })
}

// Recherche d'un post par son Id
exports.getPostById = (req, res) => {
    const post_id = parseInt(req.params.id)
    // Connection BDD MySql
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.query(`SELECT users.user_id, users.firstname, users.lastname, users.isadmin, post.post_id, post.user_id, post.title, post.content, post.attachement, post.userLikeId, post.createdat FROM users JOIN post ON users.user_id = post.user_id WHERE post_id=?`, post_id).then(results => {
            return res.send(results)
        }).catch(err=> {
            console.log(err)
            return res.sendStatus(400)
        })
    } else {
        return res.sendStatus(400)
    }
}

// // Création userLikedId 
// exports.createUserLikeId = (req, res) => {
//     const post_id = parseInt(req.params.id)
//     // Connection BDD MySql
//     // tester si l'id qui est envoyé est un nombre. 
//     // si c'est un nombre: requete -> BDD
//     // si ce n'est pas un nombre: retourner erreur
//     if (typeof post_id == 'number') {
//         connection.execute('INSERT INTO `post` (`userLikeId`) VALUES (?) WHERE post_id = ?', [req.body.user_id, req.body.title, req.body.content, req.body.attachement]`UPDATE post SET userLikeId = ? WHERE post_id = ?`, [req.body.userLikeId, post_id]).then(modifications => {
//                 return res.send(modifications)
//             }).catch(err=> {
//                 console.log(err)
//                 return res.sendStatus(400)
//             })
//     } else {
//         return res.sendStatus(400)
//     }
// }


// Modification userLikedId 
exports.modifyUserLikeId = (req, res) => {
    const post_id = parseInt(req.params.id)
    console.log(req.body)
    // Connection BDD MySql
    // tester si l'id qui est envoyé est un nombre. 
    // si c'est un nombre: requete -> BDD
    // si ce n'est pas un nombre: retourner erreur
    if (typeof post_id == 'number') {
        connection.execute(`UPDATE post SET userLikeId = ? WHERE post_id = ?`, [req.body.userLikeId, post_id]).then(modifications => {
                return res.send(modifications)
            }).catch(err=> {
                console.log(err)
                return res.sendStatus(400)
            })
    } else {
        return res.sendStatus(400)
    }
}
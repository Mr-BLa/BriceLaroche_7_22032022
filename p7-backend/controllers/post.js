/*
*          CONTROLLERS POST
*/

// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')

//Connexion BDD
const connection = require('../services/database')


// Création d'un post
exports.createPost = (req, res, next) => {
    const id = parseInt(req.auth.user_id)
    console.log("CONST ID:", id)
    connection.execute("INSERT INTO `post` (`user_id`, `title`, `content`, `attachement`) VALUES "([id], req.body.title, req.body.content, req.body.attachement)).then(results => {
        return res.send(results)
    }).catch(err=> {
        console.log("error:", err)
        return res.sendStatus(400)
    })
}

// Modification d'un post
exports.modifyPost = (req, res, next) => {
    // Connection BDD MySql
    const post_id = parseInt(req.body.post_id)
    connection.execute(`UPDATE post SET title = ?`, req.body.title `, content = ?`, req.body.content `, attachement = ?`, req.body.attachement `WHERE post_id = ?`,[post_id]).then(modifications => {
        return res.send(modifications)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Suppression d'un post
exports.deletePost = (req, res, next) => {
    const post_id = parseInt(req.params.post_id)
    connection.execute(`DELETE FROM post WHERE post_id = ?`,[post_id]).then(suppr => {
        return res.send(suppr)
    })
    .catch(err => {
        return res.sendStatus(400)
    })
}

// Récupérer tous les posts
exports.getAllPosts = (req, res, next) => {
    // Connection BDD MySql
    connection.query("SELECT * FROM post ORDER BY `post_id` DESC ").then(results => {
        return res.send(results)
    }).catch(err=> {
        return res.sendStatus(400)
    })
}

// Recherche d'un post par son Id
exports.getPostById = (req, res, next) => {
    // Connection BDD MySql
    const post_id = parseInt(req.params.id)
    connection.query(`SELECT * FROM post WHERE post_id=?`,[post_id]).then(results => {
        return res.send(results[0])
    }).catch(err=> {
        return res.sendStatus(400)
    })
}
/*
*       CONTROLLERS POST/ Logique métier de chaque routes
*/


//Import mongoose schema post
const Post = require("../models/Post")

// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')


//Controller LIKE
exports.createLikePost = (req, res, next) => {

    // Récupération état des likes/dislikes
    let like = req.body.like
    let userId = req.body.userId
    // S'assurer que l'utilisateur qui fait la requête est bien le propriétaire de l'objet
    Post.findOne({ _id: req.params.id })
        // Promise pour les différents cas: like (+1), dislike (-1) ou annulation like OU dislike (0)
        .then(
            (post) => {
                // Si Id de l'utilisateur n'est pas dans le tableau des personnes qui ont déjà liké et que Like = 1 DONC likes = +1 
                if (like === 1){
                    if (!post.usersLiked.includes(userId) && !post.usersDisliked.includes(userId)) {
                        console.log("userId absent de [usersLiked] et userId aime la post")
                        
                        // Mise à jour de la post dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [likes] à 1 et de'$push' pour l'ajout de userId ds [usersLiked]
                        post.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "post likée !" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }

                // Si Id de l'utilisateur n'est pas dans le tableau des personnes qui ont déjà disliké et que Dislike = -1 DONC dislikes = -1 
                if (like === -1){
                    if (!post.usersDisliked.includes(userId) && !post.usersLiked.includes(userId)) {
                        console.log("userId absent de [usersDisliked] et userId n'aime pas la post")

                        // Mise à jour de la post dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [dislikes] à +1 et de'$push' pour l'ajout de userId ds [usersDisliked]
                        post.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $push: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "post dislikée !" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }

                // Si Id de l'utilisateur est présent dans [usersLiked] ou [usersDisliked], et que le vote a été annulé, DONC likes et dislikes = 0
                if (like === 0){
                    if ((post.usersLiked.includes(userId) && !post.usersDisliked.includes(userId))) {
                        console.log("userId présent dans [usersLiked] et userId ne se prononce pas")
                        // Mise à jour de la post dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [likes] à 0 et de'$pull' pour l'ajout de userId ds [usersliked]
                        post.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "Ne se prononce pas" }))
                            .catch(error => res.status(400).json({ error })) 
                            
                    } else if ((post.usersDisliked.includes(userId) && !post.usersLiked.includes(userId))){
                        console.log("userId présent dans [usersDisliked] et userId ne se prononce pas")
                        // Mise à jour de la post dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [dislikes] à 0 et de'$pull' pour l'ajout de userId ds [usersliked]
                        post.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $pull: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "Ne se prononce pas" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }
            })
        .catch(error => res.status(500).json({ error }))
    
}


//Controller POST
exports.createPost = (req, res, next) => {
    // Objet Js sous forme de chaine caractere
    const postObject = JSON.parse(req.body.post)
    console.log(req.body.post)
    // Retire le champ id renvoyé par mongoDb, avant de le copier
    delete postObject._id
    // Création nouvelle instance de notre model post
    const post = new post({
        // Copie les champs du model post, dans le body/corps de la request
        ...postObject,
        // Modification url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    // Enregistrement du "post" dans la base de données
    post.save()
        .then(() => res.status(201).json({ message: "Post Enregistré !"}))
        .catch(error => res.status(400).json({ error }))
}


// Controller PUT
exports.modifyPost = (req, res, next) => {
    const userId = req.auth.userId
    // Création objet postObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance post à partir de postObject , puis on effectue la modification.
    const postObject = req.file ?
    {
        ...JSON.parse(req.body.post),
        //On traite la nouvelle image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    // Mettre à jour/ modifier une post dans la base de données, en fonction de l'id et si userId du créateur est le même que celui du modificateur
    Post.updateOne({ _id: req.params.id , userId: userId}, {...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet Modifié !"}))
        .catch(error => res.status(400).json({ error }))
}


//Controller DELETE
exports.deletePost = (req, res, next) => {
    // S'assurer que l'utilisateur qui fait la requête est bien le propriétaire de l'objet avant de pouvoir supprimer
    Post.findOne({ _id: req.params.id })
        .then(
            (post) => {
                // Cas d'erreur: si post n'existe pas
                if (!post) {
                    return res.status(404).json({
                        error: new Error('Objet non trouvé !')
                    })
                }
                // Vérification du userId 
                if (post.userId !== req.auth.userId) {
                    return res.status(401).json({
                        error: new Error('Requête non autorisée !')
                    })
                }
                // Retrouver le bon nom du fichier
                const filename = post.imageUrl.split('/images/')[1]
                // Supression du fichier
                fs.unlink(`images/${filename}`, () => {
                    //Si bon propriétaire: supprimer une post de la base de données, en fonction de l'id
                    post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }))
                })
            })
        .catch(error => res.status(500).json({ error }))
}


//Controller GET ONE
exports.getOnePost = (req, res, next) =>{
    //Trouver un seul objet dans la base de données. Via objet req.param.id (car c'est un paramètre de route dynamique)
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }))
}


//Controller GET
exports.getAllPosts = (req, res) =>{
    //renvoyer un tableau contenant toutes les posts
    Post.find()
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }))
}
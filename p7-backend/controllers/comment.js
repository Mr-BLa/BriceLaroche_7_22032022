/*
*       CONTROLLERS COMMENTS/ Logique métier de chaque routes
*/


//Import MySql2 model Comment
const Comment = require("../models/Comment")

// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')


//Controller LIKE
exports.createLikeComment = (req, res, next) => {

    // Récupération état des likes/dislikes
    let like = req.body.like
    let userId = req.body.userId
    // S'assurer que l'utilisateur qui fait la requête est bien le propriétaire de l'objet
    Comment.findOne({ _id: req.params.id })
        // Promise pour les différents cas: like (+1), dislike (-1) ou annulation like OU dislike (0)
        .then(
            (comment) => {
                // Si Id de l'utilisateur n'est pas dans le tableau des personnes qui ont déjà liké et que Like = 1 DONC likes = +1 
                if (like === 1){
                    if (!comment.usersLiked.includes(userId) && !comment.usersDisliked.includes(userId)) {
                        console.log("userId absent de [usersLiked] et userId aime le commentaire")
                        
                        // Mise à jour du commentaire dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [likes] à 1 et de'$push' pour l'ajout de userId ds [usersLiked]
                        Comment.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "Commentaire liké !" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }

                // Si Id de l'utilisateur n'est pas dans le tableau des personnes qui ont déjà disliké et que Dislike = -1 DONC dislikes = -1 
                if (like === -1){
                    if (!comment.usersDisliked.includes(userId) && !comment.usersLiked.includes(userId)) {
                        console.log("userId absent de [usersDisliked] et userId n'aime pas la Comment")

                        // Mise à jour de la Comment dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [dislikes] à +1 et de'$push' pour l'ajout de userId ds [usersDisliked]
                        Comment.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $push: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "Comment disliké !" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }

                // Si Id de l'utilisateur est présent dans [usersLiked] ou [usersDisliked], et que le vote a été annulé, DONC likes et dislikes = 0
                if (like === 0){
                    if ((comment.usersLiked.includes(userId) && !comment.usersDisliked.includes(userId))) {
                        console.log("userId présent dans [usersLiked] et userId ne se prononce pas")
                        // Mise à jour de la Comment dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [likes] à 0 et de'$pull' pour l'ajout de userId ds [usersliked]
                        comment.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "Ne se prononce pas" }))
                            .catch(error => res.status(400).json({ error })) 
                            
                    } else if ((comment.usersDisliked.includes(userId) && !comment.usersLiked.includes(userId))){
                        console.log("userId présent dans [usersDisliked] et userId ne se prononce pas")
                        // Mise à jour de la Comment dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [dislikes] à 0 et de'$pull' pour l'ajout de userId ds [usersliked]
                        comment.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $pull: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "Ne se prononce pas" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }
            })
        .catch(error => res.status(500).json({ error }))
    
}


//Controller POST
exports.createComment = (req, res, next) => {
    // Objet Js sous forme de chaine caractere
    const commentObject = JSON.parse(req.body.comment)
    console.log(req.body.comment)
    // Retire le champ id renvoyé par mongoDb, avant de le copier
    delete commentObject._id
    // Création nouvelle instance de notre model Comment
    const comment = new comment({
        // Copie les champs du model Comment, dans le body/corps de la request
        ...commentObject,
        // Modification url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    // Enregistrement du "Comment" dans la base de données
    comment.save()
        .then(() => res.status(201).json({ message: "Objet Enregistré !"}))
        .catch(error => res.status(400).json({ error }))
}


// Controller PUT
exports.modifyComment = (req, res, next) => {
    const userId = req.auth.userId
    // Création objet CommentObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Comment à partir de CommentObject , puis on effectue la modification.
    const commentObject = req.file ?
    {
        ...JSON.parse(req.body.comment),
        //On traite la nouvelle image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    // Mettre à jour/ modifier une Comment dans la base de données, en fonction de l'id et si userId du créateur est le même que celui du modificateur
    Comment.updateOne({ _id: req.params.id , userId: userId}, {...commentObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet Modifié !"}))
        .catch(error => res.status(400).json({ error }))
}


//Controller DELETE
exports.deleteComment = (req, res, next) => {
    // S'assurer que l'utilisateur qui fait la requête est bien le propriétaire de l'objet avant de pouvoir supprimer
    Comment.findOne({ _id: req.params.id })
        .then(
            (comment) => {
                // Cas d'erreur: si Comment n'existe pas
                if (!comment) {
                    return res.status(404).json({
                        error: new Error('Objet non trouvé !')
                    })
                }
                // Vérification du userId 
                if (comment.userId !== req.auth.userId) {
                    return res.status(401).json({
                        error: new Error('Requête non autorisée !')
                    })
                }
                // Retrouver le bon nom du fichier
                const filename = comment.imageUrl.split('/images/')[1]
                // Supression du fichier
                fs.unlink(`images/${filename}`, () => {
                    //Si bon propriétaire: supprimer une Comment de la base de données, en fonction de l'id
                    comment.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }))
                })
            })
        .catch(error => res.status(500).json({ error }))
}


//Controller GET ONE
exports.getOneComment = (req, res, next) =>{
    //Trouver un seul objet dans la base de données. Via objet req.param.id (car c'est un paramètre de route dynamique)
    Comment.findOne({ _id: req.params.id })
        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(404).json({ error }))
}


//Controller GET
exports.getAllComments = (req, res) =>{
    //renvoyer un tableau contenant toutes les Comment
    Comment.find()
        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(400).json({ error }))
}
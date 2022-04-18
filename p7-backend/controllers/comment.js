/*
*       CONTROLLERS COMMENTS/ Logique métier de chaque routes
*/


//Import mongoose schema Sauce
const Sauce = require("../models/Sauce")

// Import package File System (accès aux différentes opérations liées au système de fichier)
const fs = require('fs')


//Controller LIKE
exports.createLikeSauce = (req, res, next) => {

    // Récupération état des likes/dislikes
    let like = req.body.like
    let userId = req.body.userId
    // S'assurer que l'utilisateur qui fait la requête est bien le propriétaire de l'objet
    Sauce.findOne({ _id: req.params.id })
        // Promise pour les différents cas: like (+1), dislike (-1) ou annulation like OU dislike (0)
        .then(
            (sauce) => {
                // Si Id de l'utilisateur n'est pas dans le tableau des personnes qui ont déjà liké et que Like = 1 DONC likes = +1 
                if (like === 1){
                    if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
                        console.log("userId absent de [usersLiked] et userId aime la sauce")
                        
                        // Mise à jour de la sauce dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [likes] à 1 et de'$push' pour l'ajout de userId ds [usersLiked]
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "Sauce likée !" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }

                // Si Id de l'utilisateur n'est pas dans le tableau des personnes qui ont déjà disliké et que Dislike = -1 DONC dislikes = -1 
                if (like === -1){
                    if (!sauce.usersDisliked.includes(userId) && !sauce.usersLiked.includes(userId)) {
                        console.log("userId absent de [usersDisliked] et userId n'aime pas la sauce")

                        // Mise à jour de la sauce dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [dislikes] à +1 et de'$push' pour l'ajout de userId ds [usersDisliked]
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $push: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "Sauce dislikée !" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }

                // Si Id de l'utilisateur est présent dans [usersLiked] ou [usersDisliked], et que le vote a été annulé, DONC likes et dislikes = 0
                if (like === 0){
                    if ((sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId))) {
                        console.log("userId présent dans [usersLiked] et userId ne se prononce pas")
                        // Mise à jour de la sauce dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [likes] à 0 et de'$pull' pour l'ajout de userId ds [usersliked]
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                            .then(() => res.status(201).json({ message: "Ne se prononce pas" }))
                            .catch(error => res.status(400).json({ error })) 
                            
                    } else if ((sauce.usersDisliked.includes(userId) && !sauce.usersLiked.includes(userId))){
                        console.log("userId présent dans [usersDisliked] et userId ne se prononce pas")
                        // Mise à jour de la sauce dans la base de données + Utilisation de'$inc' de mongoDB pour l'incrémentation de [dislikes] à 0 et de'$pull' pour l'ajout de userId ds [usersliked]
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $pull: { usersDisliked: userId } })
                            .then(() => res.status(201).json({ message: "Ne se prononce pas" }))
                            .catch(error => res.status(400).json({ error })) 
                    }
                }
            })
        .catch(error => res.status(500).json({ error }))
    
}


//Controller POST
exports.createSauce = (req, res, next) => {
    // Objet Js sous forme de chaine caractere
    const sauceObject = JSON.parse(req.body.sauce)
    console.log(req.body.sauce)
    // Retire le champ id renvoyé par mongoDb, avant de le copier
    delete sauceObject._id
    // Création nouvelle instance de notre model Sauce
    const sauce = new Sauce({
        // Copie les champs du model Sauce, dans le body/corps de la request
        ...sauceObject,
        // Modification url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    // Enregistrement du "sauce" dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: "Objet Enregistré !"}))
        .catch(error => res.status(400).json({ error }))
}


// Controller PUT
exports.modifySauce = (req, res, next) => {
    const userId = req.auth.userId
    // Création objet sauceObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        //On traite la nouvelle image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    // Mettre à jour/ modifier une sauce dans la base de données, en fonction de l'id et si userId du créateur est le même que celui du modificateur
    Sauce.updateOne({ _id: req.params.id , userId: userId}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet Modifié !"}))
        .catch(error => res.status(400).json({ error }))
}


//Controller DELETE
exports.deleteSauce = (req, res, next) => {
    // S'assurer que l'utilisateur qui fait la requête est bien le propriétaire de l'objet avant de pouvoir supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(
            (sauce) => {
                // Cas d'erreur: si sauce n'existe pas
                if (!sauce) {
                    return res.status(404).json({
                        error: new Error('Objet non trouvé !')
                    })
                }
                // Vérification du userId 
                if (sauce.userId !== req.auth.userId) {
                    return res.status(401).json({
                        error: new Error('Requête non autorisée !')
                    })
                }
                // Retrouver le bon nom du fichier
                const filename = sauce.imageUrl.split('/images/')[1]
                // Supression du fichier
                fs.unlink(`images/${filename}`, () => {
                    //Si bon propriétaire: supprimer une sauce de la base de données, en fonction de l'id
                    Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }))
                })
            })
        .catch(error => res.status(500).json({ error }))
}


//Controller GET ONE
exports.getOneSauce = (req, res, next) =>{
    //Trouver un seul objet dans la base de données. Via objet req.param.id (car c'est un paramètre de route dynamique)
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}


//Controller GET
exports.getAllSauces = (req, res) =>{
    //renvoyer un tableau contenant toutes les Sauces
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}
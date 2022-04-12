/*
*       Configuration de multer
*/

// Import Multer
const multer = require('multer')


// Objet extension mimetypes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// Objet de configuration pour Multer
const storage = multer.diskStorage({
    // Explique à multer dans quel fichier enregistrer les éléments
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    // Explique à multer quel nom de fichier à utiliser
    filename: (req, file, callback) => {
        // nom = nom d'origine du fichier + remplacement des espaces par des "_"  la place
        const name = file.originalname.split(' ').join('_')
        // extension du fichier
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

// Export middleware multer
module.exports = multer({storage: storage}).single('image')
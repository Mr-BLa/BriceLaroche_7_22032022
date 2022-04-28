/*
**  Application utilisera ces fonctions pour tout types de requête
*/

// Import express
const express = require("express")

// Import de path (chemin de notre systeme de fichier)
const path = require('path')

// Import CORS
const cors = require('cors')

// Import routers
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const commentsRoutes = require('./routes/comments')

// Connexion BDD MySql
const connection = require("./services/database")

// Création application express
const app = express()

// Middleware général, pour permettre à l'app, d'accéder à l'API sans problèmes
/*const corsOptions ={
    origin:'http://localhost:3306'
}
app.use(cors(corsOptions))
*/

// Extraction corps json pour gérer la requête POST venant de l'application front-end
app.use(express.json())

// Lors de requête /images, servir le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')))

// CHEMINS + ROUTES
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comments', commentsRoutes)

// Exportation app
module.exports = app
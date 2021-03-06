/*
**  Application utilisera ces fonctions pour tout types de requête
*/

// Import express
const express = require("express")

// Import CORS
const cors = require('cors')

// Import routers
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const commentsRoutes = require('./routes/comments')

// Connexion BDD MySql
require("./services/database")

// Création application express
const app = express()


// Extraction corps json pour gérer la requête POST venant de l'application front-end
app.use(express.json())
app.use(cors())

// CHEMINS + ROUTES
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comments', commentsRoutes)

// Exportation app
module.exports = app
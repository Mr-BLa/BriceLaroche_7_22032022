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
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const userRoutes = require('./routes/user')

// Connexion BDD MySql

// Variable environnement dotenv
//const uri = 

// get the client
const mysql = require('mysql2')

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'groupomania_bdd'
})

// simple query
connection.query(
    "SELECT table_name as names_of_tables FROM information_schema.tables WHERE table_schema = 'groupomania_bdd'",
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
)


// Création application express
const app = express()



// Middleware général, pour permettre à l'app, d'accéder à l'API sans problèmes

const corsOptions ={
    origin:'http://localhost:3306'
}
app.use(cors(corsOptions))

// Extraction corps json pour gérer la requête POST venant de l'application front-end
app.use(express.json())

// Lors de requête /images, servir le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')))

// Pour la route "/api/post", on utilise postRoutes (donc le router)
app.use('/api/post', postRoutes)

// Pour la route "/api/comment", on utilise commentRoutes
app.use('/api/comment', commentRoutes)

// Pour la route "/api/auth", on utilise userRoutes
app.use('/api/auth', userRoutes)

// Exportation app
module.exports = app
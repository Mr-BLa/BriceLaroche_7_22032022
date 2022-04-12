/* 
**  Ecoute les requêtes http et y répond
*/


// Objet http qui permet de créer serveur
const http = require('http')

//Import dotenv + var config
require("dotenv").config()

// Import application 
const app = require('./app')



//renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}


//Dire à l'app, sur quel port elle va tourner
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port)


// recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
        console.error(bind + ' requires elevated privileges.')
        process.exit(1)
        break
        case 'EADDRINUSE':
        console.error(bind + ' is already in use.')
        process.exit(1)
        break
        default:
        throw error
    }
}


// Appel méthode createServer du package http. Cette methode prend comme argument, la fonction qui sera appeler à chaque requête reçue par le serveur
const server = http.createServer(app)

server.on('error', errorHandler)
// écouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})

//Methode listen du serveur pour écouter requête
server.listen(port)

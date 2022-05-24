/* 
*           LOGIN
*/

import React from "react"
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link } from "react-router-dom"


export default function Login() {


    /** VERIFICATION STATUT CONNEXION **/
    // Statut Login de l'utilisateur ("non connecté" par défaut)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    
    // Dans useEffect : acceder au localStorage pour verifier si le token existe déjà
    React.useEffect(() => {
        let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
        // Si Token présent dans LocalStorage, alors on fait passer le statut "isLoggedIn", à true ("connecté");
        // Sinon on le garde à false 
        tokenInLocalStorage !== null ? setIsLoggedIn(prevLog => !prevLog) : isLoggedIn = false
    }, [])



    /** OBJET FORMULAIRE **/
    // Création d'un composant-objet, contenant email et password:
    const [formLogin, setFormLogin] = React.useState(
        {email: "", password: ""}
    )



    /** GESTION/ACTUALISATION DU FORMULAIRE **/
    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name):
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value effectués
        setFormLogin(prevFormLogin => {
            return {
                ...prevFormLogin,
                [name]: value
            }
        })
    }
    


    /** SOUMISSION ET RECEPTION REQUETE **/
    // Fonction au Submit/Login (bouton login):
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()

        // Submit la data au backend via POST
        axios.post('http://localhost:5000/api/user/login', formLogin)
            .then(res => {
                // Enregistrement du token dans le localStorage
                // Si la requête est réussie: redirection vers page Accueil
                if(res.status === 200){
                    const token = res.data
                    localStorage.setItem('token', JSON.stringify(token.token))
                    window.location.href = 'http://localhost:3000/accueil'
                }
            }).catch(err => {
                console.log(err)
            })
    }



    /* CI-DESSOUS:
    *   - Form:
            Input Email 
            Input Password
            Bouton Login (submit)
        - Img-Logo
    */

        
    /** AFFICHAGE PAGE LOGIN SI USER PAS ENCORE CONNECTE. SI DEJA CONNECTE => REDIRECTION PAGE ACCUEIL **/
    if( isLoggedIn === false ){
        return (
            <main id="mainContent">
                <form id="mainContent__form" onSubmit={handleSubmit}>
                    <div className="input__container">
                        <input 
                            placeholder="Email"
                            type="email" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="email"
                            value={formLogin.email}/>
                    </div>    
                    <div className="input__container">
                        <input 
                            placeholder="Password"
                            type="password" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="password"
                            value={formLogin.password}/>
                    </div>
                    <button 
                        className="submitButton">
                        Login
                    </button>
                </form>
                <div className="signup__container">
                    <Link to="/signup" className="signup__link">Créer un compte</Link>
                </div>
                <div className="img__container">
                    <img 
                        src={logo}
                        className="main--logo"
                        alt="Groupomania World Logo"/>
                </div>
            </main>
        )
    } else {
        window.location.href = 'http://localhost:3000/accueil'
    }
}

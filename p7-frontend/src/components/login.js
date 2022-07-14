/* 
*           LOGIN
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon-v.login.svg"
import axios from "axios"
import { Link, useNavigate, Navigate } from "react-router-dom"


export default function Login() {
    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()

    let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
    
    /** VERIFICATION STATUT CONNEXION **/
    // Statut Login de l'utilisateur (en fonction de la présence du token dans le localStorage)
    const [isLoggedIn, setIsLoggedIn] = useState(()=>{

        // Si Token présent dans LocalStorage, alors on fait passer le statut "isLoggedIn", à true ("connecté");
        // Sinon on retourne false 
        if (tokenInLocalStorage !== null ){
            return true
        } else {
            return false
        }
    })



    /** OBJET FORMULAIRE **/
    // Création d'un composant-objet, contenant email et password:
    const [formLogin, setFormLogin] = useState(
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
                // Si la requête est réussie: 
                // Enregistrement du token + de l'user_id, dans le localStorage
                // redirection vers page Accueil
                if(res.status === 200){
                    const token = res.data
                    localStorage.setItem('token', JSON.stringify(token.token))
                    localStorage.setItem('user_id', JSON.stringify(token.user_id))
                    localStorage.setItem('isAdmin', JSON.stringify(token.isAdmin))
                    navigate('/accueil')
                }
            }).catch(err => {
                console.log(err)
            })
    }




    /** AFFICHAGE PAGE LOGIN SI USER PAS ENCORE CONNECTE. Si déjà connécté => Redirection vers Page Accueil **/
    if( isLoggedIn === false ){
        return (
            <main className="mainContent">
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
                    <div className="buttonContainer">
                        <button 
                            className="submitButton">
                            Login
                        </button>
                    </div>
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
        return <Navigate to='/accueil'/>
    }
}

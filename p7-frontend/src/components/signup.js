/*
*               SIGN-UP
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link, useNavigate, Navigate } from "react-router-dom"



export default function Signup() {
    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()

    let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
    /** VERIFICATION STATUT CONNEXION **/
    // Statut Login de l'utilisateur ("non connecté" par défaut)
    const [isLoggedIn, setIsLoggedIn] = useState(()=>{

        // Si Token présent dans LocalStorage, alors on fait passer le statut "isLoggedIn", à true ("connecté");
        //  Sinon on retourne false 
        if (tokenInLocalStorage !== null ){
            return true
        } else {
            return false
        }
    })



    /** OBJET FORMULAIRE **/
    // Création d'un composant-objet, contenant email, password, Nom d'utilisateur, prénom, nom, role et bio:
    const [formSignup, setFormSignup] = useState(
        {email: "", password: "", firstname: "", lastname: "", role: "", bio: ""}
    )


    /** GESTION/ACTUALISATION DU FORMULAIRE **/
    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name):
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value effectués
        setFormSignup(prevFormSignup => {
            return {
                ...prevFormSignup,
                [name]: value
            }
        })
    }
    


    /** SOUMISSION ET RECEPTION REQUETE **/
    // Fonction au Submit/Signup (bouton login):
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()
        console.log(formSignup)
        // Submit la data au backend via POST
        axios.post('http://localhost:5000/api/user/signup', formSignup)
            .then(res => {
                // Si la requête est réussie: redirection vers page login
                if(res.status === 200){
                    navigate('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }




    /* CI-DESSOUS:
    *   - H1
        - Form:
            Input Email 
            Input Password
            Input Firstname
            Input Lastname
            Input Role
            Input Bio
            Bouton Inscription (submit)
        - Img-Logo
    */


    /** AFFICHAGE PAGE SIGN-IN, SI USER PAS ENCORE CONNECTE. Si déjà connécté => Redirection vers Page Accueil **/
    if( isLoggedIn === false ){
        return (
            <main className="mainContent">
                <div classname="title__container">
                    <h1 className="title__signup">Remplissez les champs suivants: </h1>
                </div>
                <form id="mainContent__form" onSubmit={handleSubmit}>
                    <div className="input__container">
                        <input 
                            placeholder="Email"
                            type="email" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="email"
                            value={formSignup.email}/>
                    </div>    
                    <div className="input__container">
                        <input 
                            placeholder="Mot de Passe"
                            type="password" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="password"
                            value={formSignup.password}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Prénom"
                            type="texte" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="firstname"
                            value={formSignup.firstname}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Nom"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="lastname"
                            value={formSignup.lastname}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Role"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="role"
                            value={formSignup.role}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Bio"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="bio"
                            value={formSignup.bio}/>
                    </div>
                    <button 
                        className="submitButton">
                        S'inscrire
                    </button>
                </form>
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

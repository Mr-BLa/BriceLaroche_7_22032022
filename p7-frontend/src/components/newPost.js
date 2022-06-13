/*
*              NEW POST
*/

import React from "react"
import { useState , useEffect } from 'react'
import logo from "../logos/icon.svg"
//import {useNavigate} from "react-router-dom"


export default function NewPost() {
    // Fonction qui nous permettra de programmer des changements de page
    //const navigate = useNavigate()

    // Définition variables éléments du localStorage
    let tokenInLocalStorage
    //let idInLocalStorage = JSON.parse(localStorage.getItem('user_id'))



        /** VERIFICATION STATUT CONNEXION **/
    // Statut Login de l'utilisateur ("non connecté" par défaut)
    const [isLoggedIn, setIsLoggedIn] = useState(()=>{
        tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))

        // Si Token présent dans LocalStorage, alors on fait passer le statut "isLoggedIn", à true ("connecté");
        // Sinon on retourne false 
        if (tokenInLocalStorage !== null ){
            return true
        } else {
            return false
        }
    })

    //`user_id`, `title`, `content`, `attachement


    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main id="mainContent">
                <div className="img__container">
                    <img 
                        src={logo}
                        className="main--logo"
                        alt="Groupomania World Logo"/>
                </div>
            </main>
        )
    }
}
/* 
*           Post By Id
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { DateTime } from "luxon"

export default function PostId() {
      // Get the userId param from the URL.
    let { userId } = useParams()

    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()


    // Définition variables éléments du localStorage
    let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
    let idInLocalStorage = JSON.parse(localStorage.getItem('user_id'))
    let isAdmin = JSON.parse(localStorage.getItem('isAdmin'))

            /** VERIFICATION STATUT CONNEXION **/
    // Statut Login de l'utilisateur ("non connecté" par défaut)
    const [isLoggedIn, setIsLoggedIn] = useState(()=>{

        // Si Token présent dans LocalStorage, alors on fait passer le statut "isLoggedIn", à true ("connecté");
        // Sinon on retourne false 
        if (tokenInLocalStorage !== null ){
            return true
        } else {
            return false
        }
    })

    
}
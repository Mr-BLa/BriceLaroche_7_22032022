/*
*               PROFIL
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link, useNavigate, Navigate } from "react-router-dom"



export default function ModifProfil() {
    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()

    // Définition variables éléments du localStorage
    let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
    let idInLocalStorage = JSON.parse(localStorage.getItem('user_id'))



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


        /** OBJET FORMULAIRE **/
    // Création d'un composant-objet, contenant: Nom d'utilisateur, prénom, nom, role et bio:
    const [formModify, setFormModify] = useState({
        username: "",
        firstname: "",
        lastname: "",
        role: "",
        bio: "",
    })


        /**  Au chargement de la page, récupération dans la BDD des éléments liés au profil **/
    // Récupérer la data au backend via Get/:id
    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/all/${idInLocalStorage}`, {
                headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
            })
                .then((res) => {
                    const data = res.data
                    setFormModify({
                        username: data.username,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        role: data.role,
                        bio: data.bio,
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
    }, []);



        /** GESTION/ACTUALISATION DU FORMULAIRE **/
    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name):
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value effectués
        setFormModify(prevFormModify => {
            return {
                ...prevFormModify,
                [name]: value
            }
        })
    }

    
        /** SOUMISSION ET RECEPTION REQUETE **/
    // Fonction au Submit/Signup (bouton login):
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()
        console.log(formModify)
        // Submit la data au backend via PUT
        axios.put(`http://localhost:5000/api/user/${idInLocalStorage}`, formModify, {
            headers: {
                'Authorization': `Bearer ${tokenInLocalStorage}`
            },
        })
            .then((res) => {
                // Message confirmation modification + retour page accueil
                    alert("Votre profil a été modifié")
                    navigate('/accueil')
                
            }).catch(err => {
                console.log(err)
            })
    }


    /**SUPPRESSION PROFIL**/
    function deleteProfil() {
        // Submit la data au backend via PUT
        axios.delete(`http://localhost:5000/api/user/${idInLocalStorage}`, {
            headers: {
                'Authorization': `Bearer ${tokenInLocalStorage}`
            },
        })
            .then((res) => {
                // Message confirmation suppression + retour page accueil
                    alert("Votre profil a été supprimé")
                    navigate('/')
                
            }).catch(err => {
                console.log(err)
            })
    }


        /* CI-DESSOUS:
    *   - H1
        - Form:
            Input Email
            Input Username
            Input Firstname
            Input Lastname
            Input Role
            Input Bio
            Bouton Inscription (submit)
        - Img-Logo
    */


    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main id="mainContent" className="accueil--main">
                <div classname="title__container">
                    <h1 className="title__signup">Modifiez votre Profil: </h1>
                </div>
                <form id="mainContent__form" onSubmit={handleSubmit}>   
                    <div className="input__container">
                        <input 
                            placeholder="Pseudo"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="username"
                            value={formModify.username}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Prénom"
                            type="texte" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="firstname"
                            value={formModify.firstname}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Nom"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="lastname"
                            value={formModify.lastname}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Role"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="role"
                            value={formModify.role}/>
                    </div>
                    <div className="input__container">
                        <input 
                            placeholder="Bio"
                            type="text" 
                            className="inputForm" 
                            onChange={handleChange}
                            name="bio"
                            value={formModify.bio}/>
                    </div>
                    <button 
                        className="submitButton">
                        Modifier
                    </button>
                </form>
                <button 
                    onClick={deleteProfil}
                    className="deleteButton">
                    Supprimer le Profil
                </button>
                <div className="img__container">
                    <img 
                        src={logo}
                        className="main--logo"
                        alt="Groupomania World Logo"/>
                </div>
            </main>
        )
    } else {
        return <Navigate to='/'/>
    }
}
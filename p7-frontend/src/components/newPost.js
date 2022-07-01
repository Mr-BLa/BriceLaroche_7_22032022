/*
*              NEW POST
*/

import React from "react"
import { useState , useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Navigate, useNavigate } from "react-router-dom"


export default function NewPost() {
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
    // Création d'un composant-objet, contenant: user_id, titre, content, attachement:
    const [formNewPost, setFormNewPost] = useState({
        user_id: idInLocalStorage,
        title: "",
        content: "",
        attachement: "",
    })



            /** GESTION/ACTUALISATION DU FORMULAIRE **/
    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name):
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value effectués
        setFormNewPost(prevformNewPost => {
            return {
                ...prevformNewPost,
                [name]: value
            }
        })
    }


        /** SOUMISSION ET RECEPTION REQUETE **/
    // Fonction au Submit Nouvelle requête:
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()
        // Submit la data au backend via POST
        axios.post(`http://localhost:5000/api/post/`, formNewPost, {
            headers: {
                'Authorization': `Bearer ${tokenInLocalStorage}`
            },
        })
            .then((res) => {
                // retour page accueil
                    navigate('/accueil')
                
            }).catch(err => {
                return res.sendStatus(400)
            })
    }



    /** AFFICHAGE PAGE NOUVELLE PUBLICATION SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main className="mainContent accueil--main">
                <div className="post--container postForm--container">
                    <h1 className="post__title">Créer une Nouvelle Publication :</h1>
                    <form id="post__form" onSubmit={handleSubmit}>
                        <h2 className="input__title">Titre de la publication:</h2>
                        <div className="input__container">
                            <input 
                                placeholder="Ajouter un Titre"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="title"
                                value={formNewPost.title}/>
                        </div>
                        <h2 className="input__title">Que souhaitez-vous partager? :</h2>
                        <div className="input__container">
                            <input 
                                placeholder="Saisissez votre message"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="content"
                                value={formNewPost.content}/>
                        </div>
                        <h2 className="input__title">Insérer ici, le lien URL d'une image (JPG, GIF, etc):</h2>
                        <div className="input__container">
                            <input 
                                placeholder="https://www.exemple.com"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="attachement"
                                value={formNewPost.attachement}/>
                        </div>
                        <div className="buttonContainer">
                            <button 
                                className="submitButton newPostSubmitButton">
                                Poster Nouvelle Publication
                            </button>
                        </div>
                    </form>
                </div>
                <div className="imgAccueil__container">
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
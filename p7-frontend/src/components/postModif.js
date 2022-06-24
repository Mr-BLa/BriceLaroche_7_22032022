/*
*              POST MODIF
*/

import React from "react"
import { useState , useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Navigate, useNavigate } from "react-router-dom"

export default function PostModif() {
    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()

    // Définition variables éléments du localStorage
    let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
    let idInLocalStorage = JSON.parse(localStorage.getItem('user_id'))
    let isAdmin = JSON.parse(localStorage.getItem('isAdmin'))
    let post_id = JSON.parse(localStorage.getItem('post_id'))


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
    const [formPostModif, setFormPostModif] = useState({
        user_id: idInLocalStorage,
        post_id: post_id,
        title: "",
        content: "",
        attachement: "",
    })


        /**  Au chargement de la page, récupération dans la BDD des éléments liés au profil **/
    // Récupérer la data au backend via Get/:id
    useEffect(() => {
        axios.get(`http://localhost:5000/api/post/all/${post_id}`, {
                headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
            })
                .then((res) => {
                    const data = res.data
                    setFormPostModif({
                        title: data.title,
                        content: data.content,
                        attachement: data.attachement,
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
        setFormPostModif(prevFormPostModif => {
            return {
                ...prevFormPostModif,
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
        axios.put(`http://localhost:5000/api/post/${post_id}`, formPostModif, {
            headers: {
                'Authorization': `Bearer ${tokenInLocalStorage}`
            },
        })
            .then((res) => {
                // retour page accueil
                localStorage.removeItem('post_id')
                alert("Votre post a été modifié")
                navigate('/accueil')
                
            }).catch(err => {
                console.log(err)
            })
    }

    /** AFFICHAGE PAGE POST MODIF SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true ) {
        return (
            <main className="mainContent accueil--main">
                <div className="post--container postForm--container">
                    <h1 className="post__title">Modifier la Publication :</h1>
                    <form id="post__form" onSubmit={handleSubmit}>
                        <h2 className="input__title">Titre de la publication:</h2>
                        <div className="input__container">
                            <input 
                                placeholder="Ajouter un Titre"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="title"
                                value={formPostModif.title}/>
                        </div>
                        <h2 className="input__title">Que souhaitez-vous partager? :</h2>
                        <div className="input__container">
                            <input 
                                placeholder="Saisissez votre message"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="content"
                                value={formPostModif.content}/>
                        </div>
                        <h2 className="input__title">Lien URL de la pièce jointe:</h2>
                        <div className="input__container">
                            <input 
                                placeholder="https://www.exemple.com"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="attachement"
                                value={formPostModif.attachement}/>
                        </div>
                        <button 
                        className="submitButton newPostSubmitButton">
                        Modifier la Publication
                    </button>
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
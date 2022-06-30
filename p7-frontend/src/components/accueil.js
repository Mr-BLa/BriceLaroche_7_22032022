/* 
*           Accueil App
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link, Navigate, useNavigate} from "react-router-dom"
import { DateTime } from "luxon"

export default function Accueil() {
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

        /** Tableau des posts **/
    const [allPosts, setAllPosts] = useState([])


        /**  POSTS: Au chargement de la page, récupération dans la BDD des posts **/
    // Récupérer la data au backend via Get/post/all/
    useEffect(() => {
        axios.get(`http://localhost:5000/api/post/all/`, {
                headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
            })
                .then((res) => {
                    const postsData = res.data
                    setAllPosts(postsData)
                })
                .catch((err) => {
                    console.log(err)
                })
    }, []);



        /** /!\ LUXON MARCHE PAS /!\ **/
    // console.log(allPosts.createdat)
    // let parseDate =  DateTime.fromISO("2022-04-11T22:00:00.000Z")
    // let jsDate = DateTime.fromJSDate(allPosts.createdat)
    // console.log(parseDate)
    // console.log(jsDate)

        /**MODIFICATION POST**/
    function postModif(post_id) {
        localStorage.setItem('post_id', JSON.stringify(post_id))
        navigate(`/accueil/postmodif`)
    }

        /**SUPPRESSION POST**/
    function postDelete(post_id) {
        if (window.confirm("Voulez vous supprimer le post?") === true ){
                // Submit la data au backend via PUT
            axios.delete(`http://localhost:5000/api/post/${post_id}`, {
                headers: {
                    'Authorization': `Bearer ${tokenInLocalStorage}`
                },
            })
                .then((res) => {
                    // Message confirmation suppression + retour page accueil
                        localStorage.removeItem('post_id')
                        alert("Votre publication a été supprimé")
                        navigate('/')
                    
                }).catch(err => {
                    console.log(err)
                })
        }
        
    }

    /**  **/
    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main className="mainContent accueil--main">
                {allPosts.map((post) => (
                    
                        <div 
                            key={`${post.post_id}`}
                            className="post--container">
                                <Link to={`/accueil/${post.post_id}`} className="post--link">
                                <h1 className="post__title">
                                    <span className="h1__namesData">{post.firstname} {post.lastname} - le {post.createdat} :</span>
                                    <span className="h1__postTitle">{post.title}</span>
                                </h1>
                                <div className="postContent--container">
                                    <p className="post__content">{post.content}</p>
                                    {
                                        post.attachement !== "" ? (<img src={post.attachement} alt={`Image posté par ${post.firstname} ${post.lastname}`} className="post__attachement"/>): null
                                    }
                                </div>  
                                </Link>
                                {  
                                    isAdmin === 1 || idInLocalStorage === post.user_id ? (<span className="title__btn--container">
                                        <button className="btn__modif" onClick={(e)=>{e.stopPropagation();postModif(post.post_id)}}>Modifier</button>
                                        <button className="btn__suppr" onClick={(e)=>{e.stopPropagation();postDelete(post.post_id)}}>Supprimer</button>
                                    </span>):null
                                }
                        </div>
                    
                ))}
                
                <div className="imgAccueil__container">
                    <img 
                        src={logo}
                        className="mainAccueil--logo"
                        alt="Groupomania World Logo"/>
                </div>
            </main>
        )
    } else {
        return <Navigate to='/'/>
    } 
}
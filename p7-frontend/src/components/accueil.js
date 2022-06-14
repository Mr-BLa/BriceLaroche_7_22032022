/* 
*           Accueil App
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link, Navigate } from "react-router-dom"
import { DateTime } from "luxon";

export default function Accueil() {
    const date = DateTime.fromISO()

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


        /** Tableau des posts **/
    const [allPosts, setAllPosts] = useState([])

        /** Tableau des commentaires**/
    const [allComments, setAllComments] = useState([])


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
    console.log(allPosts)


            /** COMMENTS: Au chargement de la page, récupération dans la BDD des commentaires **/
    // Récupérer la data au backend via Get/comments/all/
    useEffect(() => {
        axios.get(`http://localhost:5000/api/comments/all/`, {
                headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
            })
                .then((res) => {
                    const commentsData = res.data
                    setAllComments(commentsData)
                    
                })
                .catch((err) => {
                    console.log(err)
                })
    }, []);
    console.log(allComments)

    // 
    
    


    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main id="mainContent" className="accueil--main">
                {allPosts.map((post) => (
                    <div 
                        key={`${post.post_id}`}
                        className="post--container">
                            <h1 className="post__title">{post.firstname} {post.lastname} - le {post.createdat}<br/> {post.title}</h1>
                            <div className="postContent--container">
                                <p className="post__content">{post.content}</p>
                                <div className="post__attachement">{post.attachement}</div>
                            </div>
                            <div className="comments--container">
                                <p className="post__comments"></p>
                            </div>
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
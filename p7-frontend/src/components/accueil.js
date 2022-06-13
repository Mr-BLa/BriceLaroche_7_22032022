/* 
*           Accueil App
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link, Navigate } from "react-router-dom"

export default function Accueil() {


    // Définition variables éléments du localStorage
    let tokenInLocalStorage
    let idInLocalStorage = JSON.parse(localStorage.getItem('user_id'))



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



        /** Tableau des posts **/
    const [allPosts, setAllPosts] = useState([])

            // Retrouver les username et les user_id présent dans allPosts

    // Création d'un tableau qui listera les user_id en fonction des username

    const [findUsername, setFindUsername] = useState([ {user_id : "", username: ""} ])
    
        /**  Au chargement de la page, récupération dans la BDD des posts **/
    // Récupérer la data au backend via Get/user/all/
    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/all/`, {
            headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
        })
            .then((res) => {
                const userData = res.data

                userData.forEach(element => {
                    setFindUsername(prevFindUsername => [
                        ...prevFindUsername,
                        {
                        user_id: element.user_id,
                        username: element.username,
                        },
                    ])
                console.log(userData)
                console.log(findUsername)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);


        /**  Au chargement de la page, récupération dans la BDD des posts **/
    // Récupérer la data au backend via Get/post/all/
    useEffect(() => {
        axios.get(`http://localhost:5000/api/post/all/`, {
                headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
            })
                .then((res) => {
                    const postsData = res.data
                    setAllPosts(postsData)
                    console.log(allPosts)
                })
                .catch((err) => {
                    console.log(err)
                })
    }, []);
    console.log(allPosts)




    /** Tableau des posts **/


    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main id="mainContent" className="accueil--main">
                {allPosts.map((post) => (
                    <div 
                        key={`${post.post_id}`}
                        className="post--container">
                            <h1 className="post__title">{post.user_id} - le {post.createdAt}<br/> {post.title}</h1>
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
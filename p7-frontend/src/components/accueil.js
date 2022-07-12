/* 
*           Accueil App
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import likeLogo from  "../logos/icon-thumbs-up-solid.svg"
import likeLogoRed from "../logos/icon-thumbs-up-solid - red.svg" 
import axios from "axios"
import { Link, Navigate, useNavigate} from "react-router-dom"
import formatDate from "../utils/formatdate"

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



        /**MODIFICATION POST**/
    function postModif(post_id) {
        localStorage.setItem('post_id', JSON.stringify(post_id))
        navigate(`/postmodif`)
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


        /** GESTION LIKES **/

    // /** Tableau des posts **/
    // const [likesByPost, setLikesByPost] = useState([])
    // /**  LIKES: Au chargement de la page, récupération dans la BDD du nombre de likes **/
    // // Récupérer la data au backend via Get/post/all/
    // function numberOfLikes(post_id){
        
    //     axios.get(`http://localhost:5000/api/likes_users_post/all/${post_id}`, {
    //             headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
    //         })
    //             .then((res) => {
    //                 const likesData = res.data
    //                 setLikesByPost(likesData)
    //                 console.log(likesByPost)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             })
    // }
    /* Like d'un post */
    function liked(post_id) {
        // Envoie requete post à la BDD
        axios.post(`http://localhost:5000/api/likes_users_post/`, {user_id: idInLocalStorage, post_id: post_id}, {
            headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
        })
            .then((res) => {
                const likedData = res.data
                console.log(likedData)
            })
            .catch((err) => {
                console.log(err)
            })
    
        // Définition variables DOM et passage de l'icône "non-liké" à l'icone "liké"
        const iconNotLiked = document.getElementById("icon__notLiked")
        const iconLiked = document.getElementById("icon__liked")
        iconLiked.style.display = "block"
        iconNotLiked.style.display = "none"
    }

    /* Délike d'un post */
    function notLiked(post_id) {
        // Envoie requete delete à la BDD
        axios.delete(`http://localhost:5000/api/likes_users_post/${post_id}`, {data: {user_id: idInLocalStorage} }, {
            headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
        })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

        // Définition variables DOM et passage de l'icône "liké" à l'icone "non-liké"
        const iconNotLiked = document.getElementById("icon__notLiked")
        const iconLiked = document.getElementById("icon__liked")
        iconLiked.style.display = "none"
        iconNotLiked.style.display = "block"
    }

    // désactiver le link sur les icones likes
    function disableLink() {
        const link = document.getElementsByClassName("disabled-link")
        link.style = "pointers-events: none"
    }
    

    
    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main className="mainContent accueil--main">
                {allPosts.map((post) => (
                    
                        <div 
                            key={`${post.post_id}`}
                            className="post--container">
                                <Link to={`/${post.post_id}`} className="post--link disabled-link">
                                <h1 className="post__title">
                                    <span className="h1__namesData">{post.firstname} {post.lastname} - le {formatDate(post.createdat)} :</span>
                                    <div className="h1__titleContainer">
                                        <span className="h1__postTitle">{post.title}</span>
                                        <div className="h1_Icons_Container" >
                                            {disableLink}
                                            <img src={likeLogo} alt="like logo" id="icon__notLiked" className="h1__icon"
                                            onClick={(e)=>{e.stopPropagation(); liked(post.post_id)}}/>

                                            <img src={likeLogoRed} alt="like logo" id="icon__liked" className="h1__icon"
                                            onClick={(e)=>{e.stopPropagation(); notLiked(post.post_id)}}/>

                                            {/* <p className="likesNumber">{numberOfLikes(post.post_id)} {likesByPost.Likes}</p> */}
                                        </div>
                                    </div>
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
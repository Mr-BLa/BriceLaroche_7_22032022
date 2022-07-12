/* 
*           Post By Id
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import likeLogo from "../logos/icon-thumbs-up-solid.svg"
import likeLogoRed from "../logos/icon-thumbs-up-solid - red.svg" 
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import formatDate from "../utils/formatdate"

export default function PostId() {
    // Get the userId param from the URL.
    let { post_id } = useParams()
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


                /** OBJET FORMULAIRE **/
    // Création d'un composant-objet, contenant: user_id, titre, content, attachement:
    const [formNewComment, setFormNewComment] = useState({
        user_id: idInLocalStorage,
        post_id: post_id,
        text: "",
    })

                /** GESTION/ACTUALISATION DU FORMULAIRE **/
    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name):
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value effectués
        setFormNewComment(prevformNewComment => {
            return {
                ...prevformNewComment,
                [name]: value
            }
        })
    }


        /** Tableau du post **/
    const [postById, setPostById] = useState([])

        /** Tableau des commentaires**/
    const [allComments, setAllComments] = useState([])


            /**  POST: Au chargement de la page, récupération dans la BDD du post **/
    // Récupérer la data au backend via Get/post/all/:id
    useEffect(() => {
        axios.get(`http://localhost:5000/api/post/all/${post_id}`, {
                headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
            })
                .then((res) => {
                    const postData = res.data
                    setPostById(postData)
                })
                .catch((err) => {
                    console.log(err)
                })
    }, []);


        /** COMMENTAIRES: Au chargement, récupération dans la BDD des commentaires liés à ce post**/
    //Récupérer la data au backend, via get/comments/all
    useEffect(() => {
        axios.get(`http://localhost:5000/api/comments/all/${post_id}`, {
            headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
        })
            .then((res) => {
                const commentData = res.data
                setAllComments(commentData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);



            /** SOUMISSION ET RECEPTION REQUETE **/

    /* CREATION Commentaire */
    // Fonction au Submit Nouvelle requête:
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()
        // Submit la data au backend via POST
        axios.post(`http://localhost:5000/api/comments/`, formNewComment, {
            headers: {
                'Authorization': `Bearer ${tokenInLocalStorage}`
            },
        })
            .then((res) => {
                // retour page accueil
                    localStorage.removeItem('post_id')
                    navigate('/accueil')
                
            }).catch(err => {
                console.log(err)
            })
    }

        

        /* MODIFICATION Commentaire */
    // Fonction au Submit Nouvelle requête:
    function handleModify(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()

        // Définition variables DOM
        const formCreate = document.getElementById("form_create")
        const formModify = document.getElementById("form_modify")

        // Définition comment_id (que l'on sauvegarde dans le localStorage)
        let comment_idInLocalStorage = JSON.parse(localStorage.getItem('comment_id'))

        // Submit la data au backend via POST
        axios.put(`http://localhost:5000/api/comments/${comment_idInLocalStorage}`, formNewComment, {
            headers: {
                'Authorization': `Bearer ${tokenInLocalStorage}`
            },
        })
            .then((res) => {
                // retour page accueil
                    formCreate.style.display = "block"
                    formModify.style.display = "none"
                    localStorage.removeItem('comment_id')
                    navigate('/accueil')
                
            }).catch(err => {
                console.log(err)
            })
    }


    /**MODIFICATION POST**/
    function commentModif(comment_id) {
        localStorage.setItem('comment_id', JSON.stringify(comment_id))

        // Définition variables DOM
        const formCreate = document.getElementById("form_create")
        const formModify = document.getElementById("form_modify")
        formCreate.style.display = "none"
        formModify.style.display = "block"
    }

        /**SUPPRESSION POST**/
    function commentDelete(comment_id) {
        if (window.confirm("Voulez vous supprimer le commentaire?") === true ){
                // Submit la data au backend via PUT
            axios.delete(`http://localhost:5000/api/comments/${comment_id}`, {
                headers: {
                    'Authorization': `Bearer ${tokenInLocalStorage}`
                },
            })
                .then((res) => {
                    // Message confirmation suppression + retour page accueil
                        alert("Votre commentaire a été supprimé")
                        navigate(`/accueil`)
                    
                }).catch(err => {
                    console.log(err)
                })
        }
        
    }


        /** GESTION LIKES **/


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





    /** AFFICHAGE PAGE COMMENTAIRES SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main className="mainContent comment--main">
                {postById.map((post) => (
                    <div 
                        key={`${post.post_id}`}
                        className="post--container">
                            <h1 className="post__title">
                                <span className="h1__namesData">{post.firstname} {post.lastname} - le {formatDate(post.createdat)}</span>
                                <div className="h1__titleContainer">
                                    <span className="h1__postTitle">{post.title}</span>
                                    <div>
                                        <img src={likeLogo} alt="like logo" id="icon__notLiked" className="h1__icon"
                                            onClick={(e)=>{e.stopPropagation(); liked(post.post_id)}}/>

                                        <img src={likeLogoRed} alt="like logo" id="icon__liked" className="h1__icon"
                                            onClick={(e)=>{e.stopPropagation(); notLiked(post.post_id)}}/>

                                        {/* <p className="likesNumber">{numberOfLikes(post.post_id)} {likesByPost.Likes}</p> */}
                                    </div>
                                </div>
                            </h1>
                            <div className="postContent--container postContent--container__commentPost">
                                <p className="post__content">{post.content}</p>
                                {
                                    post.attachement !== "" ? (<img src={post.attachement} alt={`Image posté par ${post.firstname} ${post.lastname}`} className="post__attachement"/>): null
                                }
                            </div>                
                    </div>
                ))}
                {allComments.map((comment) => (
                    <div
                        key={`${comment.comment_id}`}
                        className="comment--container">
                            <h2 className="comment__title">
                                <span className="h2__namesData">{comment.firstname} {comment.lastname} - le {formatDate(comment.createdat)}</span>
                            </h2>
                            <p className="comment__text"> {comment.text} </p>
                            {  
                                isAdmin === 1 || idInLocalStorage === comment.user_id ? (<span className="comment__btn--container">
                                    <button className="btn__modif" onClick={()=>commentModif(comment.comment_id)}>Modifier</button>
                                    <button className="btn__suppr" onClick={()=>commentDelete(comment.comment_id)}>Supprimer</button>
                                </span>):null
                            }
                    </div>
                ))}
                <form id="form_create" className="comment__form comment__form__create" onSubmit={handleSubmit}>
                    <h3 className="input__title ">Commenter la Publication:</h3>
                        <div className="input__container">
                            <input 
                                placeholder="Votre commentaire"
                                type="texte" 
                                className="inputForm" 
                                onChange={handleChange}
                                name="text"
                                value={formNewComment.text}/>
                        </div>
                        <button 
                        className="submitButton postIdSubmitButton">
                        Commenter
                        </button>
                </form>
                <form id="form_modify" className="comment__form comment__form__modify" onSubmit={handleModify}>
                    <h3 className="input__title ">Modifier le Commentaire:</h3>
                        <div className="input__container">
                            <input 
                                placeholder="Votre commentaire"
                                type="texte" 
                                className="inputForm inputComment" 
                                onChange={handleChange}
                                name="text"
                                value={formNewComment.text}/>
                        </div>
                        <button 
                        className="submitButton postIdSubmitButton">
                        Modifier
                        </button>
                </form>
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
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
    let { post_id } = useParams()

    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()


    // Définition variables éléments du localStorage
    let tokenInLocalStorage = JSON.parse(localStorage.getItem('token'))
    let idInLocalStorage = JSON.parse(localStorage.getItem('user_id'))
    let isAdmin = JSON.parse(localStorage.getItem('isAdmin'))
    let post_idInLocalStorage = JSON.parse(localStorage.getItem('post_id'))


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
                    console.log(postData)
                    setPostById(postData)
                })
                .catch((err) => {
                    console.log(err)
                })
    }, []);
    console.log(postById)


        /** COMMENTAIRES: Au chargement, récupération dans la BDD des commentaires liés à ce post**/
    //Récupérer la data au backend, via get/comments/all
    useEffect(() => {
        axios.get(`http://localhost:5000/api/comments/all/${post_id}`, {
            headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` },
        })
            .then((res) => {
                const commentData = res.data
                console.log(commentData)
                setAllComments(commentData)
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);
    console.log(allComments)



            /** SOUMISSION ET RECEPTION REQUETE **/
    // Fonction au Submit Nouvelle requête:
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()
        console.log(formNewComment)
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
    /** /!\ LUXON MARCHE PAS /!\ **/
    // console.log(allPosts.createdat)
    // let parseDate =  DateTime.fromISO("2022-04-11T22:00:00.000Z")
    // let jsDate = DateTime.fromJSDate(allPosts.createdat)
    // console.log(parseDate)
    // console.log(jsDate)

    /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
    if( isLoggedIn === true) {
        return (
            <main id="mainContent" className="accueil--main">
                {postById.map((post) => (
                    <div 
                        key={`${post.post_id}`}
                        className="post--container">
                            <h1 className="post__title">
                                {post.firstname} {post.lastname} - le {post.createdat}<br/> {post.title}
                            </h1>
                            <div className="postContent--container">
                                <p className="post__content">{post.content}</p>
                                <div className="post__attachement">{post.attachement}</div>
                            </div>                
                    </div>
                ))}
                {allComments.map((comment) => (
                    <div
                        key={`${comment.comment_id}`}
                        className="comment--container">
                            <h2 className="comment__title">
                                {comment.firstname} {comment.lastname} - le {comment.createdat}
                            </h2>
                            <p className="comment__text"> {comment.text} </p>
                    </div>
                ))}
                <form id="comment__form" onSubmit={handleSubmit}>
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
/* 
*           Accueil App
*/

import React from "react"
import { useState, useEffect } from 'react'
import logo from "../logos/icon.svg"
import likeLogo from "../logos/icon-thumbs-up-solid.svg"
import likeLogoRed from "../logos/icon-thumbs-up-solid - red.svg"
import axios from "axios"
import { Link, Navigate, useNavigate } from "react-router-dom"
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {

    // Si Token présent dans LocalStorage, alors on fait passer le statut "isLoggedIn", à true ("connecté");
    // Sinon on retourne false 
    if (tokenInLocalStorage !== null) {
      return true
    } else {
      return false
    }
  })

  /** Tableau des posts **/
  const [allPosts, setAllPosts] = useState([])

  /** Déclaration fonction requête get/post/all **/
  function setPostRequest(token) {

    axios.get(`http://localhost:5000/api/post/all/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        setAllPosts(res.data.map(post=>{
          return {
            ...post,
            userLikeId: JSON.parse(post.userLikeId)
          }
        }))
      })
      .catch((err) => {
        console.log(err)
      })
  }


  /**  POSTS: Au chargement de la page, récupération dans la BDD des posts **/
  // Récupérer la data au backend via Get/post/all/
  useEffect(() => {
    setPostRequest(tokenInLocalStorage)
  }, []);


  /**MODIFICATION POST**/
  function postModif(post_id) {
    localStorage.setItem('post_id', JSON.stringify(post_id))
    navigate(`/postmodif`)
  }

  /**SUPPRESSION POST**/
  function postDelete(post_id) {
    if (window.confirm("Voulez vous supprimer le post?") === true) {
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

  /* Like d'un post */
  function liked(userLikeId, post_id) {
  
    // On récupère le tableau (sous forme de string, que l'on parse), on y push l'id de l'utilisateur qui like, puis on stringify le nouveau tableau et on fait une requete PUT, pour modifier le tableau dans post.userLikeId dans la BDD
    const likesTable = userLikeId
    likesTable.push(idInLocalStorage)
    const newUserLikeId = JSON.stringify(likesTable)

    // Requete put => BDD
    axios.put(`http://localhost:5000/api/post/userLikeId/${post_id}`, 
      { userLikeId: newUserLikeId },
      { headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` }}
    )
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

    // Rechargement des posts après modification
    setPostRequest(tokenInLocalStorage)
  }


  /* Délike d'un post */
  function notLiked(userLikeId, post_id) {

    // On récupère le tableau (sous forme de string, que l'on parse), on ENLEVE l'id de l'utilisateur qui like, puis on stringify le nouveau tableau et on fait une requete PUT, pour modifier le tableau dans post.userLikeId dans la BDD
    const likesTable = userLikeId
    const newUserLikeId = JSON.stringify(likesTable.filter(id => id !== idInLocalStorage))
    // Requete put => BDD
    axios.put(`http://localhost:5000/api/post/userLikeId/${post_id}`, 
      { userLikeId: newUserLikeId },
      { headers: { 'Authorization': `Bearer ${tokenInLocalStorage}` }}
    )
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

    // Rechargement des posts après modification
    setPostRequest(tokenInLocalStorage)
  }



  /** AFFICHAGE PAGE ACCUEIL SI USER CONNECTE. Si pas connécté => redirection page login **/
  if (isLoggedIn === true) {
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

                </div>
              </h1>
              <div className="postContent--container">
                <p className="post__content">{post.content}</p>
                {
                  post.attachement !== "" ? (<img src={post.attachement} alt={`Posté par ${post.firstname} ${post.lastname}`} className="post__attachement" />) : null
                }
              </div>
            </Link>
            {post.user_id !== idInLocalStorage && 
              <div className="Icons_Container">
                {
                  post.userLikeId.some(id=>id===idInLocalStorage) ?

                    <img src={likeLogoRed} alt="like logo" id="icon__liked" className="Icons_Container__icon"
                      onClick={(e) => { e.stopPropagation(); notLiked(post.userLikeId, post.post_id) }} />
                    
                    :
                    <img src={likeLogo} alt="like logo" id="icon__notLiked" className="Icons_Container__icon"
                      onClick={(e) => { e.stopPropagation(); liked(post.userLikeId, post.post_id) }} />
                }
                <p className="likesNumber">{post.userLikeId.length}</p>
              </div>
            }
            
            {
              (isAdmin === 1 || idInLocalStorage === post.user_id) && (<span className="title__btn--container">
                <button className="btn__modif" onClick={(e) => { e.stopPropagation(); postModif(post.post_id) }}>Modifier</button>
                <button className="btn__suppr" onClick={(e) => { e.stopPropagation(); postDelete(post.post_id) }}>Supprimer</button>
              </span>)
            }
          </div>
        ))}

        <div className="imgAccueil__container">
          <img
            src={logo}
            className="mainAccueil--logo"
            alt="Groupomania World Logo" />
        </div>
      </main>
    )
  } else {
    return <Navigate to='/' />
  }
}
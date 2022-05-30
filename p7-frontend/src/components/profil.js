/*
*               PROFIL
*/

import React from "react"
import logo from "../logos/icon.svg"
import axios from "axios"




export default function ModifProfil() {

        /** OBJET FORMULAIRE **/
    // Création d'un composant-objet, contenant email, password, Nom d'utilisateur, prénom, nom, role et bio:
    const [formSignup, setFormSignup] = React.useState(
        {email: "", password: "", username: "", firstname: "", lastname: "", role: "", bio: ""}
    )

        /** GESTION/ACTUALISATION DU FORMULAIRE **/
    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name):
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value effectués
        setFormSignup(prevFormSignup => {
            return {
                ...prevFormSignup,
                [name]: value
            }
        })
    }

        /** SOUMISSION ET RECEPTION REQUETE **/
    // Fonction au Submit/Signup (bouton login):
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire)(et éviter de passer les value du formulaire dans l'url) au clic sur le bouton 
        event.preventDefault()
        console.log(formSignup)
        // Submit la data au backend via POST
        axios.post('http://localhost:5000/api/user/signup', formSignup)
            .then(res => {
                // Si la requête est réussie: redirection vers page login
                if(res.status === 200){
                    window.location.href = 'http://localhost:3000/accueil'
                }
            }).catch(err => {
                console.log(err)
            })
    }


        /* CI-DESSOUS:
    *   - H1
        - Form:
            Input Email 
            Input Password
            Input Username
            Input Firstname
            Input Lastname
            Input Role
            Input Bio
            Bouton Inscription (submit)
        - Img-Logo
    */


    /** AFFICHAGE PAGE Profil **/

    return (
        <main id="mainContent">
            <div classname="title__container">
                <h1 className="title__signup">Modifiez votre Profil: </h1>
            </div>
            <form id="mainContent__form" onSubmit={handleSubmit}>
                <div className="input__container">
                    <input 
                        placeholder="Email"
                        type="email" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="email"
                        value={formSignup.email}/>
                </div>    
                <div className="input__container">
                    <input 
                        placeholder="Mot de Passe"
                        type="password" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="password"
                        value={formSignup.password}/>
                </div>
                <div className="input__container">
                    <input 
                        placeholder="Pseudo"
                        type="text" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="username"
                        value={formSignup.username}/>
                </div>
                <div className="input__container">
                    <input 
                        placeholder="Prénom"
                        type="texte" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="firstname"
                        value={formSignup.firstname}/>
                </div>
                <div className="input__container">
                    <input 
                        placeholder="Nom"
                        type="text" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="lastname"
                        value={formSignup.lastname}/>
                </div>
                <div className="input__container">
                    <input 
                        placeholder="Role"
                        type="text" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="role"
                        value={formSignup.role}/>
                </div>
                <div className="input__container">
                    <input 
                        placeholder="Bio"
                        type="text" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="bio"
                        value={formSignup.bio}/>
                </div>
                <button 
                    className="submitButton">
                    Modifier
                </button>
            </form>
            <div className="img__container">
                <img 
                    src={logo}
                    className="main--logo"
                    alt="Groupomania World Logo"/>
            </div>
        </main>
    )
}
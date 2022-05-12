/* 
*           MAIN
*/

import React from "react"
import logo from "../logos/icon.svg"


export default function Main() {
    // Création d'un composant-objet, contenant email et password
    const [formLogin, setFormLogin] = React.useState(
        {email: "", password: ""}
    )

    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name)
    function handleChange(event) {
        // Déstructuration d'event.target pour sortir les éléments dont on a besoin
        const {name, value} = event.target
        // Actualisation de l'objet en fonction des changements de value éffectués
        setFormLogin(prevFormLogin => {
            return {
                ...prevFormLogin,
                [name]: value
            }
        })
    }
    
    // Fonction Bouton Login (Submit form)
    function handleSubmit(event) {
        //pour ne pas raffraichir la page (et donc le formulaire) au clic sur le bouton (et éviter de passer les value du form dans url)
        event.preventDefault()
        //submitToApi(formLogin)
        console.log(formLogin)
    }

    /*  CI-DESSOUS:
    *   - Form:
            Input Email 
            Input Password
            Bouton Login (submit)
        - Img-Logo
    */
    return (
        <main id="mainContent">
            <form id="mainContent__form" onSubmit={handleSubmit}>
                <div className="form__container">
                    <input 
                        placeholder="Email"
                        type="email" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="email"
                        value={formLogin.email}/>
                </div>    
                <div className="form__container">
                    <input 
                        placeholder="Password"
                        type="password" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="password"
                        value={formLogin.password}/>
                </div>
                <button 
                    className="submitButton">
                    Login
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

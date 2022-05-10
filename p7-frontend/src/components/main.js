/* 
*           MAIN
*/

import React from "react"
import logo from "../logos/icon.svg"

export default function Main() {
    //Objet avec email et password
    const [formLogin, setFormLogin] = React.useState(
        {email: "", password: ""}
    )
    console.log(formLogin)

    // On récupère notre objet avec tous ses composants et on actualise en fonction des éléments qui sont modifiés (via target.name)
    function handleChange(event) {
        setFormLogin(prevFormLogin => {
            return {
                ...prevFormLogin,
                [event.target.name]: event.target.value
            }
        })
    }
    


    return (
        <main id="mainContent">
            <form id="mainContent__form">
                <div className="form__container">
                    <label className="emailLabel">
                        Email     :      
                    </label>
                    <input 
                        type="email" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="email"/>
                        
                </div>    
                <div className="form__container">
                    <label>
                        Password :
                    </label>
                    <input 
                        type="password" 
                        className="inputForm" 
                        onChange={handleChange}
                        name="password"/>

                </div>
                <input 
                    type="submit" 
                    className="submitButton" 
                    value="Login" />
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

/* 
*           MAIN
*/

import React from "react"
import logo from "../logos/icon.svg"

export default function Main() {
    return (
        <main id="mainContent">
            <form id="mainContent__form">
                <div className="form__container">
                    <label className="emailLabel">
                        Email     :      
                    </label>
                    <input type="email" className="inputForm"/>
                </div>    
                <div className="form__container">
                    <label>
                        Password :
                    </label>
                    <input type="password" className="inputForm"/>
                </div>
                <input type="submit" className="submitButton" value="Login" />
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

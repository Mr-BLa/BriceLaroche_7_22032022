/* 
*           Accueil App
*/

import React from "react"
import logo from "../logos/icon.svg"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Accueil() {
    return(
        <main id="mainContent">
            <div>
                <p>À remplir</p>
            </div>
            <div className="imgAccueil__container">
                <img 
                    src={logo}
                    className="mainAccueil--logo"
                    alt="Groupomania World Logo"/>
            </div>
        </main>
    )
}
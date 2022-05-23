/*
*           HEADER APP
*/


import React from "react"
import HeaderAppLogo from "../logos/icon-left-font.svg"
import { Link } from "react-router-dom"

export default function HeaderApp() {
    return (
        <Link to="/accueil">
            <header id="headerAccueilContainer">
                <nav id="navBarAccueil">
                    <img 
                        src={HeaderAppLogo}
                        className="headerAccueil--logo"
                        alt="Groupomania Logo"/>
                </nav>
            </header>
        </Link>
    )
}

/*
*           HEADER
*/

import React from "react"
import logo from "../logos/icon-above-font.svg"


export default function Header() {
    return (
        <header id="headerContainer">
            <nav id="navBar">
                <img 
                    src={logo}
                    className="header--logo"
                    alt="Groupomania Logo"/>
            </nav>
        </header>
    )
}


/*
*           HEADER LOGIN/SIGNUP
*/

import React from "react"
import Headerlogo from "../logos/icon-above-font.svg"
import { Link } from "react-router-dom"

export default function HeaderStart() {
    return (
        <Link to="/">
            <header id="headerContainer">
                <nav id="navBar">
                    <img 
                        src={Headerlogo}
                        className="header--logo"
                        alt="Groupomania Logo"/>
                </nav>
            </header>
        </Link>
    )
}


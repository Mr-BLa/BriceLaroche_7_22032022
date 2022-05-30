/*
*           HEADER APP
*/


import React from "react"
import HeaderAppLogo from "../logos/icon-left-font.svg"
import ProfilLogo from "../logos/iconmonstr-user-20.svg"
import { Link } from "react-router-dom"

export default function HeaderApp() {
    /** DropDown **/
    /* Quand l'user clique sur le bouton, toggle entre "hide" et "show" le dropdown*/
    function dropDown(){
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Ferme le menu dropdown, si l'user clique à l'éxtérieur de celui-ci
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    

    /**DECONNEXION**/
    function logOff() {
        localStorage.removeItem('token')
        window.location.href = 'http://localhost:3000/'
    }


    return (
        <Link to="/accueil/">
            <header id="headerAccueilContainer">
                <nav id="navBarAccueil">
                    <img 
                        src={HeaderAppLogo}
                        className="headerAccueil--logo"
                        alt="Groupomania Logo"/>
                    <div className="dropdown">
                        <img
                            src={ProfilLogo}
                            className="headerAccueil--profilLogo dropbtn"
                            alt="Profil Logo"
                            onClick={dropDown}/>
                                <div id="myDropdown" className="dropdown-content">
                                    <Link to="/accueil/profil" className="profil--link">Profil</Link>
                                    <button onClick={logOff}>Déconnexion</button>
                                </div>
                    </div>
                </nav>
            </header>
        </Link>
    )
}
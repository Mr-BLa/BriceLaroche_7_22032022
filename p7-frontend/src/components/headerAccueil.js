/*
*           HEADER APP
*/


import React from "react"
import HeaderAppLogo from "../logos/icon-left-font.svg"
import ProfilLogo from "../logos/iconmonstr-user-20.svg"
import { Link } from "react-router-dom"

export default function HeaderApp() {
    /** DropDown **/
    /* When the user clicks on the button, toggle between hiding and showing the dropdown content */
    function dropDown(){
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
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
    function delog() {
        localStorage.removeItem('token')
        console.log(localStorage)
        window.location.href = 'http://localhost:3000/'
    }

    return (
        <Link to="/accueil">
            <header id="headerAccueilContainer">
                <nav id="navBarAccueil">
                    <img 
                        src={HeaderAppLogo}
                        className="headerAccueil--logo"
                        alt="Groupomania Logo"/>
                    <div className="dropdown">
                        <img
                            src={ProfilLogo}
                            className="headerAccueil--profilLogo"
                            className="dropbtn"
                            alt="Profil Logo"
                            onClick={dropDown}/>
                                <div id="myDropdown" className="dropdown-content">
                                    <a href="#">Profil</a>
                                    <a href="#" onClick={delog}>Déconnexion</a>
                                </div>
                    </div>
                </nav>
            </header>
        </Link>
    )
}
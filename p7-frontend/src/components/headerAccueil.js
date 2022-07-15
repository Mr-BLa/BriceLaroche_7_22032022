/*
*           HEADER APP
*/


import React from "react"
import HeaderAppLogo from "../logos/icon-left-font.svg"
import ProfilLogo from "../logos/iconmonstr-user-20.svg"
import { Link, useNavigate } from "react-router-dom"

export default function HeaderApp() {
    
    // Fonction qui nous permettra de programmer des changements de page
    const navigate = useNavigate()


    /** DropDown **/
    /* Quand l'user clique sur le bouton, toggle entre: "hide" et "show" le dropdown*/
    function dropDown() {
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
    

    /**NOUVEAU POST**/
    function newPost() {
        navigate('/new')
    }

    /**DECONNEXION**/
    function logOff() {
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('post_id')
        localStorage.removeItem('comment_id')
        navigate('/')
    }

    return (
        
            <header id="headerAccueilContainer" >
                <Link to='/accueil' className="link--HeaderAccueil">
                    <nav id="navBarAccueil">
                        <div className="navBar__Logo">
                            <img 
                                src={HeaderAppLogo}
                                className="headerAccueil--logo"
                                alt="Groupomania Logo"/>
                        </div>   
                        <div className="navBar__Btns">
                            <div className="BtnNewPost--Container">
                                <button className="newPostButton" >
                                    <Link to="/new" className="newPost--link">
                                        Nouvelle Publication
                                    </Link>
                                </button>
                            </div>
                            <div className="dropdown">
                                <img
                                    src={ProfilLogo}
                                    className="headerAccueil--profilLogo dropbtn"
                                    alt="Profil Logo"
                                    onClick={dropDown}/>
                                        <div id="myDropdown" className="dropdown-content">
                                            <Link to="/profil" className="profil--link">Profil</Link>
                                            <button>
                                                <Link to="/" className="logOff--link" onClick={logOff}>
                                                    Déconnexion
                                                </Link>
                                            </button>
                                        </div>
                            </div>
                        </div>
                    </nav>
                </Link>
            </header>
        
    )
}
/*
*           MODIF PROFIL
*/


import Header from "./components/headerAccueil"
import Profil from "./components/profil"
import {useParams} from "react-router-dom"

function ProfilPage() {
    
    return(
        <div>
            <Header />
            <Profil />
        </div>

    )
}

export default ProfilPage
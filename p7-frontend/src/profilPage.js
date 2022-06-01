/*
*           MODIF PROFIL
*/


import Header from "./components/headerAccueil"
import Profil from "./components/profil"
import {useParams} from "react-router-dom"

function ProfilPage() {
    //const params = useParams()
    
    return(
        <div>

            <Header />
            <Profil />
            {/* {params.id} */}
        </div>

    )
}

export default ProfilPage
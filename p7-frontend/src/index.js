/*
*           INDEX
*/


import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import '../src/css/index.css'
import '../src/css/accueil.css'
import LoginPage from './LoginPage'
import SignupPage from './signupPage'
import App from './App'
import ProfilPage from './profilPage'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="/accueil" element={<App />}/>
            <Route path="/accueil/profil" element={<ProfilPage />}/>
        </Routes>
    </BrowserRouter>, 
    document.getElementById('root'))

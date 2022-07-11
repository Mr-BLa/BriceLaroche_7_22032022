/*
*           INDEX
*/


import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from "react-router-dom"

// page login et signup
import '../src/css/index.css'
// page accueil
import '../src/css/accueil.css'
// page modifier profil
import '../src/css/profil.css'
// page nouvelle publication
import '../src/css/newPost.css'
// page commentaires
import '../src/css/commentPost.css'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/signupPage'
import App from './pages/App'
import ProfilPage from './pages/profilPage'
import NewPage from './pages/newPostPage'
import PostModification from './pages/postModifPage'
import PostById from './pages/postById'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="/accueil" element={<App />} />
            <Route path="/profil" element={<ProfilPage />}/>
            <Route path="/new" element={<NewPage />}/>
            <Route path="/postmodif" element={<PostModification />}/>
            <Route path="/:post_id" element={<PostById />} />
        </Routes>
    </BrowserRouter>, 
    document.getElementById('root'))

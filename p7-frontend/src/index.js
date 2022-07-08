/*
*           INDEX
*/


import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from "react-router-dom"
// index.css
import '../src/css/index.css'
// accueil.css
import '../src/css/accueil.css'
// profil.css
import '../src/css/profil.css'
// newPost.css
import '../src/css/newPost.css'
// commentPost.css
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
